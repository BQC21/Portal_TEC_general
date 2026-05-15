import { createClient } from "@/lib/supabase/client";
import { Project, ProjectFormData } from "@/lib/types/project-types";
import { mapSupabaseRowToProject, mapProjectToSupabaseRow } from "../mapping/project_mapping";

const PROJECTS_TABLE = "proyectos";

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

// crear proyecto
export async function createProject(project: ProjectFormData): Promise<Project> {
    const supabase = createClient();
    const baseRow = mapProjectToSupabaseRow(project) as Record<string, unknown>;

    const { data, error } = await supabase.from(PROJECTS_TABLE)
    .insert(baseRow)
    .select("*,zonas(*)")
    .single();

    if (error) {
        throw new Error(`Error al crear el proyecto: ${error.message}`);
    }

    return mapSupabaseRowToProject(data);
}

// obtener proyectos
export async function getProjects(): Promise<Project[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from(PROJECTS_TABLE)
        .select("*,zonas(*)");

    if (error) {
        throw new Error(`Error al obtener los proyectos: ${error.message}`);
    }

    return data.map(mapSupabaseRowToProject);
}

// obtener proyecto por id
export async function getProjectById(id: string): Promise<Project> {
    const supabase = createClient();

    const { data, error } = await supabase.from(PROJECTS_TABLE)
    .select("*,zonas(*)")
    .eq("id", id)
    .single();

    if (error) {
        throw new Error(`Error al obtener el producto: ${error.message}`);
    }

    return mapSupabaseRowToProject(data);
}

// actualizar proyecto
export async function updateProject(id: string, project: ProjectFormData): Promise<Project> {
    const supabase = createClient();
    const baseRow = mapProjectToSupabaseRow(project) as Record<string, unknown>;

    const { data, error } = await supabase.from(PROJECTS_TABLE)
    .update(baseRow)
    .eq("id", id)
    .select("*,zonas(*)")
    .single();

    if (error) {
        throw new Error(`Error al actualizar el proyecto: ${error.message}`);
    }

    return mapSupabaseRowToProject(data);
}

// borrar proyecto
export async function deleteProject(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from(PROJECTS_TABLE).delete().eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar el proyecto: ${error.message}`);
    }
}