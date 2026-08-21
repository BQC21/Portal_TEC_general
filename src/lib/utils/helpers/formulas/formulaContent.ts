import { FormulaItem } from "@/lib/types/components/General/formulas";

export const ENERGY_FORMULAS: FormulaItem[] = [
    {
        id: "cobertura_porcentaje",
        name: "Porcentaje de cobertura (%)",
        formula: "C = \\dfrac{E}{D} \\times 100",
        description: "Relación entre la energía requerida $E$ y la demanda eléctrica anual $D$. Se usa en llenado manual.",
    },
    {
        id: "energia_requerida",
        name: "Energía requerida",
        formula: "E = D \\times \\dfrac{C}{100}",
        description: "Energía que debe producir el sistema a partir de la demanda $D$ y el porcentaje de cobertura $C$.",
    },
    {
        id: "potencia_dc_requerida",
        name: "Potencia DC requerida (kW)",
        formula: "P_{\\mathrm{DC}} = \\dfrac{E}{G \\, (\\eta / 100)}",
        description: "Usa $G = \\mathrm{GHI}$ si el ángulo es Coplanar y $G = \\mathrm{GTI}$ si es Inclinado. El rendimiento del módulo es $\\eta = 80\\,\\%$.",
    },
    {
        id: "potencia_ac_requerida",
        name: "Potencia AC requerida (kW)",
        formula: "P_{\\mathrm{AC}} = \\dfrac{P_{\\mathrm{DC}}}{1.2}",
        description: "Potencia AC equivalente a la potencia DC requerida, con factor $1.2$.",
    },
];

export const ARRAY_FORMULAS: FormulaItem[] = [
    {
        id: "min_strings",
        name: "Mínimo de paneles",
        formula: "N_{\\min} = \\dfrac{P_{\\mathrm{DC}}}{P_{\\mathrm{mod}}}",
        description: "Cantidad mínima de paneles según la potencia DC requerida y la potencia máxima del módulo $P_{\\mathrm{mod}}$.",
    },
    {
        id: "max_strings",
        name: "Máximo de paneles",
        formula: "N_{\\max} = \\dfrac{P_{\\mathrm{DC,inv}}}{P_{\\mathrm{mod}}}",
        description: "Cantidad máxima de paneles según la potencia DC máxima del inversor $P_{\\mathrm{DC,inv}}$ y la potencia del módulo.",
    },
];

export const PROTECTION_FORMULAS: FormulaItem[] = [
    {
        id: "itm_ac_min",
        name: "Protección ITM AC mínima",
        formula: "\\mathrm{ITM}_{\\mathrm{AC}} = \\left\\lceil I_{\\mathrm{out,inv}} \\times 1.25 \\right\\rceil",
        description: "Corriente de salida del inversor $I_{\\mathrm{out,inv}}$ con factor $1.25$, redondeada hacia arriba.",
    },
    {
        id: "itm_dc_min",
        name: "Protección ITM DC mínima",
        formula: "\\mathrm{ITM}_{\\mathrm{DC}} = \\left\\lfloor I_{\\mathrm{sc,mod}} \\times 1.25 \\right\\rfloor",
        description: "Corriente de cortocircuito del módulo $I_{\\mathrm{sc,mod}}$ con factor $1.25$, redondeada hacia abajo.",
    },
    {
        id: "spd_min",
        name: "Protección SPD",
        formula: "\\mathrm{SPD} = \\left\\lceil \\dfrac{N_{\\mathrm{p}} \\, V_{\\mathrm{oc,mod}}}{N_{\\mathrm{c}}} \\right\\rceil",
        description: "Voltaje SPD a partir del número exacto de paneles $N_{\\mathrm{p}}$, el VOC del módulo $V_{\\mathrm{oc,mod}}$ y el número de cadenas $N_{\\mathrm{c}}$.",
    },
];
