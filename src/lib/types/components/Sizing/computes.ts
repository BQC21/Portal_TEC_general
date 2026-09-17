import { SelectedEquipmentItem } from "../../supabase/product-types";

export type MonthlyValue = number | "";

export type CableRange = {
    label: string;
    min: number;
    max: number;
};

export type StructureOption = {
    id: string
    capacity: number
    unitCost: number
}

export type StructureCombinationMode = "at-most" | "at-least"

export type ModuloFVUnidadKind = "palet" | "unidad";

export type ModuloFVSelection = {
    id?: string;
    unidad?: string | null;
    paneles_palet?: number | null;
    cantidad?: number;
};

export type EquipoReportDisplayRow = {
    ids: string[];
    cod_producto: string;
    descripcion: string;
    unidad: string;
    cantidad: number;
};

export type EquipoReportSource = {
    id: string | number;
    cantidad?: unknown;
    equipo_info?: {
        tipo_de_producto?: string | null;
        descripcion?: string | null;
        unidad?: string | null;
        marca?: string | null;
        cod_producto?: string | null;
        paneles_palet?: number | null;
    } | null;
};

export type computedRequirements = {
    energia: string;
    potenciaDC: string;
    potenciaAC: string;
    strings_minimos: string;
    strings_maximos: string;
    itm_ac_min: string;
    itm_dc_min: string;
    spd_min: string;
    ah_sistema: string;
    num_baterias: string;
    selectedEquipment: SelectedEquipmentItem | undefined;
    selectedInverter: SelectedEquipmentItem | undefined;
    selectedBattery: SelectedEquipmentItem | undefined;
}