export type SummaryCostTable1_props = {

}

export function SummaryCostTable1({
    }: SummaryCostTable1_props){
    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Resumen de costos de recursos</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Costo (s/.) + IGV
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Equipos Principales
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Estructuras
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Consumibles
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        EPPs
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Herramientas
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Hotel
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Personal
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        SCTR
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>

                                {/*Subtotales*/}
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        subtotal
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Subtotal con Margen de riesgo
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Mark Up
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
                                    </td>
                                </tr>
                                <tr className="bg-slate-800 text-white font-bold text-left">
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Venta ($)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.)
                                    </td>
                                    <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                        Ingrese Costo (s/.) + IGV
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