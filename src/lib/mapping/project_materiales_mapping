import { SupabaseMaterialesRow } from "../types/materiales-types"
import { SupabaseProjectRow } from "../types/project-types"

import { Project_Materiales, Project_MaterialesFormData, 
    Project_MaterialesFormState, 
    SupabaseProject_MaterialesRow } from "../types/project_materiales_join"

import { parseNullableDate } from "../utils/helpers"
import { parseNumber } from "../utils/helpers/parse_number"

import { mapSupabaseRowToMateriales } from "./mapping_materiales"
import { mapSupabaseRowToProject } from "./project_mapping"

export function createProject_MaterialesFormStateFromProject_Materiales(
    project_materiales: Project_Materiales
): Project_MaterialesFormState{
    return {
        material_id: project_materiales.material_id,  
        material_info: project_materiales.material_info,  
        proyecto_id: project_materiales.proyecto_id,  
        proyecto_info: project_materiales.proyecto_info,  
        fecha_agregado: project_materiales.fecha_agregado,  
        cantidad: project_materiales.cantidad,        
    }
}

export function mapSupabaseRowToProject_Materiales(
    row: SupabaseProject_MaterialesRow
): Project_Materiales{
    return {
        id: row.id?.toString() || "",
        material_id: row.material_id?.toString() || "",  
        material_info: row.material_info
                    ? mapSupabaseRowToMateriales(row.material_info as SupabaseMaterialesRow)
                    : row.materiales
                        ? mapSupabaseRowToMateriales(row.materiales as SupabaseMaterialesRow)
                        : undefined,
        proyecto_id: row.proyecto_id?.toString() || "",  
        proyecto_info: row.proyecto_info
                    ? mapSupabaseRowToProject(row.proyecto_info as SupabaseProjectRow)
                    : row.proyectos
                        ? mapSupabaseRowToProject(row.proyectos as SupabaseProjectRow)
                        : undefined,
        fecha_agregado: parseNullableDate(row.fecha_agregado) ?? new Date(),  
        cantidad: row.cantidad?.toString() || "",          
    }
}

export function mapProject_MaterialesToSupabaseRow(
    project_materiales: Project_MaterialesFormData
): SupabaseProject_MaterialesRow{
    return {
        material_id: project_materiales.material_id,  
        proyecto_id: project_materiales.proyecto_id,  
        fecha_agregado: project_materiales.fecha_agregado,  
        cantidad: parseNumber(project_materiales.cantidad),  
    }
}