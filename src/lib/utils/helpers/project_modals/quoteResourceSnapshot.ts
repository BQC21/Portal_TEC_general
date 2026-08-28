import { createJoinProjectEquipos, deleteJoinProjectEquipos, updateJoinProjectEquipos } from "@/features/controller/services/projectEquiposQueries"
import { createJoinProjectMateriales, deleteJoinProjectMateriales, updateJoinProjectMateriales } from "@/features/controller/services/projectMaterialesQueries"
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources"
import { Equipos } from "@/lib/types/supabase/equipos-types"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"

function asString(value: string | number | undefined | null): string {
    return value == null ? "" : String(value)
}

function jsonSafe<T>(value: T): T {
    return JSON.parse(JSON.stringify(value, (_key, nested) => {
        if (nested instanceof Date) return nested.toISOString()
        return nested
    }))
}

function compactEquipoInfo(info?: Equipos): Equipos | undefined {
    if (!info) return undefined
    return {
        ...info,
        tipo_info: undefined,
        marca_info: undefined,
        proveedor_info: undefined,
        created_at: info.created_at,
        updated_at: info.updated_at,
    }
}

function compactMaterialInfo(info?: Materiales): Materiales | undefined {
    if (!info) return undefined
    return {
        ...info,
        tipo_info: undefined,
        marca_info: undefined,
        proveedor_info: undefined,
        created_at: info.created_at,
        updated_at: info.updated_at,
    }
}

export function snapshotQuoteEquipos(items: Project_Equipos[]): Project_Equipos[] {
    return jsonSafe(items.map((item) => ({
        id: asString(item.id),
        equipo_id: asString(item.equipo_id),
        equipo_info: compactEquipoInfo(item.equipo_info),
        proyecto_id: asString(item.proyecto_id),
        fecha_agregado: item.fecha_agregado,
        cantidad: asString(item.cantidad),
    })))
}

export function snapshotQuoteMateriales(items: Project_Materiales[]): Project_Materiales[] {
    return jsonSafe(items.map((item) => ({
        id: asString(item.id),
        material_id: asString(item.material_id),
        material_info: compactMaterialInfo(item.material_info),
        proyecto_id: asString(item.proyecto_id),
        fecha_agregado: item.fecha_agregado,
        cantidad: asString(item.cantidad),
    })))
}

export function withQuoteResourceSnapshot(
    costs: ManualCosts,
    equipos: Project_Equipos[],
    materiales: Project_Materiales[],
): ManualCosts {
    return jsonSafe({
        ...costs,
        Recursos: {
            ...costs.Recursos,
            equipos_seleccionados: snapshotQuoteEquipos(equipos),
            materiales_seleccionados: snapshotQuoteMateriales(materiales),
        },
    })
}

function filterByProject<T extends { proyecto_id: string }>(
    items: T[],
    projectId: string | undefined,
): T[] {
    const id = asString(projectId)
    if (!id) return []
    return items.filter((item) => asString(item.proyecto_id) === id)
}

export function quoteLiveResourcesKey(
    equipos: Project_Equipos[],
    materiales: Project_Materiales[],
): string {
    return [
        "e",
        ...equipos.map((item) => `${asString(item.equipo_id)}:${asString(item.cantidad)}`).sort(),
        "m",
        ...materiales.map((item) => `${asString(item.material_id)}:${asString(item.cantidad)}`).sort(),
    ].join("|")
}

function resolveQuoteResources<T>(
    saved: T[] | undefined,
    live: T[],
    catalogLoaded: boolean,
): T[] {
    if (live.length > 0) return live
    if (catalogLoaded) return live
    return Array.isArray(saved) && saved.length > 0 ? saved : []
}

export function resolveQuoteEquipos(
    saved: Project_Equipos[] | undefined,
    projectId: string | undefined,
    projectEquipos: Project_Equipos[],
): Project_Equipos[] {
    if (!projectId) return []
    return resolveQuoteResources(
        saved,
        filterByProject(projectEquipos, projectId),
        projectEquipos.length > 0,
    )
}

export function resolveQuoteMateriales(
    saved: Project_Materiales[] | undefined,
    projectId: string | undefined,
    projectMateriales: Project_Materiales[],
): Project_Materiales[] {
    if (!projectId) return []
    return resolveQuoteResources(
        saved,
        filterByProject(projectMateriales, projectId),
        projectMateriales.length > 0,
    )
}

export async function syncQuoteEquiposToProject(
    proyectoId: string,
    nextItems: Project_Equipos[],
    existingItems: Project_Equipos[],
) {
    const projectId = asString(proyectoId)
    if (!projectId) return

    const current = existingItems.filter((item) => asString(item.proyecto_id) === projectId)
    const nextByEquipoId = new Map(nextItems.map((item) => [asString(item.equipo_id), item]))
    const currentByEquipoId = new Map(current.map((item) => [asString(item.equipo_id), item]))

    await Promise.all(
        current
            .filter((item) => !nextByEquipoId.has(asString(item.equipo_id)))
            .map((item) => deleteJoinProjectEquipos(asString(item.id))),
    )

    await Promise.all(
        nextItems
            .filter((item) => !currentByEquipoId.has(asString(item.equipo_id)))
            .map((item) => createJoinProjectEquipos({
                equipo_id: asString(item.equipo_id),
                proyecto_id: projectId,
                fecha_agregado: new Date(),
                cantidad: asString(item.cantidad || 1),
            })),
    )

    await Promise.all(
        nextItems.flatMap((item) => {
            const previous = currentByEquipoId.get(asString(item.equipo_id))
            if (!previous || asString(previous.cantidad) === asString(item.cantidad)) return []
            return [updateJoinProjectEquipos(asString(previous.id), {
                equipo_id: asString(item.equipo_id),
                proyecto_id: projectId,
                fecha_agregado: previous.fecha_agregado,
                cantidad: asString(item.cantidad || 1),
            })]
        }),
    )
}

export async function syncQuoteMaterialesToProject(
    proyectoId: string,
    nextItems: Project_Materiales[],
    existingItems: Project_Materiales[],
) {
    const projectId = asString(proyectoId)
    if (!projectId) return

    const current = existingItems.filter((item) => asString(item.proyecto_id) === projectId)
    const nextByMaterialId = new Map(nextItems.map((item) => [asString(item.material_id), item]))
    const currentByMaterialId = new Map(current.map((item) => [asString(item.material_id), item]))

    await Promise.all(
        current
            .filter((item) => !nextByMaterialId.has(asString(item.material_id)))
            .map((item) => deleteJoinProjectMateriales(asString(item.id))),
    )

    await Promise.all(
        nextItems
            .filter((item) => !currentByMaterialId.has(asString(item.material_id)))
            .map((item) => createJoinProjectMateriales({
                material_id: asString(item.material_id),
                proyecto_id: projectId,
                fecha_agregado: new Date(),
                cantidad: asString(item.cantidad || 1),
            })),
    )

    await Promise.all(
        nextItems.flatMap((item) => {
            const previous = currentByMaterialId.get(asString(item.material_id))
            if (!previous || asString(previous.cantidad) === asString(item.cantidad)) return []
            return [updateJoinProjectMateriales(asString(previous.id), {
                material_id: asString(item.material_id),
                proyecto_id: projectId,
                fecha_agregado: previous.fecha_agregado,
                cantidad: asString(item.cantidad || 1),
            })]
        }),
    )
}
