import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { DemonFilter } from '../types/run';
import { fetchRecentDemons, deriveCutoffId } from '../services/gd-client';

const filters: DemonFilter[] = ['Easy', 'Medium', 'Hard', 'Insane', 'Extreme'];

const ensureFilter = (value: string | undefined): DemonFilter => {
  const match = filters.find((filter) => filter.toLowerCase() === (value ?? '').toLowerCase());
  if (!match) {
    throw new HttpError(400, `filter must be one of: ${filters.join(', ')}`);
  }
  return match;
};

export const demonsRouter: Router = Router();

// Sample endpoint that proxies recent demon lookups to the GD servers (or mock data fallback).
demonsRouter.get(
  '/recent',
  asyncHandler(async (req, res) => {
    const filter = ensureFilter((req.query.filter as string) ?? 'Easy');
    const page = Math.max(Number(req.query.page) || 1, 1);
    const result = await fetchRecentDemons(filter, page);
    res.json({ filter, page: result.page, totalCount: result.totalCount, levels: result.levels });
  }),
);

// Helper to surface a cutoff id based on the current recent list.
demonsRouter.get(
  '/cutoff',
  asyncHandler(async (req, res) => {
    const filter = ensureFilter((req.query.filter as string) ?? 'Easy');
    const cutoffId = await deriveCutoffId(filter);
    res.json({ filter, cutoffId });
  }),
);
