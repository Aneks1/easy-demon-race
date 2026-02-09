export interface SeededRng {
    nextFloat: () => number;
    nextInt: (min: number, max: number) => number;
    advance: (steps: number) => void;
}
export declare const createSeededRng: (seed: string) => SeededRng;
export declare const getPoolIndex: (seed: string, poolLength: number, consumedSteps: number) => {
    index: number;
    nextStep: number;
};
