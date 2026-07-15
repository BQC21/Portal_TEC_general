import { precioFinal } from "@/lib/types/components/Quotes/finantial_computes";
import { formatCurrency } from "@/lib/utils/normalization";

export type SummaryCostTable_props = {
    precioFinal: precioFinal;
}

export function SummaryCostTable({
    precioFinal,
}: SummaryCostTable_props){
    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Resumen de costos de cotización</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-white text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo  + IGV
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta Final (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(precioFinal.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(precioFinal.solesIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    Venta Final ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(precioFinal.dolares, "USD")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(precioFinal.dolaresIgv, "USD")}
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}