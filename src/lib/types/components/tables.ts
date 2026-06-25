import { Equipos } from "../supabase/equipos-types";
import { Materiales } from "../supabase/materiales-types";
import { Product, SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { Project } from "../supabase/project-types";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
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

// productos
export type ProductTableProps = {
    products: Product[];
    totalProducts: number;
    exchangeRate: number;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
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