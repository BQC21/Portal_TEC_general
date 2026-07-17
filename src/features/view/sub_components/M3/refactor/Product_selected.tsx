import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { Product_selectedProps } from "@/lib/types/components/module_render";

export function Product_selected({
    equiposDescriptions,
    materialesDescriptions,
    form,
    updateField,
    grossMargin,
}: Product_selectedProps) {
    return(
        <div className="mt-6 grid gap-6 grid-cols-[2fr_2fr_1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Equipos seleccionados
                </h3>
                <p className="max-h-64 overflow-y-auto whitespace-pre-line text-slate-700">
                    {equiposDescriptions.length > 0
                        ? equiposDescriptions.join("\n")
                        : "No hay equipos registrados para este proyecto."}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                    Materiales seleccionados
                </h3>
                <p className="max-h-64 overflow-y-auto whitespace-pre-line text-slate-700">
                    {materialesDescriptions.length > 0
                        ? materialesDescriptions.join("\n")
                        : "No hay materiales registrados para este proyecto."}
                </p>
            </div>
            
            <div className="grid gap-6">
                <h2 className="mt-2 mb-2 text-1xl font-bold text-red-900">Márgenes financieros</h2>
                <AddProductNumberField
                    label="Porcentaje de MarkUp (%)"
                    required
                    value={Number(form.markup) > 0 ? Number(form.markup) : ""}
                    onChange={(value) => updateField("markup", String(value))}
                    step={1}   min={30}   max={50}
                />
                <AddProductNumberField
                    label="Porcentaje del margen de riesgos para la tabla de recursos (%)"
                    required
                    value={Number(form.gm_general) > 0 ? Number(form.gm_general) : ""}
                    onChange={(value) => updateField("gm_general", String(value))}
                    step={1}   min={1}   max={10}
                />
                <AddProductNumberField
                    label="Porcentaje del margen de riesgos para la tabla de viáticos (%)"
                    required
                    value={Number(form.gm_viaticos) > 0 ? Number(form.gm_viaticos) : ""}
                    onChange={(value) => updateField("gm_viaticos", String(value))}
                    step={1}   min={1}   max={10}
                />
                <AddProductReadonlyField
                    label="Gross Margin (%)"
                    value={Number(grossMargin.gm.gm) >= 0 ? String((Number(grossMargin.gm.gm) * 100).toFixed(2)) : "0.00"}
                />
            </div>

            <div className="grid gap-6">
                <h2 className="mt-2 mb-2 text-1xl font-bold text-red-900">Parámetros financieros</h2>
                <AddProductNumberField
                    label="IGV (Impuesto General a la Venta)"
                    required
                    value={Number(form.igv) > 0 ? Number(form.igv) : ""}
                    onChange={(value) => updateField("igv", String(value))}
                    step={0.01}   min={0.15}   max={0.18}
                />
                <AddProductNumberField
                    label="Tasa de cambio"
                    required
                    value={Number(form.tasa_cambio) > 0 ? Number(form.tasa_cambio) : ""}
                    onChange={(value) => updateField("tasa_cambio", String(value))}
                    step={0.01}   min={3.00}   max={4.50}
                />
                <AddProductReadonlyField
                    label="Código de cotización"
                    value={form.cod_cotizacion ?? ""}
                />
            </div>
        </div>
    )
}