export interface IvyConfig {
    baseColor1: string
    baseColor2: string
    accentColor1: string
    accentColor2: string
}

export const ThemeConfig: IvyConfig = {
    baseColor1: "#121212ff",
    baseColor2: "#1c1c1cff",
    accentColor1: "#00ffe1ff",
    accentColor2: "#004f52ff",
}

export function applyThemeToRoot() {
    const root = document.documentElement
    root.style.setProperty('--base-color-1', ThemeConfig.baseColor1)
    root.style.setProperty('--base-color-2', ThemeConfig.baseColor2)
    root.style.setProperty('--accent-color-1', ThemeConfig.accentColor1)
    root.style.setProperty('--accent-color-2', ThemeConfig.accentColor2)
    console.log('sigma')
}

export function setTheme({ baseColor1, baseColor2, accentColor1, accentColor2 }: IvyConfig) {
    if (baseColor1) ThemeConfig.baseColor1 = baseColor1
    if (baseColor2) ThemeConfig.baseColor2 = baseColor2
    if (accentColor1) ThemeConfig.accentColor1 = accentColor1
    if (accentColor2) ThemeConfig.accentColor2 = accentColor2
    applyThemeToRoot()
}
