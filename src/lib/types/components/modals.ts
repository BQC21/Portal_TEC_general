import { Brand, BrandFormData } from "../supabase/brand.types";
import { Equipos, EquiposFormData } from "../supabase/equipos-types";
import { Materiales, MaterialesFormData } from "../supabase/materiales-types";
import { Product, ProductFormData, SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { Project, ProjectFormData } from "../supabase/project-types";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
import { Quote, QuoteFormData } from "../supabase/quote-types";
import { ReportFormData } from "../supabase/report-types";
import { Supplier, SupplierFormData } from "../supabase/supplier-types";
import { Type, TypeFormData } from "../supabase/type-types";
import { Zone, ZoneFormData } from "../supabase/zone-types";



// ------------------
// modals -- agregar
// ------------------

export type AddEquipoModalProps = {
    existingEquipos: Equipos[];
    onAddEquipos: (equipo: EquiposFormData) => void;
    onClose: () => void;
};

export type AddMaterialModalProps = {
    existingMateriales: Materiales[];
    onAddMateriales: (material: MaterialesFormData) => void;
    onClose: () => void;
};

export type AddMProjectodalProps = {
    onAddProject: (
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
    onClose: () => void;
};

export type AddZoneModalProps = {
    onAddZone: (zone: ZoneFormData) => void;
    onClose: () => void;
};

export type AddSupplierModalProps = {
    onAddSupplier: (supplier: SupplierFormData) => void;
    onClose: () => void;
};

export type AddBrandModalProps = {
    onAddBrand: (brand: BrandFormData) => void;
    onClose: () => void;
};

export type AddTypeModalProps = {
    onAddType: (type: TypeFormData) => void;
    onClose: () => void;
};

export type AddQuoteModalProps = {
    onAddQuote: (quote: QuoteFormData) => void;
    onClose: () => void;
}

export type AddReportModalProps = {
    onAddReport: (report: ReportFormData) => void;
    onClose: () => void;
}

// ------------------
// modals -- editar
// ------------------
export type EditEquipoModalProps = {
    equipo: Equipos;
    onUpdateEquipo: (equipo: Equipos) => void;
    onClose: () => void;
};

export type EditMaterialModalProps = {
    material: Materiales;
    onUpdateMaterial: (material: Materiales) => void;
    onClose: () => void;
};

export type EditProjectModalProps = {
    existingProject: Project;
    existingProjectEquipos: Project_Equipos[];
    existingProjectMateriales: Project_Materiales[];
    onUpdateProject: (
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
    onClose: () => void;
};

export type EditZoneModalProps = {
    existingZone: Zone;
    onUpdateZone: (zone: ZoneFormData) => void;
    onClose: () => void;
};

export type EditSupplierModalProps = {
    existingSupplier: Supplier;
    onUpdateSupplier: (supplier: SupplierFormData) => void;
    onClose: () => void;
};

export type EditBrandModalProps = {
    existingBrand: Brand;
    onUpdateBrand: (brand: BrandFormData) => void;
    onClose: () => void;
};

export type EditTypeModalProps = {
    existingType: Type;
    onUpdateType: (type: TypeFormData) => void;
    onClose: () => void;
};

export type EditQuoteModalProps = {
    existingQuote: Quote;
    onUpdateQuote: (quote: QuoteFormData) => void;
    onClose: () => void;
}

export type EditReportModalProps = {
    existingReport: Report;
    onUpdateReport: (report: ReportFormData) => void;
    onClose: () => void;
}

// ------------------
// modals -- borrar
// ------------------
export type DeleteEquipoModalProps = {
    equipo: Equipos;
    onDeleteEquipo: (equipoId: string) => void
    onClose: () => void;
};

export type DeleteMaterialModalProps = {
    material: Materiales;
    onDeleteMaterial: (materialId: string) => void
    onClose: () => void;
};

export type DeleteProjectModalProps = {
    project: Project;
    project_equipos: Project_Equipos[];
    project_materiales: Project_Materiales[];
    onDeleteProject: (projectId: string) => void
    onDeleteProjectEquipos: (projectsEquiposId: string) => void
    onDeleteProjectMateriales: (projectsMaterialesId: string) => void
    onClose: () => void;
};

export type DeleteZoneModalProps = {
    zone: Zone;
    onDeleteZone: (zoneId: string) => void
    onClose: () => void;
};

export type DeleteSupplierModalProps = {
    supplier: Supplier;
    onDeleteSupplier: (supplierId: string) => void;
    onClose: () => void;
};

export type DeleteBrandModalProps = {
    brand: Brand;
    onDeleteBrand: (brandId: string) => void;
    onClose: () => void;
};

export type DeleteTypeModalProps = {
    type: Type;
    onDeleteType: (typeId: string) => void;
    onClose: () => void;
};

export type DeleteQuoteModalProps = {
    quote: Quote;
    onDeleteQuote: (quoteId: string) => void;
    onClose: () => void;
}

export type DeleteReportModalProps = {
    report: Report;
    onDeleteReport: (reportId: string) => void;
    onClose: () => void;
}

// ------------------
// modals -- subida masiva
// ------------------
export type MassiveUploadModalProps = {
	onClose: () => void;
	onSuccess?: () => void;
};

// ------------------
// modals -- borrado masivo
// ------------------
export type MassiveCleanModalProps = {
	currentCount: number;
	onClose: () => void;
	onSuccess?: () => void;
};