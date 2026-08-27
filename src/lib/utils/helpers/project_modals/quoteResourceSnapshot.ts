import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"

function reviveDate(value: Date | string | undefined | null): Date {
    if (value instanceof Date) return value
    if (typeof value === "string" && value) {
        const parsed = new Date(value)
        if (!Number.isNaN(parsed.getTime())) return parsed
    }
    return new Date()
}

export function reviveQuoteEquipos(items: Project_Equipos[]): Project_Equipos[] {
    return items.map((item) => ({
        ...item,
        fecha_agregado: reviveDate(item.fecha_agregado),
        equipo_info: item.equipo_info
            ? {
                ...item.equipo_info,
                created_at: reviveDate(item.equipo_info.created_at),
                updated_at: reviveDate(item.equipo_info.updated_at),
            }
            : item.equipo_info,
    }))
}

export function reviveQuoteMateriales(items: Project_Materiales[]): Project_Materiales[] {
    return items.map((item) => ({
        ...item,
        fecha_agregado: reviveDate(item.fecha_agregado),
        material_info: item.material_info
            ? {
                ...item.material_info,
                created_at: reviveDate(item.material_info.created_at),
                updated_at: reviveDate(item.material_info.updated_at),
            }
            : item.material_info,
    }))
}

export function snapshotQuoteEquipos(items: Project_Equipos[]): Project_Equipos[] {
    return items.map((item) => ({
        id: item.id,
        equipo_id: item.equipo_id,
        equipo_info: item.equipo_info,
        proyecto_id: item.proyecto_id,
        fecha_agregado: item.fecha_agregado,
        cantidad: item.cantidad,
    }))
}

export function snapshotQuoteMateriales(items: Project_Materiales[]): Project_Materiales[] {
    return items.map((item) => ({
        id: item.id,
        material_id: item.material_id,
        material_info: item.material_info,
        proyecto_id: item.proyecto_id,
        fecha_agregado: item.fecha_agregado,
        cantidad: item.cantidad,
    }))
}

export function withQuoteResourceSnapshot(
    costs: ManualCosts,
    equipos: Project_Equipos[],
    materiales: Project_Materiales[],
): ManualCosts {
    return {
        ...costs,
        Recursos: {
            ...costs.Recursos,
            equipos_seleccionados: snapshotQuoteEquipos(equipos),
            materiales_seleccionados: snapshotQuoteMateriales(materiales),
        },
    }
}

export function resolveQuoteEquipos(
    saved: Project_Equipos[] | undefined,
    projectId: string | undefined,
    projectEquipos: Project_Equipos[],
): Project_Equipos[] {
    if (saved != null) return reviveQuoteEquipos(saved)
    if (!projectId) return []
    return projectEquipos.filter((item) => item.proyecto_id === projectId)
}

export function resolveQuoteMateriales(
    saved: Project_Materiales[] | undefined,
    projectId: string | undefined,
    projectMateriales: Project_Materiales[],
): Project_Materiales[] {
    if (saved != null) return reviveQuoteMateriales(saved)
    if (!projectId) return []
    return projectMateriales.filter((item) => item.proyecto_id === projectId)
}
