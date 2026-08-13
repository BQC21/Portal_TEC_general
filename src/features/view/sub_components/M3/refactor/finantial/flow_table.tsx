"use client";

import { FlowTableProps } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";
import { FlowComboChart, FlowComponentsChart } from "./FinantialCharts";

// -----------
// FORMATEOS
// -----------

function formatOptionalCurrency(value: number | null): string {
    if (value === null) return "—";
    return formatCurrency(value, "USD");
}
function formatOptionalNumber(value: number | null): string {
    if (value === null) return "—";
    return value.toFixed(2);
}

export function FlowTable({ flowRows }: FlowTableProps) {
    const years = flowRows.map((row) => row.year);
    const firstPositiveYear = flowRows.find(
        (row) => row.year > 0 && row.flujo_acumulado >= 0
    )?.year; // extracción del 1er año positivo

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Flujos</h2>

            <div className="max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr className="bg-slate-400 text-left text-white">
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Año</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Equipamiento</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Tarifa cliente</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">O&amp;M</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Energía (MWh)</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Ahorro facturación</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Flujo total</th>
                            <th className="border-b border-slate-200 px-3 py-3 font-bold text-slate-900">Flujo acumulado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flowRows.length > 0 ? (
                            flowRows.map((row) => {
                                // condiciones
                                const isNegative = row.flujo_acumulado < 0;
                                const isFirstPositive = row.year === firstPositiveYear;
                                // coloreo según el efecto del flujo acumulado
                                const rowClass = isNegative ? "bg-red-50" : "bg-white";
                                // color de texto en la columna de flujo acumulado
                                const accumulatedClass = isFirstPositive
                                    ? "border-b border-slate-200 px-3 py-2.5 font-semibold bg-orange-400 text-white"
                                    : isNegative
                                        ? "border-b border-slate-200 px-3 py-2.5 font-medium text-red-700"
                                        : "border-b border-slate-200 px-3 py-2.5 font-medium";

                                return (
                                <tr key={row.year} className={rowClass}>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {row.year}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {row.equipamiento > 0
                                            ? formatCurrency(row.equipamiento, "USD")
                                            : "—"}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {formatOptionalCurrency(row.tarifa_cliente)}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {formatOptionalCurrency(row.om)}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {formatOptionalNumber(row.energy_mwh)}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {formatOptionalCurrency(row.ahorro)}
                                    </td>
                                    <td className="border-b border-slate-200 px-3 py-2.5 font-medium">
                                        {formatCurrency(row.flujo_total, "USD")}
                                    </td>
                                    <td className={accumulatedClass}>
                                        {formatCurrency(row.flujo_acumulado, "USD")}
                                    </td>
                                </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    Completa los datos de entrada para calcular los flujos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* GRÁFICAS */}
            <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                    Componentes del flujo
                </h3>
                <FlowComponentsChart
                    years={years}
                    equipamiento={flowRows.map((row) => row.equipamiento)}
                    om={flowRows.map((row) => row.om ?? 0)}
                    ahorro={flowRows.map((row) => row.ahorro ?? 0)}
                />
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                    Flujo total vs flujo acumulado
                </h3>
                <FlowComboChart
                    years={years}
                    flujoTotal={flowRows.map((row) => row.flujo_total)}
                    flujoAcumulado={flowRows.map((row) => row.flujo_acumulado)}
                />
            </div>
        </section>
    );
}
