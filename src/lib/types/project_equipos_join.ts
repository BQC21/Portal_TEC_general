import { SupabaseEquiposRow, Equipos } from "@/lib/types/equipos-types";
import { SupabaseProjectRow, Project } from "@/lib/types/project-types";

export type Project_EquiposFormState = Omit<Project_Equipos, "id">;
export type Project_EquiposFormData = Omit<Project_Equipos, "id">;

export type SupabaseProject_EquiposRow = {
    id?: number | string;
    equipo_id?: number | string;
    equipo_info?: SupabaseEquiposRow;
    equipos?: SupabaseEquiposRow; 
    proyecto_id: number | string;
    proyecto_info?: SupabaseProjectRow;
    proyectos?: SupabaseProjectRow; 
    fecha_agregado: Date | string | null;
    cantidad: number | undefined;
}

export type Project_Equipos = {
    id: number | string;
    equipo_id: string;
    equipo_info?: Equipos;
    proyecto_id: string;
    proyecto_info?: Project;
    fecha_agregado: Date;
    cantidad: string;
}

export type UseProject_EquiposResult = {
    projects_equipos: Project_Equipos[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export type useProject_EquiposMutationResult = {
    loading: boolean;
    error: string | null;
    create: (project_equipos: Project_EquiposFormData) => Promise<Project_Equipos>;
    update: (id: string, project_equipos: Project_EquiposFormData) => Promise<Project_Equipos>;
    remove: (id: string) => Promise<void>;
}