import { mapProject_MaterialesToSupabaseRow, mapSupabaseRowToProject_Materiales } from "@/lib/mapping/project_materiales_mapping";
import { createClient } from "@/lib/supabase/client";
import { Project_Materiales, Project_MaterialesFormData } from "@/lib/types/project_materiales_join";
import { PROJECTS_MATERIALES_TABLE } from "@/lib/utils/namingTolerance";

export async function createJoinProjectMateriales(
    project_materiales: Project_MaterialesFormData
): Promise<Project_Materiales>{
    const supabase = createClient();
    const baseRow = mapProject_MaterialesToSupabaseRow(project_materiales) as Record<string, unknown>;
    const { data, error } = await supabase  
        .from(PROJECTS_MATERIALES_TABLE)
        .insert(baseRow)
        .select()
        .single();

    if (error) {
        throw new Error(`Error al crear la relación 
            proyecto - material: ${error.message}`);
    }

    return mapSupabaseRowToProject_Materiales(data);
}

export async function getJoinProjectMateriales(): Promise<Project_Materiales[]>{
    const supabase = createClient();

    const { data, error } = await supabase
        .from(PROJECTS_MATERIALES_TABLE)
        .select("*")
    
    if (error) {
        throw new Error(`Error al obtener las relaciones 
            proyecto - material: ${error.message}`);
    }
    
    return data.map(mapSupabaseRowToProject_Materiales)
}

export async function getProductById(id: string): Promise<Project_Materiales> {
    const supabase = createClient();

    const { data, error } = await supabase
    .from(PROJECTS_MATERIALES_TABLE)
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
        throw new Error(`Error al obtener la relación 
            proyecto - material: ${error.message}`);
    }

    return mapSupabaseRowToProject_Materiales(data);
}


export async function updateJoinProjectMateriales(
    id: string, project_materiales: Project_MaterialesFormData
): Promise<Project_Materiales>{
    const supabase = createClient();
    const baseRow = mapProject_MaterialesToSupabaseRow(project_materiales) as Record<string, unknown>;

    const { data, error } = await supabase
        .from(PROJECTS_MATERIALES_TABLE)
        .update(baseRow)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(`Error al actualizar la relación 
            proyecto - material: ${error.message}`);
    }

    return mapSupabaseRowToProject_Materiales(data);
}

export async function deleteJoinProjectMateriales(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
    .from(PROJECTS_MATERIALES_TABLE)
    .delete()
    .eq("id", id);

    if (error) {
        throw new Error(`Error al borrar la relación 
            proyecto - material: ${error.message}`);
    }
}