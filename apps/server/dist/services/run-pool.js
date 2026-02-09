import { fetchRecentDemons } from './gd-client';
const PAGE_SIZE = 10;
const asBigInt = (value) => {
    try {
        return BigInt(value);
    }
    catch {
        return BigInt(0);
    }
};
export const locatePoolWindow = async (filter, cutoffId) => {
    const cutoff = asBigInt(cutoffId);
    const cache = new Map();
    const fetchPage = async (page) => {
        if (!cache.has(page)) {
            cache.set(page, await fetchRecentDemons(filter, page));
        }
        return cache.get(page);
    };
    let high = 1;
    let totalCount = 0;
    let candidatePage = await fetchPage(high);
    while (candidatePage.levels.length && asBigInt(candidatePage.levels[candidatePage.levels.length - 1].id) > cutoff && high < 1024) {
        high *= 2;
        candidatePage = await fetchPage(high);
        totalCount = Math.max(totalCount, candidatePage.totalCount);
    }
    let low = Math.max(1, Math.floor(high / 2));
    let bestPage = candidatePage;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const page = await fetchPage(mid);
        totalCount = Math.max(totalCount, page.totalCount);
        const last = page.levels[page.levels.length - 1];
        if (!last || asBigInt(last.id) <= cutoff) {
            bestPage = page;
            high = mid - 1;
        }
        else {
            low = mid + 1;
        }
    }
    const slot = bestPage.levels.findIndex((level) => asBigInt(level.id) <= cutoff);
    const slotIndex = slot >= 0 ? slot : bestPage.levels.length;
    const startIndex = (bestPage.page - 1) * PAGE_SIZE + slotIndex;
    const poolLen = Math.max(bestPage.totalCount - startIndex, 1);
    return {
        startIndex,
        poolLen,
        totalCountAtStart: Math.max(bestPage.totalCount, totalCount, startIndex + poolLen),
    };
};
