import { QuoteReportTable_Props } from "@/lib/types/components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

export function QuoteReportTable({
    precioFinal, igv
}: QuoteReportTable_Props){
    return(
        <>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    Subtotal ($)
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {formatCurrency(precioFinal, "USD")}
                                </td>
                            </tr>
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    IGV ($)
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {formatCurrency(precioFinal * igv , "USD")}
                                </td>
                            </tr>
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    Total ($)
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {formatCurrency(precioFinal * (1 + igv), "USD")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}