import { Router } from 'express';
import { ObjectId } from 'mongodb';
import ms from 'ms';
import { randomBytes } from 'node:crypto';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { accountsCollection, runsCollection } from '../services/collections';
import { deriveCutoffId } from '../services/gd-client';
import { locatePoolWindow } from '../services/run-pool';
import { drawNextDemon, findRunById, updateRunOutcome } from '../services/run-manager';
const filters = ['Easy', 'Medium', 'Hard', 'Insane', 'Extreme'];
const categories = ['3h', '2h', '1h', '30m', 'Custom'];
const parseFilter = (value) => {
    if (typeof value === 'string') {
        const match = filters.find((tier) => tier.toLowerCase() === value.toLowerCase());
        if (match) {
            return match;
        }
    }
    return 'Easy';
};
const parseCategory = (value) => {
    if (typeof value === 'string') {
        const match = categories.find((tier) => tier.toLowerCase() === value.toLowerCase());
        if (match) {
            return match;
        }
    }
    return '3h';
};
const parseDemons = (input) => {
    if (input === null) {
        return null;
    }
    if (!Array.isArray(input)) {
        throw new HttpError(400, 'demonsBeaten must be an array or null');
    }
    return input.map((entry) => {
        if (!entry || typeof entry !== 'object') {
            throw new HttpError(400, 'Invalid demon entry');
        }
        const { id, name, creator } = entry;
        if (!id || typeof id !== 'string') {
            throw new HttpError(400, 'Each demon must have an id');
        }
        if (!name || typeof name !== 'string') {
            throw new HttpError(400, 'Each demon must have a name');
        }
        if (!creator || typeof creator !== 'string') {
            throw new HttpError(400, 'Each demon must have a creator');
        }
        return { id, name, creator };
    });
};
export const runsRouter = Router();
runsRouter.post('/', asyncHandler(async (req, res) => {
    const { userId, demonFilter, category, customDurationMs, seed, cutoffId } = req.body ?? {};
    if (!userId || typeof userId !== 'string' || !ObjectId.isValid(userId)) {
        throw new HttpError(400, 'userId must be a valid account id');
    }
    const accountId = new ObjectId(userId);
    const accounts = await accountsCollection();
    const account = await accounts.findOne({ _id: accountId });
    if (!account) {
        throw new HttpError(404, 'Account not found');
    }
    const filter = parseFilter(demonFilter);
    const runCategory = parseCategory(category);
    const isCustom = runCategory === 'Custom';
    let customTimeLabel;
    if (isCustom) {
        const duration = typeof customDurationMs === 'number' ? customDurationMs : Number(customDurationMs);
        if (!Number.isFinite(duration) || duration <= 0) {
            throw new HttpError(400, 'customDurationMs must be a positive number for custom categories');
        }
        const msLabel = ms(duration);
        customTimeLabel = typeof msLabel === 'string' ? msLabel : `${duration}ms`;
    }
    const runSeed = typeof seed === 'string' && seed.trim() ? seed : randomBytes(8).toString('hex');
    const resolvedCutoff = typeof cutoffId === 'string' && cutoffId.trim() ? cutoffId : await deriveCutoffId(filter);
    const poolWindow = await locatePoolWindow(filter, resolvedCutoff);
    if (!poolWindow.poolLen || poolWindow.poolLen < 1) {
        throw new HttpError(422, 'Unable to resolve a demon pool for the requested cutoff');
    }
    const now = new Date();
    const runObjectId = new ObjectId();
    const runId = runObjectId.toHexString();
    const run = {
        _id: runObjectId,
        runId,
        userId: account._id,
        gdUserId: account.gdUserId,
        demonFilter: filter,
        seed: runSeed,
        cutoffId: resolvedCutoff,
        startIndex: poolWindow.startIndex,
        poolLen: poolWindow.poolLen,
        totalCountAtStart: poolWindow.totalCountAtStart,
        step: 0,
        usedLevelIds: [],
        category: runCategory,
        categoryIsCustom: isCustom,
        customTimeLabel,
        createdAt: now,
        updatedAt: now,
        demonsBeaten: null,
        demonsBeatenCount: 0,
        gaveUp: false,
        verified: false,
        verificationFootageUrl: null,
    };
    const collection = await runsCollection();
    await collection.insertOne(run);
    res.status(201).json(run);
}));
runsRouter.get('/:runId', asyncHandler(async (req, res) => {
    const { runId } = req.params;
    const run = await findRunById(runId);
    if (!run) {
        throw new HttpError(404, 'Run not found');
    }
    res.json(run);
}));
runsRouter.post('/:runId/next', asyncHandler(async (req, res) => {
    const { runId } = req.params;
    const run = await findRunById(runId);
    if (!run) {
        throw new HttpError(404, 'Run not found');
    }
    const draw = await drawNextDemon(run);
    res.json({
        demon: draw.level,
        step: draw.step,
        liveIndex: draw.liveIndex,
    });
}));
runsRouter.patch('/:runId', asyncHandler(async (req, res) => {
    const { runId } = req.params;
    const { demonsBeaten, gaveUp, verified, verificationFootageUrl } = req.body ?? {};
    const run = await findRunById(runId);
    if (!run) {
        throw new HttpError(404, 'Run not found');
    }
    const demonPayload = typeof demonsBeaten === 'undefined' ? undefined : parseDemons(demonsBeaten);
    if (verified === true && !verificationFootageUrl) {
        throw new HttpError(400, 'verificationFootageUrl is required when marking a run as verified');
    }
    if (verified !== undefined && typeof verified !== 'boolean') {
        throw new HttpError(400, 'verified must be a boolean');
    }
    let gaveUpValue;
    if (typeof gaveUp !== 'undefined') {
        if (gaveUp !== false && typeof gaveUp !== 'string') {
            throw new HttpError(400, 'gaveUp must be false or a string describing time left');
        }
        gaveUpValue = gaveUp;
    }
    if (demonPayload === undefined &&
        typeof gaveUpValue === 'undefined' &&
        typeof verified === 'undefined' &&
        typeof verificationFootageUrl === 'undefined') {
        throw new HttpError(400, 'No updates supplied');
    }
    const updated = await updateRunOutcome(runId, {
        demonsBeaten: demonPayload,
        gaveUp: gaveUpValue,
        verified,
        verificationFootageUrl,
    });
    if (!updated) {
        throw new HttpError(404, 'Run not found');
    }
    res.json(updated);
}));
