import { mapProject_EquiposToSupabaseRow, mapSupabaseRowToProject_Equipos } from "@/lib/mapping/project_equipos_mapping";
import { createClient } from "@/lib/supabase/client";
import { Project_Equipos, Project_EquiposFormData } from "@/lib/types/project_equipos_join";
import { PROJECTS_EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";

export async function createJoinProjectEquipos(
    project_equipos: Project_EquiposFormData
): Promise<Project_Equipos>{
    const supabase = createClient();
    const baseRow = mapProject_EquiposToSupabaseRow(project_equipos) as Record<string, unknown>;
    const { data, error } = await supabase  
        .from(PROJECTS_EQUIPOS_TABLE)
        .insert(baseRow)
        .select()
        .single();

    if (error) {
        throw new Error(`Error al crear la relación 
            proyecto - equipo: ${error.message}`);
    }

    return mapSupabaseRowToProject_Equipos(data);
}

export async function getJoinProjectEquipos(): Promise<Project_Equipos[]>{
    const supabase = createClient();

    const { data, error } = await supabase
        .from(PROJECTS_EQUIPOS_TABLE)
        .select("*")
    
    if (error) {
        throw new Error(`Error al obtener las relaciones 
            proyecto - equipo: ${error.message}`);
    }
    
    return data.map(mapSupabaseRowToProject_Equipos)
}

export async function getProductById(id: string): Promise<Project_Equipos> {
    const supabase = createClient();

    const { data, error } = await supabase
    .from(PROJECTS_EQUIPOS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
        throw new Error(`Error al obtener la relación 
            proyecto - equipo: ${error.message}`);
    }

    return mapSupabaseRowToProject_Equipos(data);
}


export async function updateJoinProjectEquipos(
    id: string, project_equipos: Project_EquiposFormData
): Promise<Project_Equipos>{
    const supabase = createClient();
    const baseRow = mapProject_EquiposToSupabaseRow(project_equipos) as Record<string, unknown>;

    const { data, error } = await supabase
        .from(PROJECTS_EQUIPOS_TABLE)
        .update(baseRow)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(`Error al actualizar la relación 
            proyecto - equipo: ${error.message}`);
    }

    return mapSupabaseRowToProject_Equipos(data);
}

export async function deleteJoinProjectEquipos(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
    .from(PROJECTS_EQUIPOS_TABLE)
    .delete()
    .eq("id", id);

    if (error) {
        throw new Error(`Error al borrar la relación 
            proyecto - equipo: ${error.message}`);
    }
}