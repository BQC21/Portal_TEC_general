
import { Equipos } from "../../supabase/equipos-types"
import { Materiales } from "../../supabase/materiales-types"
import { Project_Equipos } from "../../supabase/project_equipos_join"
import { Project_Materiales } from "../../supabase/project_materiales_join"
import { Quote } from "../../supabase/quote-types"
import { ConsumeItem, EatingItem, ManualCostMontoSection, ManualCosts, MontoItem, PersonalItem, QuantityPriceItem } from "./manual_resources"

// ---------------
// RECURSOS
// ---------------

export type EP_PriceTable_props = {
    selected_equipos: Project_Equipos[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddEquipo: (equipo: Equipos, cantidad?: number) => void
    onRemoveEquipo: (id: string | number) => void
}

export type Structure_PriceTable_props = {
    selected_equipos: Project_Equipos[]
    projectAngle?: string
    cantidadManual?: boolean
    onCantidadManualChange?: (value: boolean) => void
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddEquipo: (equipo: Equipos, cantidad?: number) => void
    onRemoveEquipo: (id: string | number) => void
}

export type Consume_PriceTable_props = {
    items: ConsumeItem[]
    selected_materiales: Project_Materiales[]
    selected_equipos?: Project_Equipos[]
    onUpdateCantidad: (id: string | number, cantidad: number) => void
    onAddMaterial: (material: Materiales, cantidad?: number) => void
    onReplaceMaterial: (id: string | number, material: Materiales) => void
    onRemoveMaterial: (id: string | number) => void
    onAddConsumeItem: (item: Omit<ConsumeItem, "id">) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
    onRemoveItem: (index: number) => void
    showConsiderChecklist?: boolean
    hiddenConsumeKeys?: string[]
    onToggleConsumeKey?: (key: string) => void
    onSetConsumeKeysHidden?: (keys: string[], hidden: boolean) => void
}

export type EPP_PriceTable_props = {
    items: QuantityPriceItem[],
    considerarEppReutilizable: boolean,
    onUpdateItem: (
        index: number, 
        field: keyof QuantityPriceItem, 
        value: QuantityPriceItem[keyof QuantityPriceItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

export type Persona_PriceTable_props = {
    items: PersonalItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof PersonalItem, 
        value: PersonalItem[keyof PersonalItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

export type SCTR_PriceTable_props = {
    items: QuantityPriceItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof QuantityPriceItem, 
        value: QuantityPriceItem[keyof QuantityPriceItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

export type Tooling_PriceTable_props = {
    items: QuantityPriceItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof QuantityPriceItem, 
        value: QuantityPriceItem[keyof QuantityPriceItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

// ---------------
// VIÁTICOS
// ---------------

export type Courier_PriceTable_props = {
    items: QuantityPriceItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof QuantityPriceItem, 
        value: QuantityPriceItem[keyof QuantityPriceItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

export type GastosViajes_PriceTable_props = {
    items: MontoItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof MontoItem, 
        value: MontoItem[keyof MontoItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}

// export type Eating_PriceTable_props = {
//     items: EatingItem[], 
//     onUpdateItem: (
//         index: number, 
//         field: keyof EatingItem, 
//         value: EatingItem[keyof EatingItem]
//     ) => void,
//     onAddItem: () => void,
//     onRemoveItem: (index: number) => void,
// }

// export type Hotel_PriceTable_props = {
//     manualResourceCosts: ManualCosts, 
//     updateManualCostMonto: (
//         section: ManualCostMontoSection, 
//         field: keyof MontoItem, 
//         value: MontoItem[keyof MontoItem]
//     ) => void
// }

// export type Mobility_PriceTable_props = {
//     manualResourceCosts: ManualCosts, 
//     updateManualCostMonto: (
//         section: ManualCostMontoSection, 
//         field: keyof MontoItem, 
//         value: MontoItem[keyof MontoItem]
//     ) => void
// }

// export type Traveling_PriceTable_props = {
//     manualResourceCosts: ManualCosts, 
//     updateManualCostMonto: (
//         section: ManualCostMontoSection, 
//         field: keyof MontoItem, 
//         value: MontoItem[keyof MontoItem]
//     ) => void
// }

export type UseQuoteSelectedProductsParams = {
    proyectoId: string | undefined;
    existingProjectEquipos: Project_Equipos[];
    existingProjectMateriales: Project_Materiales[];
    savedEquipos?: Project_Equipos[];
    savedMateriales?: Project_Materiales[];
};

export type UseUnitedQuoteAggregationParams = {
    quotes: Quote[];
    selectedIds: string[];
    existingProjectEquipos: Project_Equipos[];
    existingProjectMateriales: Project_Materiales[];
};
