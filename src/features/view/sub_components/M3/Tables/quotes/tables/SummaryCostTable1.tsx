import { formatCurrency } from "@/lib/utils/normalization";
import {
    computeMargenRiesgoRecursos,
    computeMarkUpRecursos,
    computeSubtotalConMargenRecursos,
    computeSubtotalRecursos,
    computeVentaRecursos,
} from "../../../../../../../lib/utils/helpers/computes/quote_computes";
import { RecursosCostsInput, RecursosSubtotalInput } from "@/lib/types/components/Quotes/finantial_computes";


export function SummaryCostTable1({
    equiposPrincipalesCost,
    equiposPrincipalesCostIgv,
    estructurasCost,
    estructurasCostIgv,
    consumiblesCost,
    consumiblesCostIgv,
    eppCost,
    eppCostIgv,
    toolingCost,
    toolingCostIgv,
    hotelCost,
    hotelCostIgv,
    personalCost,
    personalCostIgv,
    sctrCost,
    sctrCostIgv,
    // PARÁMETROS
    igv,
    // SUBTOTALES
    subtotal_recursos,
    margenRiesgo_recursos,
    subtotalConMargenRiesgo_recursos,
    markUp_recursos,
    ventaSoles_recursos,
    ventaSolesIgv_recursos,
    ventaDolares_recursos,
    ventaDolaresIgv_recursos,
}: RecursosCostsInput & {
    igv: number;
} & RecursosSubtotalInput){

    const costs: RecursosCostsInput = {
        equiposPrincipalesCost: Number(equiposPrincipalesCost),
        equiposPrincipalesCostIgv: Number(equiposPrincipalesCostIgv),
        estructurasCost: Number(estructurasCost),
        estructurasCostIgv: Number(estructurasCostIgv),
        consumiblesCost: Number(consumiblesCost),
        consumiblesCostIgv: Number(consumiblesCostIgv),
        eppCost: Number(eppCost),
        eppCostIgv: Number(eppCostIgv),
        toolingCost: Number(toolingCost),
        toolingCostIgv: Number(toolingCostIgv),
        hotelCost: Number(hotelCost),
        hotelCostIgv: Number(hotelCostIgv),
        personalCost: Number(personalCost),
        personalCostIgv: Number(personalCostIgv),
        sctrCost: Number(sctrCost),
        sctrCostIgv: Number(sctrCostIgv),
    };

    const subtotales: RecursosSubtotalInput = {
        subtotal_recursos: Number(subtotal_recursos),
        margenRiesgo_recursos: Number(margenRiesgo_recursos),
        subtotalConMargenRiesgo_recursos: Number(subtotalConMargenRiesgo_recursos),
        markUp_recursos: Number(markUp_recursos),
        ventaSoles_recursos: Number(ventaSoles_recursos),
        ventaSolesIgv_recursos: Number(ventaSolesIgv_recursos),
        ventaDolares_recursos: Number(ventaDolares_recursos),
        ventaDolaresIgv_recursos: Number(ventaDolaresIgv_recursos),
    }

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
                                        {formatCurrency(costs.equiposPrincipalesCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.equiposPrincipalesCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Estructuras
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.estructurasCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.estructurasCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Consumibles
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.consumiblesCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.consumiblesCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        EPPs
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.eppCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.eppCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Herramientas
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.toolingCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.toolingCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Hotel
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.hotelCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.hotelCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Personal
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.personalCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.personalCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        SCTR
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.sctrCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(costs.sctrCostIgv, "PEN")}
                                    </td>
                                </tr>

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotal_recursos, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotal_recursos * (1+igv), "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.margenRiesgo_recursos, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.margenRiesgo_recursos * (1+igv), "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Subtotal con Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotalConMargenRiesgo_recursos, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.subtotalConMargenRiesgo_recursos * (1+igv), "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Mark Up
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.markUp_recursos, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.markUp_recursos * (1+igv), "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaSoles_recursos, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaSolesIgv_recursos, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaDolares_recursos, "USD")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotales.ventaDolaresIgv_recursos, "USD")}
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
