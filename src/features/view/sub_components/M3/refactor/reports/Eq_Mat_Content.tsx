"use client";

import { Eq_Mat_Content_Props } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

export function Eq_Mat_Content({
    title, precioFinal, Eq_Mt,
    selectedEquipos, selectedMateriales,
    hiddenEquipoIds = [],
    onToggleEquipoVisibility,
}: Eq_Mat_Content_Props){
    return(
        <>
        <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-2xl font-bold uppercase">
                    {title}
                </h2>

                <div className="flex items-center gap-24 text-2xl font-bold">
                    <span>{formatCurrency(precioFinal * Eq_Mt / 100, "USD")}</span>
                </div>
            </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    {/* EQUIPOS */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - EQUIPOS
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-center text-[1.02rem] font-bold text-slate-900">
                                    Mostrar en PDF
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEquipos.length > 0 ? (
                                selectedEquipos.map((item) => {
                                    const itemId = String(item.id);
                                    const visibleInPdf = !hiddenEquipoIds.includes(itemId);
                                    return (
                                    <tr
                                        key={itemId}
                                        className={visibleInPdf ? "bg-white" : "bg-slate-50 text-slate-400"}
                                    >
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
                                        <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                            <input
                                                type="checkbox"
                                                checked={visibleInPdf}
                                                onChange={() => onToggleEquipoVisibility?.(itemId)}
                                                aria-label={`Mostrar ${item.equipo_info?.descripcion || "equipo"} en el PDF`}
                                                className="h-5 w-5 accent-orange-500"
                                            />
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                        No hay equipos seleccionados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* MATERIALES */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - MATERIALES ELÉCTRICOS
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedMateriales.length > 0 ? (
                                selectedMateriales.map((item) => (
                                    <tr key={`${item.id}`} className="bg-white">
                                        {(item.material_info?.tipo_de_producto === "PROTECCIÓN" ||
                                        item.material_info?.tipo_de_producto === "CABLE") && (
                                            <>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.cod_producto}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.descripcion}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.unidad}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.cantidad}
                                                </td>
                                            </>
                                        )}        
                                    </tr>
                                ))) : (
                                <tr className="bg-white">
                                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                                        No hay materiales seleccionados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* CANALIZACIÓN */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - MATERIALES DE CANALIZACIÓN
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedMateriales.length > 0 ? (
                                selectedMateriales.map((item) => (
                                    <tr key={`${item.id}`} className="bg-white">
                                        {item.material_info?.tipo_de_producto === "CANALIZACIÓN" && (
                                            <>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.cod_producto}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.descripcion}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.material_info?.unidad}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.cantidad}
                                                </td>
                                            </>
                                        )}        
                                    </tr>
                                ))) : (
                                <tr className="bg-white">
                                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                                        No hay materiales seleccionados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </section>
        </>
    )
}
