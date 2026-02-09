import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { accountsCollection } from '../services/collections';
import { AccountDocument } from '../types/account';

export const accountsRouter: Router = Router();

accountsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { gdUserId, username, discordHandle, timezone } = req.body ?? {};

    if (!gdUserId || typeof gdUserId !== 'string') {
      throw new HttpError(400, 'gdUserId is required');
    }

    if (!username || typeof username !== 'string') {
      throw new HttpError(400, 'username is required');
    }

    const collection = await accountsCollection();
    const existing = await collection.findOne({ gdUserId });

    if (existing) {
      throw new HttpError(409, 'Account already exists for this GD user');
    }

    const now = new Date();
    const account: AccountDocument = {
      _id: new ObjectId(),
      gdUserId,
      username,
      discordHandle: typeof discordHandle === 'string' ? discordHandle : undefined,
      timezone: typeof timezone === 'string' ? timezone : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(account);

    res.status(201).json({ ...account, _id: result.insertedId });
  }),
);

accountsRouter.get(
  '/:gdUserId',
  asyncHandler(async (req, res) => {
    const { gdUserId } = req.params;
    const collection = await accountsCollection();
    const account = await collection.findOne({ gdUserId });

    if (!account) {
      throw new HttpError(404, 'Account not found');
    }

    res.json(account);
  }),
);

accountsRouter.patch(
  '/:gdUserId',
  asyncHandler(async (req, res) => {
    const { gdUserId } = req.params;
    const { username, discordHandle, timezone } = req.body ?? {};
    const updates: Record<string, unknown> = {};

    if (username !== undefined) {
      if (typeof username !== 'string' || !username.trim()) {
        throw new HttpError(400, 'username must be a non-empty string');
      }
      updates.username = username;
    }

    if (discordHandle !== undefined) {
      if (discordHandle !== null && typeof discordHandle !== 'string') {
        throw new HttpError(400, 'discordHandle must be a string');
      }
      updates.discordHandle = discordHandle ?? undefined;
    }

    if (timezone !== undefined) {
      if (timezone !== null && typeof timezone !== 'string') {
        throw new HttpError(400, 'timezone must be a string');
      }
      updates.timezone = timezone ?? undefined;
    }

    if (!Object.keys(updates).length) {
      throw new HttpError(400, 'Provide at least one field to update');
    }

    updates.updatedAt = new Date();

    const collection = await accountsCollection();
    const result = await collection.findOneAndUpdate(
      { gdUserId },
      { $set: updates },
      { returnDocument: 'after' },
    );

    if (!result) {
      throw new HttpError(404, 'Account not found');
    }

    res.json(result);
  }),
);
