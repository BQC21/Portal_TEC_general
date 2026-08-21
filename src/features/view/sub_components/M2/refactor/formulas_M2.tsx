type FormulaItem = {
    id: string;
    name: string;
    formula: string;
    description: string;
};

const ENERGY_FORMULAS: FormulaItem[] = [
    {
        id: "cobertura_porcentaje",
        name: "Porcentaje de cobertura (%)",
        formula: "cobertura = (energía / demanda) × 100",
        description: "Relación entre la energía requerida y la demanda eléctrica anual. Se usa en llenado manual.",
    },
    {
        id: "energia_requerida",
        name: "Energía requerida",
        formula: "energía = demanda × cobertura / 100",
        description: "Energía que debe producir el sistema a partir de la demanda y el porcentaje de cobertura.",
    },
    {
        id: "potencia_dc_requerida",
        name: "Potencia DC requerida (kW)",
        formula: "P_DC = energía / (GHI o GTI × η / 100)",
        description: "Usa GHI si el ángulo es Coplanar y GTI si es Inclinado. El rendimiento del módulo (η) es 80%.",
    },
    {
        id: "potencia_ac_requerida",
        name: "Potencia AC requerida (kW)",
        formula: "P_AC = P_DC / 1.2",
        description: "Potencia AC equivalente a la potencia DC requerida, con factor 1.2.",
    },
];

const ARRAY_FORMULAS: FormulaItem[] = [
    {
        id: "min_strings",
        name: "Mínimo de paneles",
        formula: "N_min = P_DC / P_módulo",
        description: "Cantidad mínima de paneles según la potencia DC requerida y la potencia máxima del módulo.",
    },
    {
        id: "max_strings",
        name: "Máximo de paneles",
        formula: "N_max = P_DC_inversor / P_módulo",
        description: "Cantidad máxima de paneles según la potencia DC máxima del inversor y la potencia del módulo.",
    },
];

const PROTECTION_FORMULAS: FormulaItem[] = [
    {
        id: "itm_ac_min",
        name: "Protección ITM AC mínima",
        formula: "ITM_AC = ⌈ I_out_inversor × 1.25 ⌉",
        description: "Corriente de salida del inversor con factor 1.25, redondeada hacia arriba.",
    },
    {
        id: "itm_dc_min",
        name: "Protección ITM DC mínima",
        formula: "ITM_DC = ⌊ Isc_módulo × 1.25 ⌋",
        description: "Corriente de cortocircuito del módulo con factor 1.25, redondeada hacia abajo.",
    },
    {
        id: "spd_min",
        name: "Protección SPD",
        formula: "SPD = ⌈ N_paneles × Voc_módulo / N_cadenas ⌉",
        description: "Voltaje SPD a partir del número exacto de paneles, el VOC del módulo y el número de cadenas.",
    },
];

function FormulaGroup({ title, items }: { title: string; items: FormulaItem[] }) {
    return (
        <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                        {/* <p className="text-sm font-semibold text-slate-500">{item.id}</p> */}
                        <h4 className="mt-1 text-lg font-bold text-slate-900">{item.name}</h4>
                        <p className="mt-3 rounded-xl bg-white px-3 py-2 font-mono text-sm text-slate-800">
                            {item.formula}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export function Formulas_M2() {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-3 py-5 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">Fórmulas de cálculo</h2>
            <FormulaGroup title="Requerimientos energéticos" items={ENERGY_FORMULAS} />
            <FormulaGroup title="Campo fotovoltaico" items={ARRAY_FORMULAS} />
            <FormulaGroup title="Protecciones eléctricas" items={PROTECTION_FORMULAS} />
        </div>
    );
}
