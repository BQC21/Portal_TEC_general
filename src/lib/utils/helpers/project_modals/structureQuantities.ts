import { StructureOption } from "@/lib/types/components/Sizing/computes"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"
import { bestStructureCombination } from "@/lib/utils/helpers/computes/best_structure_arrays"
import { cantidadModuloFVComoUnidades, resolvePanelesPorPalet } from "@/lib/utils/helpers/computes/PanelNumber"
import {
    cantidadEstructurasParaUnidades,
    dadosPerStructure,
    isBatteryStructure,
    isDados,
    unitsPerStructure,
} from "@/lib/utils/helpers/project_modals/structure_number_fnc"

export type ResolvedStructureRow = {
    item: Project_Equipos
    perStructure: number
    cantidad: number
    isDados: boolean
    isBattery: boolean
}

function panelCountOf(equipos: Project_Equipos[]): number {
    const modules = equipos.filter((item) => item.equipo_info?.tipo_de_producto === "MÓDULO FV")
    const panelesPorPalet = resolvePanelesPorPalet(
        modules.map((item) => ({
            unidad: item.equipo_info?.unidad,
            paneles_palet: item.equipo_info?.paneles_palet,
            descripcion: item.equipo_info?.descripcion,
        })),
    )
    return modules.reduce(
        (sum, item) =>
            sum + cantidadModuloFVComoUnidades(
                item.cantidad,
                item.equipo_info?.unidad,
                panelesPorPalet,
                item.equipo_info?.descripcion,
            ),
        0,
    )
}

function batteryCountOf(equipos: Project_Equipos[]): number {
    return equipos
        .filter((item) => item.equipo_info?.tipo_de_producto === "BATERÍA")
        .reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0)
}

// Misma cantidad automática que aplica la tabla de estructuras al abrir la cotización.
export function resolveStructureRows(equipos: Project_Equipos[]): {
    rows: ResolvedStructureRow[]
    dadosQuantity: number
} {
    const panelCount = panelCountOf(equipos)
    const batteryCount = batteryCountOf(equipos)
    const structures = equipos.filter((item) => item.equipo_info?.tipo_de_producto === "ESTRUCTURA")

    const toOptions = (items: Project_Equipos[]): StructureOption[] =>
        items
            .map((item) => ({
                id: String(item.id),
                capacity: unitsPerStructure(item.equipo_info?.descripcion),
                unitCost: Number(item.equipo_info?.precio_soles) || 0,
            }))
            .filter((option) => option.capacity > 0)

    const moduleOptions = toOptions(structures.filter((item) =>
        !isBatteryStructure(item.equipo_info?.descripcion)
        && !isDados(item.equipo_info?.descripcion),
    ))
    const batteryOptions = toOptions(structures.filter((item) =>
        isBatteryStructure(item.equipo_info?.descripcion),
    ))

    const moduleCombination = moduleOptions.length > 1
        ? bestStructureCombination(panelCount, moduleOptions)
        : null
    const batteryCombination = batteryOptions.length > 1
        ? bestStructureCombination(batteryCount, batteryOptions, "at-least")
        : null

    const rows = structures.map((item) => {
        const descripcion = item.equipo_info?.descripcion
        if (isDados(descripcion)) {
            return {
                item,
                perStructure: 0,
                cantidad: Number(item.cantidad) || 0,
                isDados: true,
                isBattery: false,
            }
        }

        const perStructure = unitsPerStructure(descripcion)
        const isBattery = isBatteryStructure(descripcion)
        if (perStructure <= 0) {
            return { item, perStructure, cantidad: Number(item.cantidad), isDados: false, isBattery }
        }

        if (moduleCombination && !isBattery) {
            return {
                item,
                perStructure,
                cantidad: moduleCombination.get(String(item.id)) ?? 0,
                isDados: false,
                isBattery,
            }
        }

        if (batteryCombination && isBattery) {
            return {
                item,
                perStructure,
                cantidad: batteryCombination.get(String(item.id)) ?? 0,
                isDados: false,
                isBattery,
            }
        }

        const totalUnits = isBattery ? batteryCount : panelCount
        return {
            item,
            perStructure,
            cantidad: cantidadEstructurasParaUnidades(totalUnits, perStructure),
            isDados: false,
            isBattery,
        }
    })

    const dadosQuantity = rows
        .filter(({ isDados: dadosRow, isBattery }) => !dadosRow && !isBattery)
        .reduce((sum, { perStructure, cantidad }) => {
            const factor = dadosPerStructure(perStructure)
            if (factor <= 0) return sum
            return sum + factor * Math.ceil(cantidad)
        }, 0)

    return { rows, dadosQuantity }
}

export function withAutomaticStructureQuantities(
    equipos: Project_Equipos[],
    cantidadManual: boolean,
): Project_Equipos[] {
    if (cantidadManual) return equipos

    const { rows, dadosQuantity } = resolveStructureRows(equipos)
    const nextCantidad = new Map<string, number>()
    for (const row of rows) {
        if (row.isDados) {
            nextCantidad.set(String(row.item.id), dadosQuantity)
            continue
        }
        if (row.perStructure <= 0) continue
        nextCantidad.set(String(row.item.id), row.cantidad)
    }

    return equipos.map((item) => {
        const cantidad = nextCantidad.get(String(item.id))
        if (cantidad == null || Number(item.cantidad) === cantidad) return item
        return { ...item, cantidad: String(cantidad) }
    })
}
