"use client";

import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { FinantialDetailsProps } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

const computedFieldClass = "bg-rose-100 text-rose-900 border-rose-200";

export function FinantialDetails({ analysis }: FinantialDetailsProps) {
    return (
        <div className="grid gap-2">
            <h2 className="mt-2 mb-1 text-xl font-bold text-red-900">Detalles financieros</h2>
            <AddProductReadonlyField
                label="CAPEX acumulado"
                value={formatCurrency(analysis.capex_total, "USD")}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="O&M acumulado"
                value={formatCurrency(analysis.om_total, "USD")}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="Energía acumulada"
                value={`${analysis.energia_total.toFixed(2)} MWh`}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="LCOE"
                value={
                    analysis.lcoe === null
                        ? "—"
                        : `${formatCurrency(analysis.lcoe, "USD")}/MWh`
                }
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="VAN"
                value={
                    analysis.van === null
                        ? "—"
                        : formatCurrency(analysis.van, "USD")
                }
                colorClass={computedFieldClass}
            />
            {/* <p className="text-xs text-slate-500">
                LCOE = (CAPEX total + O&amp;M total) / Energía total · VAN = NPV(tasa, flujos 1–20) + flujo año 0
            </p> */}
        </div>
    );
}
