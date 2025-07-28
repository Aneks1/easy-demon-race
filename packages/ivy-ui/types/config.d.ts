export interface IvyConfig {
    baseColor1: string;
    baseColor2: string;
    accentColor1: string;
    accentColor2: string;
}
export declare const ThemeConfig: IvyConfig;
export declare function applyThemeToRoot(): void;
export declare function setTheme({ baseColor1, baseColor2, accentColor1, accentColor2 }: IvyConfig): void;
