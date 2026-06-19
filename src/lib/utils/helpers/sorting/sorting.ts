import { ProductSortingOrder } from "../../options";

// ordenamiento según precio y código del proveedor
export function shouldRender_ProductSortingSelection(currentOrder: ProductSortingOrder) {
    if (currentOrder === "asc") {
        return { label: "Orden ascendente", nextOrder: "desc" as const };
    }

    if (currentOrder === "desc") {
        return { label: "Orden descendente", nextOrder: "codigo" as const };
    }

    if (currentOrder === "codigo") {
        return { label: "Ordenar por código del proveedor", nextOrder: "asc" as const };
    }

    return { label: "Ordenar", nextOrder: "codigo" as const };
}

// ordenamiento según el código del proveedor de forma descendente
export function sortGroupedByCodeSupplier<T extends Record<string, unknown>>(
    rows: T[],
    key: keyof T
): T[] {
    return [...rows].sort((a, b) => {
        // conversión a string
        const aValue = String(a[key] ?? ""); // fila actual
        const bValue = String(b[key] ?? ""); // fila siguiente

        // comparación de valores
        return aValue.localeCompare(bValue, "es", { sensitivity: "base", numeric: true }); // comparación natural de códigos
    });
}

// ordenamiento según precio
export function sortGroupedByPrice<T extends Record<string, unknown>>(
    rows: T[],
    sorting: ProductSortingOrder
): T[] {
    return [...rows].sort((leftEquipos, rightEquipos) => {
        const leftPrice = Number(leftEquipos.precio_dolares_igv ?? 0); // precio del row anterior
        const rightPrice = Number(rightEquipos.precio_dolares_igv ?? 0); // precio del row posterior

        return sorting === "asc"
            ? leftPrice - rightPrice // ascendente
            : rightPrice - leftPrice; // descendente
    });
}

// Ordenamiento de las zonas alfabéticamente
export function sortZones<T extends Record<string, unknown>>(
    rows: T[],
    key: keyof T
): T[] {
    return [...rows].sort((a, b) =>{
        const zone_1 = String(a[key] ?? "");
        const zone_2 = String(b[key] ?? "");

    // comparación de valaores
    return zone_1.localeCompare(zone_2, "es", { sensitivity: "base", numeric: true });
    })
}