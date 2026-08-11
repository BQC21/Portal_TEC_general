"use client";

import { EnergyTableProps } from "@/lib/types/components/sub_components/module_render";
import { EnergyLineChart } from "./FinantialCharts";

export function EnergyTable({
    energyRows,
    maxYear,
    onAddYear,
    onRemoveYear,
}: EnergyTableProps) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">Variación de energía</h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onRemoveYear}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Quitar año
                    </button>
                    <button
                        type="button"
                        onClick={onAddYear}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Añadir año
                    </button>
                </div>
            </div>

            <div className="max-h-[1020px] overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr className="bg-slate-400 text-left text-white">
                            <th className="border-b border-slate-200 px-4 py-3 text-[1.02rem] font-bold text-slate-900">
                                Año
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-[1.02rem] font-bold text-slate-900">
                                Energía (MWh)
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3 text-[1.02rem] font-bold text-slate-900">
                                % degradación
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyRows.length > 0 ? (
                            energyRows.map((row) => (
                                <tr key={row.year} className="bg-white">
                                    <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                                        {row.year}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                                        {row.energy_mwh.toFixed(2)}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                                        {row.degradation_pct.toFixed(2)}%
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    Ingresa generación y degradación para calcular la tabla.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                    Energía generada por año (0–{maxYear})
                </h3>
                <EnergyLineChart
                    years={energyRows.map((row) => row.year)}
                    values={energyRows.map((row) => row.energy_mwh)}
                />
            </div> */}
        </section>
    );
}
