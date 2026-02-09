import axios from 'axios';
import { formatResponse } from '../lib/format-response';
const http = axios.create({
    baseURL: 'https://www.boomlings.com/database',
    timeout: 7000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});
const difficultyToParam = {
    Easy: '1',
    Medium: '2',
    Hard: '3',
    Insane: '4',
    Extreme: '5',
};
const PAGE_SIZE = 10;
const buildMockLevels = (filter) => {
    const prefix = `${filter} Demon`;
    return Array.from({ length: 60 }).map((_, index) => ({
        id: (900000 + index + 1).toString(),
        name: `${prefix} #${index + 1}`,
        creator: `Creator_${(index % 5) + 1}`,
        difficulty: filter,
        rating: 10 - (index % 10),
    }));
};
const mockLevelsMap = {
    Easy: buildMockLevels('Easy'),
    Medium: buildMockLevels('Medium'),
    Hard: buildMockLevels('Hard'),
    Insane: buildMockLevels('Insane'),
    Extreme: buildMockLevels('Extreme'),
};
const parseLevelSegment = (segment) => {
    if (!segment) {
        return null;
    }
    const formatted = formatResponse(segment, ':');
    const id = formatted['1'] ?? formatted['0'];
    if (!id) {
        return null;
    }
    return {
        id,
        name: formatted['2'] ?? `Level ${id}`,
        creator: formatted['3'] ?? 'Unknown',
        difficulty: formatted['4'] ?? 'Easy',
        rating: Number(formatted['18']) || undefined,
    };
};
const parsePayload = (raw, page) => {
    if (!raw || raw.trim() === '-1') {
        return {
            page,
            levels: [],
            totalCount: 0,
            hasMore: false,
        };
    }
    const [levelChunk, metaChunk] = raw.split('#');
    const segments = levelChunk.split('|').filter(Boolean);
    const levels = segments
        .map(parseLevelSegment)
        .filter((level) => Boolean(level));
    const meta = formatResponse(metaChunk ?? '', ':');
    const totalCount = Number(meta['all']) || Number(meta['55']) || Math.max(levels.length, page * PAGE_SIZE);
    return {
        page,
        levels,
        totalCount,
        hasMore: page * PAGE_SIZE < totalCount,
    };
};
const buildMockPage = (filter, page) => {
    const dataset = mockLevelsMap[filter];
    const start = (page - 1) * PAGE_SIZE;
    const levels = dataset.slice(start, start + PAGE_SIZE);
    return {
        page,
        levels,
        totalCount: dataset.length,
        hasMore: start + PAGE_SIZE < dataset.length,
    };
};
export const fetchRecentDemons = async (filter, page) => {
    try {
        const payload = new URLSearchParams({
            secret: 'Wmfd2893gb7',
            type: 'recent',
            count: PAGE_SIZE.toString(),
            page: (page - 1).toString(),
            diff: difficultyToParam[filter],
        });
        const response = await http.post('/getGJLevels21.php', payload.toString());
        return parsePayload(response.data, page);
    }
    catch (error) {
        console.warn('Falling back to mock GD data:', error.message);
        return buildMockPage(filter, page);
    }
};
export const deriveCutoffId = async (filter) => {
    const firstPage = await fetchRecentDemons(filter, 1);
    return firstPage.levels[0]?.id ?? Date.now().toString();
};
export const fetchLevelByIndex = async (filter, globalIndex) => {
    const page = Math.floor(globalIndex / PAGE_SIZE) + 1;
    const slot = globalIndex % PAGE_SIZE;
    const { levels } = await fetchRecentDemons(filter, page);
    return levels[slot] ?? null;
};
