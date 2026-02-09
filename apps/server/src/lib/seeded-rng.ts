export interface SeededRng {
  nextFloat: () => number;
  nextInt: (min: number, max: number) => number;
  advance: (steps: number) => void;
}

const hashSeed = (seed: string): number => {
  let h = 2166136261 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), 1 | x);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const createSeededRng = (seed: string): SeededRng => {
  const next = mulberry32(hashSeed(seed));

  const nextFloat = () => next();
  const nextInt = (min: number, max: number) => {
    if (max < min) {
      throw new Error('Invalid range for RNG');
    }

    const span = max - min + 1;
    return min + Math.floor(nextFloat() * span);
  };

  const advance = (steps: number) => {
    for (let i = 0; i < steps; i += 1) {
      nextFloat();
    }
  };

  return { nextFloat, nextInt, advance };
};

export const getPoolIndex = (seed: string, poolLength: number, consumedSteps: number) => {
  if (poolLength <= 0) {
    throw new Error('Pool length must be positive');
  }

  const rng = createSeededRng(seed);
  if (consumedSteps > 0) {
    rng.advance(consumedSteps);
  }

  const index = rng.nextInt(0, poolLength - 1);
  return { index, nextStep: consumedSteps + 1 };
};
