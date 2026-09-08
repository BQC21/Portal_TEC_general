export const DEFAULT_VERSION = "1";

export function getVersionValue(version: string | undefined | null) {
    const trimmed = version?.trim();
    return trimmed || DEFAULT_VERSION;
}

export function formatVersionLabel(version: string | undefined | null) {
    return `Versión ${getVersionValue(version)}`;
}

export function getNextCopyVersion(_sourceVersion: string, existingVersions: string[]) {
    let maxVersion = 0;

    for (const value of existingVersions) {
        const numeric = Number.parseInt(value, 10);
        if (!Number.isInteger(numeric) || numeric <= 0) continue;
        maxVersion = Math.max(maxVersion, numeric);
    }

    return String(maxVersion + 1);
}
