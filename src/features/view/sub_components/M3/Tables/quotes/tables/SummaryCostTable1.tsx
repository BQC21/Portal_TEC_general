import { formatCurrency } from "@/lib/utils/normalization";
import { recursos } from "@/lib/types/components/Quotes/finantial_computes";


export function SummaryCostTable1({
    recursosCosts,
}: {
    recursosCosts: recursos;
}){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Resumen de costos de recursos</h2>
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
                                        Costo + IGV
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Equipos Principales
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.equiposPrincipales.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.equiposPrincipales.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Estructuras
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.estructuras.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.estructuras.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Consumibles
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.consumibles.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.consumibles.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        EPPs
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.epp.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.epp.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Herramientas
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.tooling.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.tooling.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Hotel
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.hotel.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.hotel.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Personal
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.personal.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.personal.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        SCTR
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.sctr.total, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(recursosCosts.sctr.igv, "PEN")}
                                    </td>
                                </tr>

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.subtotal.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.subtotal.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.margenRiesgo.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.margenRiesgo.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Subtotal con Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.subtotalConMargenRiesgo.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.subtotalConMargenRiesgo.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Mark Up
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.markUp.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.markUp.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.ventaSoles.ventaSoles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.ventaSoles.ventaSolesIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.ventaSoles.ventaDolares, "USD")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(recursosCosts.resumen.ventaSoles.ventaDolaresIgv, "USD")}
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
