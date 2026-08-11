"use client";

import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { Finantial_selectedProps } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

const computedFieldClass = "bg-rose-100 text-rose-900 border-rose-200";

// función para formatear años
function formatYears(value: number | null): string {
    if (value === null || Number.isNaN(value)) return "—";
    return `${value.toFixed(2)} años`;
}

export function FinantialData({ form, updateField, analysis }: Finantial_selectedProps) {
    return (
        <div className="grid gap-2">
            <h2 className="mt-2 mb-1 text-xl font-bold text-red-900">Ingrese datos</h2>
            <AddProductNumberField
                label="Energía generada por la planta"
                required
                value={Number(form.planta) > 0 ? Number(form.planta) : ""}
                onChange={(value) => updateField("planta", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Generación en el primer año (MWh)"
                required
                value={Number(form.generacion) > 0 ? Number(form.generacion) : ""}
                onChange={(value) => updateField("generacion", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Tarifa de la red"
                required
                value={Number(form.tarifa_red) > 0 ? Number(form.tarifa_red) : ""}
                onChange={(value) => updateField("tarifa_red", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) degradación en el 1er año"
                required
                value={Number(form.degra_1er) > 0 ? Number(form.degra_1er) : ""}
                onChange={(value) => updateField("degra_1er", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) degradación desde el 2do año"
                required
                value={Number(form.degra_2do) > 0 ? Number(form.degra_2do) : ""}
                onChange={(value) => updateField("degra_2do", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) incremento de la tarifa"
                required
                value={Number(form.tasa_crecimiento) > 0 ? Number(form.tasa_crecimiento) : ""}
                onChange={(value) => updateField("tasa_crecimiento", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Tasa de descuento (%)"
                required
                value={Number(form.tasa_descuento) > 0 ? Number(form.tasa_descuento) : ""}
                onChange={(value) => updateField("tasa_descuento", String(value))}
                step={0.01}
                min={0}
            />

            <AddProductReadonlyField
                label="CAPEX"
                value={formatCurrency(analysis.capex, "USD")}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="OPEX"
                value={formatCurrency(analysis.opex, "USD")}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="Tiempo de recuperación"
                value={formatYears(analysis.tiempo_retorno)}
                colorClass={computedFieldClass}
            />
        </div>
    );
}
