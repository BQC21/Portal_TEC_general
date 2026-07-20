import { Brand, BrandFormData } from "../supabase/brand.types";
import { Equipos, EquiposFormData } from "../supabase/equipos-types";
import { Materiales, MaterialesFormData } from "../supabase/materiales-types";
import { SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { Project, ProjectFormData } from "../supabase/project-types";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
import { Quote, QuoteFormData } from "../supabase/quote-types";
import { Report, ReportFormData } from "../supabase/report-types";
import { Supplier, SupplierFormData } from "../supabase/supplier-types";
import { Type, TypeFormData } from "../supabase/type-types";
import { Zone, ZoneFormData } from "../supabase/zone-types";

// ------------------
// botones -- agregar
// ------------------

export type Button2ModalPropsEquipos = {
    existingEquipos: Equipos[];
    onAddEquipos: (equipo: EquiposFormData) => void;
};

export type Button2ModalPropsMateriales = {
    existingMateriales: Materiales[];
    onAddMateriales: (equipo: MaterialesFormData) => void;
};

export type Button2ModalPropsProject = {
    onAddProject: (
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
};

export type Button2ModalPropsZone = {
    onAddZone: (zone: ZoneFormData) => void;
};

export type Button2ModalPropsSupplier = {
    onAddSupplier: (supplier: SupplierFormData) => void;
};

export type Button2ModalPropsBrand = {
    onAddBrand: (brand: BrandFormData) => void;
};

export type Button2ModalPropsType = {
    onAddType: (type: TypeFormData) => void;
};

export type Button2ModalPropsQuote = {
    onAddQuote: (quote: QuoteFormData) => void;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
}

export type Button2ModalPropsReport = {
    onAddReport: (Report: ReportFormData) => void;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
}

// ------------------
// botones -- editar
// ------------------

export type EditEquiposModalProps = {
    equipo: Equipos;
    onUpdateEquipo: (equipo: Equipos) => void;
};

export type EditMaterialesModalProps = {
    material: Materiales;
    onUpdateMateriales: (material: Materiales) => void;
};

export type EditProjectModalProps = {
    project: Project;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
    onUpdateProject: (
        project: Project,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
};

export type EditZoneModalProps = {
    zone: Zone;
    onUpdateZone: (zone: Zone) => void;
};

export type EditSupplierModalProps = {
    supplier: Supplier;
    onUpdateSupplier: (supplier: Supplier) => void;
};

export type EditBrandModalProps = {
    brand: Brand;
    onUpdateBrand: (brand: Brand) => void;
};

export type EditTypeModalProps = {
    type: Type;
    onUpdateType: (type: Type) => void;
};

export type EditQuoteModalProps = {
    quote: Quote;
    onUpdateQuote: (quote: Quote) => void;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
}

export type EditReportModalProps = {
    report: Report;
    onUpdateReport: (report: Report) => void;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
}

// ------------------
// botones -- borrar
// ------------------

export type DeleteEquipoModalProps = {
    equipo: Equipos;
    onDeleteEquipo: (equipoId: string) => void;
};

export type DeleteMaterialModalProps = {
    material: Materiales;
    onDeleteMaterial: (materialId: string) => void;
};

export type DeleteProjectModalProps = {
    project: Project;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
    onDeleteProject: (projectId: string) => void;
    onDeleteProjectEquipos: (projectsEquiposId: string) => void;
    onDeleteProjectMateriales: (projectMaterialesId: string) => void;
};

export type DeleteZoneModalProps = {
    zone: Zone;
    onDeleteZone: (zoneId: string) => void;
};

export type DeleteSupplierModalProps = {
    supplier: Supplier;
    onDeleteSupplier: (supplierId: string) => void;
};

export type DeleteBrandModalProps = {
    brand: Brand;
    onDeleteBrand: (brandId: string) => void;
};

export type DeleteTypeModalProps = {
    type: Type;
    onDeleteType: (typeId: string) => void;
};

export type DeleteQuoteModalProps = {
    quote: Quote;
    onDeleteQuote: (quoteId: string) => void;
}

export type DeleteReportModalProps = {
    report: Report;
    onDeleteReport: (reportId: string) => void;
}

// ------------------
// botones -- borrado masivo
// ------------------

export type Button2MassiveCleanProps = {
	currentCount: number;
	onSuccess?: () => void;
};

// ------------------
// botones -- subida masiva
// ------------------

export type Button2MassiveUploadProps = {
	onSuccess?: () => void;
};