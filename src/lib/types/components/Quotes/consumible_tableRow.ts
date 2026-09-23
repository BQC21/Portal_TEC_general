import { ConsumeItem } from "@/lib/types/components/Quotes/manual_resources"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"

export type ConsumibleSelectableFamily =
    | "itm_ac"
    | "spd"
    | "itm_dc"
    | "conduit_flexible"
    | "conduit"
    | "cable_ac"
    | "cable_fv"
    | "cable_tierra"
    | "tablero"
    | "canaleta"
    | "bornera_linea"
    | "terminal_pin_100"
    | "terminal_ojal_100"
    | "terminal_ojal"
    | "terminal_pin"
    | "tirafon"
    | "precintos"
    | "tornillos_autorroscantes_100"
    | "tornillo_autorroscante"
    | "tornillo_spack"
    | "mc4"
    | "fusible"

export type ConsumibleLinkedFamily =
    | "abrazadera"
    | "prensaestopa"
    | "curva"
    | "union"
    | "conector"

export type ConsumibleFamily =
    | ConsumibleSelectableFamily
    | ConsumibleLinkedFamily

export type ConsumibleExtraFamily =
    | "itm_ac"
    | "cable_tierra"
    | "tablero"
    | "canaleta"
    | "fusible"

export type ConsumibleRestorableFamily = "fusible"
export type ConsumibleAddableFamily = Exclude<ConsumibleSelectableFamily, "mc4">
export type CableFvColor = "rojo" | "negro" | "verde"
export type FixedConsumibleFamily = "mc4"

export type ConsumibleGroupKey = "proteccion" | "canalizacion" | "consumible"

export type ConsumibleGroupMeta = {
    key: ConsumibleGroupKey
    label: string
    order: number
    rowClass: string
    headerClass: string
}

export type ConsumibleTableRow = {
    key: string
    source: "catalog" | "template" | "catalog-extra" 
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