const DATE_COLUMN_HEADERS = new Set([
    "Fecha creada",
    "Fecha actualizada",
    "Creado",
    "Actualizado",
]);

export function isDateColumnHeader(header: string): boolean {
    return DATE_COLUMN_HEADERS.has(header);
}

export function getDateHeaderClass(header: string): string {
    return isDateColumnHeader(header)
        ? "bg-orange-400 text-white"
        : "text-slate-900";
}

export const DATE_CELL_CLASS = "bg-orange-100";
