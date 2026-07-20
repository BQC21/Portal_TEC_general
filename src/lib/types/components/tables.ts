import { Brand } from "../supabase/brand.types";
import { Equipos } from "../supabase/equipos-types";
import { Materiales } from "../supabase/materiales-types";
import { Product, SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { Project } from "../supabase/project-types";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
import { Quote } from "../supabase/quote-types";
import { Report } from "../supabase/report-types";
import { Supplier } from "../supabase/supplier-types";
import { Type } from "../supabase/type-types";
import { Zone } from "../supabase/zone-types";

// zonas
export type ZoneTableProps = {
    zones: Zone[];
    totalZones: number;
    onUpdateZone: (zone: Zone) => void;
    onDeleteZone: (zoneId: string) => void;
};

// proyectos
export type ProjectTableProps = {
    projects: Project[];
    projects_equipos: Project_Equipos[];
    projects_materiales: Project_Materiales[];
    totalProjects: number;
    onUpdateProject: (
        project: Project,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
    onDeleteProject: (projectId: string) => void;
    onDeleteProjectEquipos?: (projectEquiposId: string) => void;
    onDeleteProjectMateriales?: (projectMaterialesId: string) => void;
};

// materiales
export type MaterialesTableProps = {
    materiales: Materiales[];
    totalMateriales: number;
    onUpdateMateriales: (material: Materiales) => void;
    onDeleteMateriales: (materialId: string) => void;
};

// equipos
export type EquiposTableProps = {
    equipos: Equipos[];
    totalEquipos: number;
    onUpdateEquipos: (equipo: Equipos) => void;
    onDeleteEquipos: (equipoId: string) => void;
};

// proveedores
export type ProveedoresTableProps = {
    supplier: Supplier[];
    totalSupplier: number;
    onUpdateSupplier: (supplier: Supplier) => void;
    onDeleteSupplier: (supplierId: string) => void;
};

// marcas
export type MarcasTableProps = {
    brand: Brand[];
    totalBrand: number;
    onUpdateBrand: (brand: Brand) => void;
    onDeleteBrand: (brandId: string) => void;
};

// tipos
export type TiposTableProps = {
    type: Type[];
    totalType: number;
    onUpdateType: (type: Type) => void;
    onDeleteType: (typeId: string) => void;
};

// cotizaciones
export type QuoteTableProps = {
    quote: Quote[];
    totalQuote: number;
    onUpdateQuote: (quote: Quote) => void;
    onDeleteQuote: (quoteId: string) => void;
    projects_equipos: Project_Equipos[];
    projects_materiales: Project_Materiales[];
}

// reportes
export type ReportTableProps = {
    report: Report[];
    totalReport: number;
    onUpdateReport: (report: Report) => void;
    onDeleteReport: (reportId: string) => void;
    projects_equipos: Project_Equipos[];
    projects_materiales: Project_Materiales[];
}
