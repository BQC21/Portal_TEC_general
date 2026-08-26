const QUOTE_SEQUENCE_PATTERN = /^C(\d+)-/i;

export function getQuoteDateSuffix(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(3, "0");
    return `${year}${month}${day}`;
}

export function getNextQuoteSequence(existingCodes: string[] = []) {
    const max = existingCodes.reduce((acc, code) => {
        const match = QUOTE_SEQUENCE_PATTERN.exec(code ?? "");
        if (!match) return acc;
        const sequence = Number(match[1]);
        return Number.isFinite(sequence) ? Math.max(acc, sequence) : acc;
    }, 0);

    return max + 1;
}

export function formatQuoteCode(sequence: number, date = new Date()) {
    return `C${String(sequence).padStart(3, "0")}-${getQuoteDateSuffix(date)}`;
}

/** Patrón C001-YYYYMMDDD. El correlativo C### se incrementa según los códigos existentes. */
export function getQuoteCode(existingCodes: string[] = [], date = new Date()) {
    return formatQuoteCode(getNextQuoteSequence(existingCodes), date);
}
