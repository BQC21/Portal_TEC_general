import { formatCurrency } from "@/lib/utils/normalization";
import {
    computeMargenRiesgoViaticos,
    computeSubtotalViaticos,
    computeVentaViaticos,
} from "../../../../../../../lib/utils/helpers/computes/quote_computes";
import { ViaticosCostsInput, ViaticosSubtotalInput } from "@/lib/types/components/Quotes/finantial_computes";

export function SummaryCostTable2({
    eatingTotal,
    eatingTotalIgv,
    travelingTotal,
    travelingTotalIgv,
    courierTotal,
    courierTotalIgv,
    // PARÁMETROS
    igv,
    // SUBTOTALES
    subtotal_viaticos_soles,
    subtotal_viaticos_igv,
    margenRiesgo_viaticos_soles,
    margenRiesgo_viaticos_igv,
    ventaSoles_viaticos_soles,
    ventaSoles_viaticos_igv,
    ventaDolares_viaticos_soles,
    ventaDolares_viaticos_igv,
}: ViaticosCostsInput & {
    igv: number;
} & ViaticosSubtotalInput){

    const costs: ViaticosCostsInput = {
        eatingTotal: Number(eatingTotal),
        eatingTotalIgv: Number(eatingTotalIgv),
        travelingTotal: Number(travelingTotal),
        travelingTotalIgv: Number(travelingTotalIgv),
        courierTotal: Number(courierTotal),
        courierTotalIgv: Number(courierTotalIgv),
    };

    const subtotales: ViaticosSubtotalInput = {
        subtotal_viaticos_soles: Number(subtotal_viaticos_soles),
        subtotal_viaticos_igv: Number(subtotal_viaticos_igv),
        margenRiesgo_viaticos_soles: Number(margenRiesgo_viaticos_soles),
        margenRiesgo_viaticos_igv: Number(margenRiesgo_viaticos_igv),
        ventaSoles_viaticos_soles: Number(ventaSoles_viaticos_soles),
        ventaSoles_viaticos_igv: Number(ventaSoles_viaticos_igv),
        ventaDolares_viaticos_soles: Number(ventaDolares_viaticos_soles),
        ventaDolares_viaticos_igv: Number(ventaDolares_viaticos_igv),
    }

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
                                        {formatCurrency(costs.eatingTotal, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.eatingTotalIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Alimentación
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.travelingTotal, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.travelingTotalIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Courier
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.courierTotal, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.courierTotalIgv, "PEN")}
                                    </td>
                                </tr>
                                

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotal_viaticos_soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotal_viaticos_igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.margenRiesgo_viaticos_soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.margenRiesgo_viaticos_igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaSoles_viaticos_soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaSoles_viaticos_igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaDolares_viaticos_soles, "USD")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaDolares_viaticos_igv, "USD")}
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
