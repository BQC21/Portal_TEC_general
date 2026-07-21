// -----
// M2
// -----

import { SetStateAction } from "react";
import { SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { computedRequirements } from "./Sizing/computes";
import { ProjectFormState } from "../supabase/project-types";
import { Equipos } from "../supabase/equipos-types";
import { Materiales } from "../supabase/materiales-types";
import { Zone, ZoneFormState } from "../supabase/zone-types";
import { QuoteFormState } from "../supabase/quote-types";
import {
    ManualCosts,
    MontoItem,
    PersonalItem,
    QuantityPriceItem,
} from "./Quotes/manual_resources";
import {
    grossMargin as GrossMarginCompute,
    precioFinal,
    recursos,
    viaticos,
} from "./Quotes/finantial_computes";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
import {
    ManualCostArraySection,
    ManualCostMontoSection,
} from "@/features/view/hooks/modals/Quotes/useManageLocalCosts";
import { ReportFormState } from "../supabase/report-types";

export type Tables_M2_props = {
    // equipos seleccionados (TABLA)
    selectedEquipmentTable: SelectedEquipmentItem[],
    setSelectedEquipmentTable: (value: SetStateAction<SelectedEquipmentItem[]>) => void,
    // materiales seleccionados (TABLA)
    selectedMaterialTable: SelectedMaterialItem[],
    setSelectedMaterialTable: (value: SetStateAction<SelectedMaterialItem[]>) => void,
    // calculos
    computedRequirements: computedRequirements,
    // form del proyecto
    form: ProjectFormState
}

export type Selectors_M2Props = {
    // equipos y materiales (FILAS)
    equipmentRows: string[];
    materialRows: string[];
    // equipos seleccionados (TABLA)
    selectedEquipmentTable: SelectedEquipmentItem[];
    selectedMaterialTable: SelectedMaterialItem[];
    // form del proyecto
    form: ProjectFormState;
    // calculos
    computedRequirements: computedRequirements;
    // tipado de equipos y materiales
    equipos: Equipos[];
    materiales: Materiales[];
    // equipos y materiales (FILAS)
    selectedEquipmentByRow: Record<string, { equipoId: string; description: string }>;
    selectedMaterialByRow: Record<string, { materialId: string; description: string }>;
    // condicionadores
    isEquipmentTypeSelected: (label: string) => boolean;
    showModuleSelector: boolean;
    showInverterSelector: boolean;
    showBatterySelector: boolean;
    // handlers
    handle_onChange: (value: string, label: string, index: string | number, product_type: string) => void;
    handle_click: (label: string, index: string | number, product_type: string) => void;
}

export type General_info_M2Props = {
    // form del proyecto
    form: ProjectFormState;
    // actualizador
    updateField: (field: string, value: string) => void;
    // ZONA
    form_zone: ZoneFormState;
    zones: Zone[];
    setForm_zone: (value: SetStateAction<ZoneFormState>) => void;
    setForm: (value: SetStateAction<ProjectFormState>) => void;
    // Parámetros
    ANGLE_OPTIONS: string[];
    selectedZone: string;
    selectedAngle: string;
}

export type Data_info_M2Props = {
    // form del proyecto
    form: ProjectFormState;
    // actualizador
    updateField: (field: string, value: string) => void;
    // handler
    handleOpcionLlenadoChange: (value: string) => void;
    // calculos
    computedRequirements: computedRequirements;
    // coloreado
    getFieldValueLightClass: (value: string) => string;
    getFieldValueDarkClass: (value: string) => string;
    shouldRender_M2_battery_properties: (value: string) => boolean;
    shouldRender_M2_configuration: (value: string) => boolean;
    // opciones
    CONNECTION_TYPE_OPTIONS: string[];
    // componentes seleccionados
    selectedEquipment: SelectedEquipmentItem;
    selectedInverter: SelectedEquipmentItem;
    selectedBattery: SelectedEquipmentItem;
}

// -----
// M3
// -----

export type Product_selectedProps = {
    equiposDescriptions: string[];
    materialesDescriptions: string[];
    form: QuoteFormState;
    updateField: <K extends keyof QuoteFormState>
                (field: K, value: QuoteFormState[K]) => void;
    grossMargin: { gm: GrossMarginCompute };
};

export type Quote_selectedProps = {
    form: ReportFormState;
    updateField: <K extends keyof ReportFormState>
                (field: K, value: ReportFormState[K]) => void;
}

type ManualCostHandlers = {
    updateManualCostMonto: (
        section: ManualCostMontoSection,
        field: keyof MontoItem,
        value: MontoItem[keyof MontoItem],
    ) => void;
    updateManualCostItem: (
        section: ManualCostArraySection,
        index: number,
        field: keyof QuantityPriceItem | keyof PersonalItem,
        value: QuantityPriceItem[keyof QuantityPriceItem] | PersonalItem[keyof PersonalItem],
    ) => void;
    addManualCostItem: (section: ManualCostArraySection) => void;
    removeManualCostItem: (section: ManualCostArraySection, index: number) => void;
};

export type ResourcesTablesProps = {
    recursos: recursos;
    projectEquipos: Project_Equipos[];
    projectMateriales: Project_Materiales[];
    manualResourceCosts: ManualCosts;
} & ManualCostHandlers;

export type ViaticosTablesProps = {
    viaticos: viaticos;
    manualResourceCosts: ManualCosts;
} & ManualCostHandlers;

export type SummaryCostTable_props = {
    precioFinal: precioFinal;
}