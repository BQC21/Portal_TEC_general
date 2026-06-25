import { SupabaseMaterialesRow, Materiales } from "@/lib/types/supabase/materiales-types";
import { SupabaseProjectRow, Project } from "@/lib/types/supabase/project-types";

export type Project_MaterialesFormState = Omit<Project_Materiales, "id">;
export type Project_MaterialesFormData = Omit<Project_Materiales, "id">;

export type SupabaseProject_MaterialesRow = {
    id?: number | string;
    material_id?: number | string;
    material_info?: SupabaseMaterialesRow;
    materiales?: SupabaseMaterialesRow; 
    materiales_electricos?: SupabaseMaterialesRow;
    proyecto_id: number | string;
    proyecto_info?: SupabaseProjectRow;
    proyectos?: SupabaseProjectRow; 
    fecha_agregado: Date | string | null;
    cantidad: number | undefined;
}

export type Project_Materiales = {
    id: number | string;
    material_id: string;
    material_info?: Materiales;
    proyecto_id: string;
    proyecto_info?: Project;
    fecha_agregado: Date;
    cantidad: string;
}

export type UseProject_MaterialesResult = {
    projects_materiales: Project_Materiales[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export type useProject_MaterialesMutationResult = {
    loading: boolean;
    error: string | null;
    create: (project_materiales: Project_MaterialesFormData) => Promise<Project_Materiales>;
    update: (id: string, project_materiales: Project_MaterialesFormData) => Promise<Project_Materiales>;
    remove: (id: string) => Promise<void>;
}
