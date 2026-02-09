import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { accountsCollection, runsCollection } from '../services/collections';
const rankedCategories = ['3h', '2h', '1h', '30m'];
const parseCategory = (value) => {
    const match = rankedCategories.find((cat) => cat === value);
    if (!match) {
        throw new HttpError(400, `category must be one of: ${rankedCategories.join(', ')}`);
    }
    return match;
};
export const leaderboardsRouter = Router();
leaderboardsRouter.get('/:category', asyncHandler(async (req, res) => {
    const category = parseCategory(req.params.category);
    const limit = Math.min(Number(req.query.limit) || 15, 100);
    const runsCol = await runsCollection();
    const runs = await runsCol
        .find({ category, verified: true, demonsBeaten: { $ne: null } })
        .sort({ demonsBeatenCount: -1, createdAt: 1 })
        .limit(limit)
        .toArray();
    const accountsCol = await accountsCollection();
    const accounts = await accountsCol
        .find({ _id: { $in: runs.map((run) => run.userId) } })
        .toArray();
    const accountMap = new Map(accounts.map((acct) => [acct._id.toHexString(), acct]));
    const leaderboard = runs.map((run, index) => ({
        top: index + 1,
        runId: run.runId,
        user: accountMap.get(run.userId.toHexString())?.username ?? run.gdUserId,
        category: run.category,
        demonsBeaten: run.demonsBeaten ?? [],
    }));
    res.json({ category, leaderboard });
}));
