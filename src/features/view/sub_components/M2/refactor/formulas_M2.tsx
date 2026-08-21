
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
