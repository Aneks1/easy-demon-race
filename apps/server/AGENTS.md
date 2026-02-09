# AI Agent Tasks

This is a server for my project "Demon Race" for Geometry Dash (GD).
This server is MongoDB and Express.js-based.

## Account system

Basic account system that stores user data in MongoDB. The only login option will be "login with GD", so our server items should reference the GD account.

## Run system:

When user presses "start" on the front-end, a "run" item is created on our server. 

A run object should store:

- RunID (String)
- CreatedAt (Date)
- UserID (String)
- DemonFilter ("Easy" | "Medium" | "Hard" | "Insane" | "Extreme")
- Seed (String) (If not provided in request params, generate random seed)
- CutOffId (String) (If not provided, generate it on request)
- Category ("3h" | "2h" | "1h" | "30m" | "Custom")
- categoryIsCustom() (function - returns bool)
- CustomTime (if categoriIsCustom(), then stringify time with ms package)
- DemonsBeaten (null, updated when the run finishes to be an array of: { name: string, id: string, creator: string })
- gaveUp (false | string, which states the time left when the user gave up)
- verified (bool)
- verificationFootageUrl (string if verified, otherwise null)

## Browse Demon

This part is tricky. You should get the Demons from GD servers, which implies that you need a HTTPClient.

I will handle requests to GD servers myself, but make a sample request system anyway.

The response from the GD servers needs to be formatted:

```ts
export type FormattedResponse =  Record<`${number}`, string>

/**
 * 
 * @param gdResponse The string of characters returned by a GD request
 * @param separator The char in which you want to split the string
 * @returns The string data as an object (FormattedResponse)
 */
export default function formatResponse(gdResponse: string, separator: string): FormattedResponse {
    const formatted: FormattedResponse = {}
    const keyVals = str.split(separator)
    
    for (let i = 0; i < keyVals.length; i += 2)
        formatted[keyVals[i] as `${number}`] = keyVals[i + 1]

    return formatted
}
```

This will give us an array of 10 levels.

### Reproducibility

We want runs to be reproducible: given the same seed and the same cutoffId, the roulette must generate the same sequence of levels, even weeks later after new levels have been uploaded.

Problem

RobTop’s “recent levels” list is ordered newest → oldest. When new levels are uploaded, they appear at the top, shifting every older level down by +N positions. So if we generate (page, slot) directly, the same seed can point to different levels later because the list shifted.

Key idea: define the pool by cutoffId

Define the pool as:

All Easy Demons with levelId <= cutoffId

New levels uploaded later will have levelId > cutoffId, so they must be excluded. This keeps the logical pool stable across time.

The system we must implement
1) Run parameters that must be stored

When a run starts, store these immutable parameters:

seed (string/int)

cutoffId (bigint) → “the newest allowed levelId”

startIndex (int) → global index (0-based) of the first item in the recent list where levelId <= cutoffId

poolLen (int) → number of items in the pool = totalCountAtStart - startIndex

step (int) → how many picks have been consumed so far (starts at 0)

Why store startIndex and poolLen?
Because those values define the pool in an index space that remains stable for that run. Even if the live list shifts due to new uploads, our run uses the frozen index space.

2) How to compute startIndex from cutoffId

We need to locate where the cutoff begins in the newest→oldest list.

Each page has 10 items. Convert (page, slot) into a 0-based global index:

globalIndex = (page - 1) * 10 + slot0 where slot0 = slot - 1

We must find the first item in the list with levelId <= cutoffId.

Efficient approach (few requests):

Exponential search on page number to find a page where the last item is <= cutoffId.

Binary search between previous page range to find the earliest page containing <= cutoffId.

Scan that page’s 10 items to find the first position where id <= cutoffId.

Result:

startIndex = (pageFound - 1) * 10 + firstSlot0

This startIndex is the pool’s “offset” inside the global recent list.

3) How to compute poolLen

We need the total number of matching items in the “recent easy demon” listing at run start:

If the endpoint provides totalPages or totalCount, use it.

Otherwise you can derive it from totalPages * 10 (with last page handling).

Let:

totalCountAtStart = total items in the listing at run start (for that filter)
Then:

poolLen = totalCountAtStart - startIndex

Important: if new levels are uploaded later, totalCount and startIndex would both increase by the same amount, but we do not recompute them mid-run. We freeze them at start.

4) PRNG should generate an index inside the pool, not a page number

Instead of choosing page/slot directly, the PRNG chooses a pool-relative index k:

k = rng.int(0, poolLen - 1)

Then map to the real global index:

liveIndex = startIndex + k

Then to page/slot:

page = floor(liveIndex / 10) + 1

slot = (liveIndex % 10) + 1

This is crucial: the PRNG operates in a stable pool coordinate system.

5) Reproducibility across weeks (why this works)

Weeks later, new levels have been uploaded, so the “recent” list shifted. But:

We still enforce levelId <= cutoffId

The pool is logically identical (same set of levelIds)

The PRNG produces the same sequence of k values

Each k refers to “the k-th element in the pool”

Therefore the same seed + cutoffId produces the same ordered roulette output.

6) Step-based deterministic continuation

To fetch “the next level” deterministically, we must ensure the PRNG is advanced consistently.

We store step and use it to derive picks in a stable way:

Each “next level” consumes exactly one k.

You can implement this either by:

keeping PRNG state in memory for the run, and persisting step, or

re-initializing the PRNG from seed and advancing it step times (slower but deterministic), then generating the next k.

Then increment step += 1.

7) Handle duplicates / invalid picks deterministically

The same k might map to a level you already used, or a missing slot (edge cases). To keep determinism:

Maintain a usedLevelIds set for the run.

When a pick hits an already-used level, consume the next PRNG value (next k) and try again.

This must be done in a deterministic loop with a max tries cap.

Because the PRNG sequence is deterministic, the re-roll sequence is deterministic too.

### Leaderboards

Each run category (except custom) should have a leaderboard (different endpoint for each category) that only includes runs with "verified: true". Leaderboards should be an object with the following properties:

- Top (number)
- RunID (string)
- User (string)
- Category: ("3h" | "2h" | "1h" | "30m")
- DemonsBeaten: (array of: { name: string, id: string, creator: string })