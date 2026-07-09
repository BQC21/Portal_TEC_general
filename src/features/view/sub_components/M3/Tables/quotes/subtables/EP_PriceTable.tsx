
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join"

export type EP_PriceTable_props = {
    selected_equipos: Project_Equipos[]
}

export function EP_PriceTable({
    selected_equipos, 
    }: EP_PriceTable_props){
    
    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Equipos Principales</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        COD PROD
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Unidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad (s/.) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad ($)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad ($) + IGV
                                    </th>
                                    {/* Cálculo automático */}
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.) + IGV
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total ($)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total ($) + IGV
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected_equipos.length > 0 ? (
                                    selected_equipos.map((item) => (
                                        <tr key={`${item.id}`} className="bg-white">
                                            {item.equipo_info?.tipo_de_producto !== "ESTRUCTURA" && (
                                                <>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.cod_producto}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.descripcion}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.unidad}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.cantidad}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.precio_soles}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.precio_soles_igv}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.precio_dolares}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.equipo_info?.precio_dolares_igv}
                                                    </td>
                                                    {/* Cálculo automático */}
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {Number(item.equipo_info?.precio_soles)*Number(item.cantidad)}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {Number(item.equipo_info?.precio_soles_igv)*Number(item.cantidad)}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {Number(item.equipo_info?.precio_dolares)*Number(item.cantidad)}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {Number(item.equipo_info?.precio_dolares_igv)*Number(item.cantidad)}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                            No hay equipos seleccionados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}