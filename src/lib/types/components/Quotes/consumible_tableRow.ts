import { CableFvColor, ConsumibleFamily } from "@/lib/utils/helpers/project_modals/consumibleRowSelector"
import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"

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

export type ConsumibleDisplayRow = ConsumibleTableRow & {
    family: ConsumibleFamily | null
    cableColor?: CableFvColor | null
    isPlaceholder?: boolean
    selectable: boolean
}

export type UseConsumeRowSelectionArgs = {
    items: ConsumeItem[]
    sortedMateriales: ConsumibleTableRow[]
    materiales: Materiales[]
    selectedEquipos?: Project_Equipos[]
    onAddMaterial: (material: Materiales, cantidad?: number) => void
    onReplaceMaterial: (id: string | number, material: Materiales) => void
    onAddConsumeItem?: (item: Omit<ConsumeItem, "id">) => void
    onUpdateItem: (index: number, field: keyof ConsumeItem, value: ConsumeItem[keyof ConsumeItem]) => void
}