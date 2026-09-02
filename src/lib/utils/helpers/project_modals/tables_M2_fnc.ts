import { computedRequirements } from "@/lib/types/components/Sizing/computes";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { optionalInputMax } from "../computes/PanelNumber";
import { equipmentRows, materialRows } from "./rows";

export function structureQuantityMax(
    item: SelectedEquipmentItem,
    form: ProjectFormState,
    requirements: computedRequirements,
): number | undefined {
    if (item.row !== "ESTRUCTURA") return undefined;
    const packSize = parseInt(item.description.match(/\d+/)?.[0] ?? "", 10);
    if (!Number.isFinite(packSize) || packSize <= 0) return undefined;

    if (item.description.includes("baterías")) {
        return optionalInputMax(Math.floor(Number(requirements.num_baterias) / packSize));
    }
    if (item.description.includes("módulos")) {
        return optionalInputMax(Math.floor(Number(form.strings) / packSize));
    }
    return undefined;
}

// --------------------------------------
// Funciones para confimar visibilidad
// --------------------------------------

export function isVisibleEquipment(item: SelectedEquipmentItem): boolean {
    return equipmentRows.includes(item.row);
}

export function isVisibleMaterial(item: SelectedMaterialItem): boolean {
    if (!materialRows.includes(item.row)) return false;
    if (item.row === "CABLE") return item.description.includes("AC");
    return true;
}

// --------------------------------------
// Funciones para la cantidad de materiales
// --------------------------------------

// Los ITM de corriente continua protegen una cadena cada uno, así que su cantidad la
// dicta el número de cadenas del proyecto.
export function isDcBreaker(item: SelectedMaterialItem): boolean {
    return item.description.includes("ITM") && item.description.includes("VDC");
}

// Los SPD también van uno por cadena.
export function isSpd(item: SelectedMaterialItem): boolean {
    return item.description.includes("SPD");
}

export function isAcBreaker(item: SelectedMaterialItem): boolean {
    return item.description.includes("ITM") && item.description.includes("AC");
}

// Cantidades que siguen al número de cadenas en lugar de escribirse a mano.
export function followsCadenaNumber(item: SelectedMaterialItem): boolean {
    return isDcBreaker(item) || isSpd(item);
}

// El usuario puede desbloquear estas cantidades con un botón de la tabla.
export function allowsQuantityOverride(item: SelectedMaterialItem): boolean {
    return isSpd(item) || isAcBreaker(item) || isDcBreaker(item);
}

export function materialRowKey(item: SelectedMaterialItem): string {
    return `${item.row}-${item.id}`;
}
