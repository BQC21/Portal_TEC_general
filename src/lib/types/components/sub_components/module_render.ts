import { SetStateAction } from "react";
import { SelectedEquipmentItem, SelectedMaterialItem } from "../../supabase/product-types";
import { computedRequirements } from "../Sizing/computes";
import { ProjectFormState } from "../../supabase/project-types";
import { Equipos, EquiposFormState } from "../../supabase/equipos-types";
import { Materiales, MaterialesFormState } from "../../supabase/materiales-types";
import { Zone, ZoneFormState } from "../../supabase/zone-types";
import { QuoteFormState } from "../../supabase/quote-types";
import {
    ManualCosts,
    MontoItem,
    PersonalItem,
    QuantityPriceItem,
} from "../Quotes/manual_resources";
import {
    grossMargin as GrossMarginCompute,
    precioFinal,
    recursos,
    viaticos,
} from "../Quotes/finantial_computes";
import { Project_Equipos } from "../../supabase/project_equipos_join";
import { Project_Materiales } from "../../supabase/project_materiales_join";
import {
    ManualCostArraySection,
    ManualCostMontoSection,
} from "@/features/view/hooks/modals/Quotes/useManageLocalCosts";
import { ReportFormState } from "../../supabase/report-types";
import { Brand, BrandFormstate } from "../../supabase/brand.types";
import { Supplier, SupplierFormstate } from "../../supabase/supplier-types";
import { Type, TypeFormstate } from "../../supabase/type-types";

// -----
// M1
// -----

export type ProductCategoryFilter = "Equipos" | "Materiales";

type M1ProductForm = EquiposFormState | MaterialesFormState;

export type Data_info_M1_props = {
    form: M1ProductForm;
    setForm: (value: SetStateAction<M1ProductForm>) => void;
    cascadeOptions?: {
        suppliers: string[];
        brands: string[];
        types: string[];
    };
    form_proveedor: SupplierFormstate;
    form_marca: BrandFormstate;
    form_tipo: TypeFormstate;
    setForm_proveedor: (value: SetStateAction<SupplierFormstate>) => void;
    setForm_marca: (value: SetStateAction<BrandFormstate>) => void;
    setForm_tipo: (value: SetStateAction<TypeFormstate>) => void;
    selectedSupplier: string | undefined;
    selectedBrand: string | undefined;
    selectedType: string | undefined;
    supplier: Supplier[];
    brand: Brand[];
    type: Type[];
    productCategory: ProductCategoryFilter;
    showProductCode?: boolean;
    useSuplierSelection: (
        value: string,
        supplier: Supplier[],
        setForm_proveedor: (value: SetStateAction<SupplierFormstate>) => void,
        setForm: (value: SetStateAction<M1ProductForm>) => void,
    ) => void;
    useBrandSelection: (
        value: string,
        brand: Brand[],
        setForm_marca: (value: SetStateAction<BrandFormstate>) => void,
        setForm: (value: SetStateAction<M1ProductForm>) => void,
    ) => void;
    useTypeSelection: (
        value: string,
        type: Type[],
        setForm_tipo: (value: SetStateAction<TypeFormstate>) => void,
        setForm: (value: SetStateAction<M1ProductForm>) => void,
    ) => void;
    updateField: <K extends keyof M1ProductForm>(
        field: K,
        value: M1ProductForm[K],
    ) => void;
};

export type General_info_M1_props_EQ = {
    form: EquiposFormState;
    updateField: <K extends keyof EquiposFormState>(
        field: K,
        value: EquiposFormState[K],
    ) => void;
};

export type General_info_M1_props_MAT = {
    form: MaterialesFormState;
    updateField: <K extends keyof MaterialesFormState>(
        field: K,
        value: MaterialesFormState[K],
    ) => void;
};

export type Price_info_M1_props = {
    form: M1ProductForm;
    updateField: <K extends keyof M1ProductForm>(
        field: K,
        value: M1ProductForm[K],
    ) => void;
};

// -----
// M2
// -----

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
    updateField: <K extends keyof ProjectFormState>(
        field: K,
        value: ProjectFormState[K],
    ) => void;
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
    form: QuoteFormState;
    manualResourceCosts: ManualCosts;
    onUpdateEquipoCantidad: (id: string | number, cantidad: number) => void;
    onUpdateMaterialCantidad: (id: string | number, cantidad: number) => void;
    onAddEquipo: (equipo: Equipos) => void;
    onRemoveEquipo: (id: string | number) => void;
    onAddMaterial: (material: Materiales) => void;
    onRemoveMaterial: (id: string | number) => void;
} & ManualCostHandlers;

export type ViaticosTablesProps = {
    viaticos: viaticos;
    manualResourceCosts: ManualCosts;
} & ManualCostHandlers;

export type SummaryCostTable_props = {
    precioFinal: precioFinal;
}

export type QuoteReportTable_Props = {
    precioFinal: number;
    igv: number;
};

export type Eq_Mat_Content_Props = {
    title: string;
    precioFinal: number;
    Eq_Mt: number;
    selectedEquipos: Project_Equipos[];
    selectedMateriales: Project_Materiales[];
}

export type MO_Content_Props = {
    title: string;
    precioFinal: number;
    MO: number;
}