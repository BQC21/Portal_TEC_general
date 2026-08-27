import { CableFvColor, ConsumibleFamily } from "@/lib/utils/helpers/project_modals/consumibleRowSelector"

export type ConsumibleTableRow = {
    key: string
    source: "catalog" | "template" 
    catalogId?: string | number
    templateIndex?: number
    cod_producto: string
    descripcion: string
    tipo_de_producto?: string
    unidad: string
    cantidad: number
    precio_soles: number
    precio_soles_igv: number
    precio_dolares: number
    precio_dolares_igv: number
}

export type ConsumibleSortableRow = {
    descripcion: string
    tipo_de_producto?: string
    cod_producto: string
    family?: ConsumibleFamily | null
    cableColor?: CableFvColor | null
}