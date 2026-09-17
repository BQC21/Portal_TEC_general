import {
    CableFvColor,
    ConsumibleAddableFamily,
    ConsumibleExtraFamily,
    ConsumibleFamily,
    ConsumibleRestorableFamily,
    ConsumibleSelectableFamily,
    FixedConsumibleFamily,
} from "@/lib/types/components/Quotes/consumible_tableRow"

export const EXTRA_CONSUMIBLE_FAMILIES: ConsumibleExtraFamily[] = [
    "itm_ac",
    "cable_tierra",
    "tablero",
    "canaleta",
    "fusible",
]
export const RESTORABLE_CONSUMIBLE_FAMILIES: ConsumibleRestorableFamily[] = [
    "fusible",
]

export const SELECTABLE_CONSUMIBLE_FAMILIES: ConsumibleSelectableFamily[] = [
    "itm_ac",
    "spd",
    "itm_dc",
    "conduit_flexible",
    "conduit",
    "cable_ac",
    "cable_fv",
    "cable_tierra",
    "tablero",
    "canaleta",
    "terminal_pin_100",
    "terminal_ojal_100",
    "terminal_ojal",
    "terminal_pin",
    "precintos",
    "tornillos_autorroscantes_100",
    "tornillo_spack",
    "fusible",
]

export const CONSUMIBLE_FAMILY_LABEL: Record<ConsumibleSelectableFamily, string> = {
    itm_ac: "Protección ITM AC",
    spd: "Voltaje SPD",
    itm_dc: "Protección ITM DC",
    conduit_flexible: "Conduit flexible",
    conduit: "Conduit",
    cable_ac: "Cable AC",
    cable_fv: "Cable FV",
    cable_tierra: "Cable de tierra",
    tablero: "Tablero",
    canaleta: "Canaleta",
    terminal_pin_100: "100to terminal tipo pin",
    terminal_ojal_100: "100to terminal tipo ojal",
    terminal_ojal: "Terminal tipo ojal",
    terminal_pin: "Terminal tipo pin",
    precintos: "Precintos",
    tornillos_autorroscantes_100: "100to tornillos autorroscantes",
    tornillo_spack: "Tornillo Spack",
    mc4: "MC4",
    fusible: "Fusible + Portafusible",
}

export const CONSUMIBLE_FAMILY_TIPO: Record<ConsumibleFamily, string> = {
    itm_ac: "PROTECCIÓN",
    spd: "PROTECCIÓN",
    itm_dc: "PROTECCIÓN",
    conduit_flexible: "CANALIZACIÓN",
    abrazadera: "CANALIZACIÓN",
    prensaestopa: "CANALIZACIÓN",
    conduit: "CANALIZACIÓN",
    curva: "CANALIZACIÓN",
    union: "CANALIZACIÓN",
    conector: "CANALIZACIÓN",
    canaleta: "CANALIZACIÓN",
    cable_ac: "CANALIZACIÓN",
    cable_fv: "CANALIZACIÓN",
    cable_tierra: "CANALIZACIÓN",
    tablero: "CONSUMIBLE",
    terminal_pin_100: "CONSUMIBLE",
    terminal_ojal_100: "CONSUMIBLE",
    terminal_ojal: "CONSUMIBLE",
    terminal_pin: "CONSUMIBLE",
    precintos: "CONSUMIBLE",
    tornillos_autorroscantes_100: "CONSUMIBLE",
    tornillo_spack: "CONSUMIBLE",
    mc4: "CONSUMIBLE",
    fusible: "PROTECCIÓN",
}

export const CANALIZACION_FAMILY_ORDER: Record<string, number> = {
    conduit_flexible: 0,
    abrazadera: 1,
    prensaestopa: 2,
    conduit: 3,
    curva: 4,
    union: 5,
    conector: 6,
    canaleta: 7,
    cable_ac: 8,
    cable_fv: 9,
    cable_tierra: 10,
}

export const CONSUMIBLE_FAMILY_DEFAULT_CODE: Partial<Record<ConsumibleSelectableFamily, string>> = {
    itm_ac: "MSTOF00001",
    spd: "MPESO00005",
    itm_dc: "MPESO00001",
    cable_ac: "MPROJ00001",
    cable_tierra: "MCAVA00022",
    tablero: "MCOIN00003",
    canaleta: "MPROJ00006",
    mc4: "MTISO00005",
}

export const CABLE_FV_DEFAULT_CODE: Record<CableFvColor, string> = {
    rojo: "MELSI00001",
    negro: "MELSI00002",
}

export const CONSUMIBLE_EXTRA_ADD_LABEL: Record<ConsumibleAddableFamily, string> = {
    itm_ac: "Agregar otra protección ITM AC",
    cable_tierra: "Agregar otro cable de tierra",
    tablero: "Agregar otro tablero",
    canaleta: "Agregar otra canaleta",
    fusible: "Agregar otro fusible + portafusible",
}

export const CONSUMIBLE_RESTORE_LABEL: Record<ConsumibleRestorableFamily, string> = {
    fusible: "Agregar fusible + portafusible",
}

export const FIXED_CONSUMIBLE_FAMILIES: FixedConsumibleFamily[] = ["mc4"]

export const DEFAULT_INSERTED_FAMILIES = new Set<ConsumibleSelectableFamily>([
    "itm_ac",
    "spd",
    "itm_dc",
    "cable_ac",
    "cable_fv",
    "cable_tierra",
    "tablero",
    "canaleta",
    "mc4",
])

export const TERMINAL_PIN_MM2 = new Set(["10", "16", "25", "35"])
export const TERMINAL_OJAL_MM2 = new Set(["10", "16", "25", "35", "50"])
export const PRECINTOS_MM = new Set(["100", "200", "300"])
export const SPACK_SIZES = new Set(["4x30", "4x50"])
export const AUTORROSCANTE_INCH = new Set(["2", "3", "4"])
