type NodeEnvironment = 'development' | 'test' | 'production';
export declare const config: {
    readonly nodeEnv: NodeEnvironment;
    readonly port: number;
    readonly mongo: {
        readonly uri: string;
        readonly dbName: string;
        readonly serverSelectionTimeoutMs: number;
    };
    readonly corsOrigin: string | undefined;
};
export type AppConfig = typeof config;
export {};
