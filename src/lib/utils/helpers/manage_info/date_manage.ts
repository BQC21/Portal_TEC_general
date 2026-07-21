// -------------------------
// Funciones para el manejo de fechas
// -------------------------


// función para imprimir valores nullables de fecha en un formato legible, o un guion si el valor es inválido o nulo
export function parseNullableDate(value: Date | string | null | undefined): Date | null {
	if (!value) return null;

	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

// Formato de fecha
export function formatDate(value: unknown) {
    if (!value) return "-";

    const date = value instanceof Date ? value : new Date(value as string | number);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-PE");
}

export function formatDate_DMY(value: unknown): string {
    if (!value) return "-";

    const date = value instanceof Date ? value : new Date(value as string | number);

    if (Number.isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// obtenemos la fecha actual para asignarla a los productos al momento de su creación o actualización
export function getCurrentDate(): Date {
    return new Date();
}