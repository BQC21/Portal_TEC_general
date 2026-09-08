export const DEFAULT_VERSION = "1";

export function getVersionValue(version: string | undefined | null) {
    const trimmed = version?.trim();
    return trimmed || DEFAULT_VERSION;
}

export function formatVersionLabel(version: string | undefined | null) {
    return `Versión ${getVersionValue(version)}`;
}

export function getNextCopyVersion(sourceVersion: string, existingVersions: string[]) {
    const prefix = `${sourceVersion}.`;
    let maxSuffix = 0;

    for (const value of existingVersions) {
        if (!value.startsWith(prefix)) continue;
        const rest = value.slice(prefix.length);
        if (!/^\d+$/.test(rest)) continue;
        maxSuffix = Math.max(maxSuffix, Number(rest));
    }

    return `${sourceVersion}.${maxSuffix + 1}`;
}
