import { formatCurrency } from "@/lib/utils/normalization";
import {
    computeMargenRiesgoRecursos,
    computeMarkUpRecursos,
    computeSubtotalConMargenRecursos,
    computeSubtotalRecursos,
    computeVentaRecursos,
} from "../../../../../../../lib/utils/helpers/computes/quote_computes";
import { RecursosCostsInput } from "@/lib/types/components/finantial_computes";


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
    gm_general,
    markup,
    tasa_cambio,
}: RecursosCostsInput & {
    gm_general: number;
    markup: number;
    tasa_cambio: number;
}){
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

    const subtotal = computeSubtotalRecursos(costs);
    const margenRiesgo = computeMargenRiesgoRecursos(costs, Number(gm_general));
    const subtotalConMargen = computeSubtotalConMargenRecursos(costs, Number(gm_general));
    const markUp = computeMarkUpRecursos(costs, Number(markup), Number(gm_general));
    const venta = computeVentaRecursos(costs, Number(markup), Number(tasa_cambio), Number(gm_general));

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
                                        {formatCurrency(equiposPrincipalesCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(equiposPrincipalesCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Estructuras
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(estructurasCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(estructurasCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Consumibles
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(consumiblesCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(consumiblesCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        EPPs
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(eppCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(eppCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Herramientas
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(toolingCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(toolingCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Hotel
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(hotelCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(hotelCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Personal
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(personalCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(personalCostIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        SCTR
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(sctrCost, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {formatCurrency(sctrCostIgv, "PEN")}
                                    </td>
                                </tr>

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotal.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotal.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(margenRiesgo.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(margenRiesgo.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Subtotal con Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotalConMargen.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(subtotalConMargen.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Mark Up
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(markUp.soles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(markUp.igv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(venta.ventaSoles, "PEN")}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {formatCurrency(venta.ventaSolesIgv, "PEN")}
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {Number(tasa_cambio) > 0 ? formatCurrency(venta.ventaSoles/(Number(tasa_cambio)), "USD") : 0}
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        {Number(tasa_cambio) > 0 ? formatCurrency(venta.ventaSolesIgv/(Number(tasa_cambio)), "USD") : 0}
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
