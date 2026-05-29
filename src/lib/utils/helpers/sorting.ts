// ordenamiento
export function shouldRender_ProductSortingSelection(currentOrder: "asc" | "desc" | null) {
    if (currentOrder === "asc") {
        return { label: "Orden ascendente", nextOrder: "desc" as const };
    }

    if (currentOrder === "desc") {
        return { label: "Orden descendente", nextOrder: "asc" as const };
    }

    return { label: "Ordenar por precio", nextOrder: "asc" as const };
}

// comparar el ordenamiento según el código del proveedor de forma descendente
export function sortGroupedByCodeSupplier<T extends Record<string, unknown>>(
    rows: T[],
    key: keyof T
): T[] {
    return [...rows].sort((a, b) => {
        const aValue = String(a[key] ?? ""); // fila actual
        const bValue = String(b[key] ?? ""); // fila siguiente

        return aValue.localeCompare(bValue, "es", { sensitivity: "base", numeric: true }); // comparación natural de códigos
    });
}