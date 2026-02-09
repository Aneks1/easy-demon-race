import { runsCollection } from './collections';
import { getPoolIndex } from '../lib/seeded-rng';
import { fetchLevelByIndex } from './gd-client';
export const drawNextDemon = async (run) => {
    if (run.poolLen <= 0) {
        throw new Error('Pool is empty');
    }
    const usedIds = new Set(run.usedLevelIds);
    let cursor = run.step;
    for (let attempts = 0; attempts < run.poolLen * 2; attempts += 1) {
        const { index, nextStep } = getPoolIndex(run.seed, run.poolLen, cursor);
        cursor = nextStep;
        const liveIndex = run.startIndex + index;
        const level = await fetchLevelByIndex(run.demonFilter, liveIndex);
        if (!level) {
            continue;
        }
        if (usedIds.has(level.id)) {
            continue;
        }
        usedIds.add(level.id);
        const demonRecord = {
            id: level.id.toString(),
            name: level.name,
            creator: level.creator,
        };
        const collection = await runsCollection();
        const updated = await collection.findOneAndUpdate({ _id: run._id }, {
            $set: {
                step: cursor,
                usedLevelIds: Array.from(usedIds),
                updatedAt: new Date(),
            },
        }, { returnDocument: 'after' });
        if (!updated) {
            throw new Error('Unable to persist run progress');
        }
        return {
            level: demonRecord,
            step: cursor,
            liveIndex,
        };
    }
    throw new Error('Exhausted pool without finding a new demon');
};
export const updateRunOutcome = async (runId, patch) => {
    const collection = await runsCollection();
    const demons = patch.demonsBeaten ?? undefined;
    const updateStatement = {
        updatedAt: new Date(),
    };
    if (demons) {
        updateStatement.demonsBeaten = demons;
        updateStatement.demonsBeatenCount = demons.length;
    }
    else if (patch.demonsBeaten === null) {
        updateStatement.demonsBeaten = null;
        updateStatement.demonsBeatenCount = 0;
    }
    if (typeof patch.gaveUp !== 'undefined') {
        updateStatement.gaveUp = patch.gaveUp;
    }
    if (typeof patch.verified !== 'undefined') {
        updateStatement.verified = patch.verified;
    }
    if (typeof patch.verificationFootageUrl !== 'undefined') {
        updateStatement.verificationFootageUrl = patch.verificationFootageUrl;
    }
    const result = await collection.findOneAndUpdate({ runId }, { $set: updateStatement }, { returnDocument: 'after' });
    return result;
};
export const findRunById = async (runId) => {
    const collection = await runsCollection();
    return collection.findOne({ runId });
};
export const findRunByObjectId = async (id) => {
    const collection = await runsCollection();
    return collection.findOne({ _id: id });
};
