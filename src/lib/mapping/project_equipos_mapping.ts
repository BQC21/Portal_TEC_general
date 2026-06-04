import { SupabaseEquiposRow } from "../types/equipos-types"
import { SupabaseProjectRow } from "../types/project-types"

import { Project_Equipos, Project_EquiposFormData, 
    Project_EquiposFormState, 
    SupabaseProject_EquiposRow } from "../types/project_equipos_join"

import { parseNullableDate } from "../utils/helpers"
import { parseNumber } from "../utils/helpers/parse_number"

import { mapSupabaseRowToEquipos } from "./mapping_equipos"
import { mapSupabaseRowToProject } from "./project_mapping"

export function createProject_EquiposFormStateFromProject_Equipos(
    project_equipos: Project_Equipos
): Project_EquiposFormState{
    return {
        equipo_id: project_equipos.equipo_id,  
        equipo_info: project_equipos.equipo_info,  
        proyecto_id: project_equipos.proyecto_id,  
        proyecto_info: project_equipos.proyecto_info,  
        fecha_agregado: project_equipos.fecha_agregado,  
        cantidad: project_equipos.cantidad,        
    }
}

export function mapSupabaseRowToProject_Equipos(
    row: SupabaseProject_EquiposRow
): Project_Equipos{
    return {
        id: row.id?.toString() || "",
        equipo_id: row.equipo_id?.toString() || "",  
        equipo_info: row.equipo_info
                    ? mapSupabaseRowToEquipos(row.equipo_info as SupabaseEquiposRow)
                    : row.equipos
                        ? mapSupabaseRowToEquipos(row.equipos as SupabaseEquiposRow)
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

export function mapProject_EquiposToSupabaseRow(
    project_equipos: Project_EquiposFormData
): SupabaseProject_EquiposRow{
    return {
        equipo_id: project_equipos.equipo_id,  
        proyecto_id: project_equipos.proyecto_id,  
        fecha_agregado: project_equipos.fecha_agregado,  
        cantidad: parseNumber(project_equipos.cantidad),  
    }
}