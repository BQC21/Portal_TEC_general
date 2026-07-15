import { formatCurrency } from "@/lib/utils/normalization";
import { viaticos } from "@/lib/types/components/Quotes/finantial_computes";

export function SummaryCostTable2({
    viaticosCosts,
}: {
    viaticosCosts: viaticos;
}){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Resumen de costos de viáticos</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo + IGV
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Viaje y Movilidad
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.eating.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.eating.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Alimentación
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.traveling.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.traveling.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Courier
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.courier.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(viaticosCosts.courier.igv, "PEN")}
                                    </td>
                                </tr>
                                

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.subtotal.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.subtotal.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.margenRiesgo.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.margenRiesgo.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.ventaSoles.ventaSoles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.ventaSoles.ventaSolesIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.ventaSoles.ventaDolares, "USD")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(viaticosCosts.resumen.ventaSoles.ventaDolaresIgv, "USD")}
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
