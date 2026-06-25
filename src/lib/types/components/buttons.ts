import { Equipos, EquiposFormData } from "../supabase/equipos-types";
import { Materiales, MaterialesFormData } from "../supabase/materiales-types";
import { Product, ProductFormData, SelectedEquipmentItem, SelectedMaterialItem } from "../supabase/product-types";
import { Project, ProjectFormData } from "../supabase/project-types";
import { Project_Equipos } from "../supabase/project_equipos_join";
import { Project_Materiales } from "../supabase/project_materiales_join";
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

export type Button2ModalPropsProducto = {
    exchangeRate: number;
    existingProducts: Product[];
    onAddProduct: (product: ProductFormData) => void;
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

export type EditProductModalProps = {
    product: Product;
    exchangeRate: number;
    onUpdateProduct: (product: Product) => void;
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

export type DeleteProductModalProps = {
    product: Product;
    onDeleteProduct: (productId: string) => void;
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

// ------------------
// botones -- descarga masiva
// ------------------

export type MassiveDownloadModalProps = {
    productsToDownload?: Product[];
    exchangeRate: number;
    defaultFileName?: string;
};