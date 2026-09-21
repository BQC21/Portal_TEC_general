"use client";

import { Eq_Mat_Content_Props } from "@/lib/types/components/sub_components/module_render";
import { toEquipoReportRows } from "@/lib/utils/helpers/computes/PanelNumber";
import { isCanalizationMaterial, isElectricalMaterial } from "@/lib/utils/helpers/computes/report_computes";
import { MaterialVisibilityCheckbox } from "@/lib/utils/helpers/render/CheckboxVisibility";
import { formatCurrency } from "@/lib/utils/normalization";

export function Eq_Mat_Content({
    title, precioFinal, Eq_Mt,
    selectedEquipos, selectedMateriales,
    hiddenEquipoIds = [],
    onToggleEquipoVisibility,
    hiddenMaterialIds = [],
    onToggleMaterialVisibility,
    showElectricalMaterialsInPdf = false,
    onToggleElectricalMaterialsTable,
    showCanalizationMaterialsInPdf = false,
    onToggleCanalizationMaterialsTable,
}: Eq_Mat_Content_Props){
    const equipoRows = toEquipoReportRows(selectedEquipos);
    const electricalMaterials = selectedMateriales.filter(isElectricalMaterial);
    const canalizationMaterials = selectedMateriales.filter(isCanalizationMaterial);

    return(
        <>
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
                <h2 className="text-2xl font-bold uppercase">
                    {title}
                </h2>

                <div className="flex flex-wrap items-center gap-6 text-2xl font-bold">
                    <label className="flex items-center gap-2 text-base font-semibold text-slate-800">
                        <span>Mostrar Materiales eléctricos en PDF</span>
                        <input
                            type="checkbox"
                            checked={showElectricalMaterialsInPdf}
                            onChange={(event) =>
                                onToggleElectricalMaterialsTable?.(event.target.checked)
                            }
                            className="h-5 w-5 accent-orange-500"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-base font-semibold text-slate-800">
                        <span>Mostrar Materiales de canalización en PDF</span>
                        <input
                            type="checkbox"
                            checked={showCanalizationMaterialsInPdf}
                            onChange={(event) =>
                                onToggleCanalizationMaterialsTable?.(event.target.checked)
                            }
                            className="h-5 w-5 accent-orange-500"
                        />
                    </label>
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
                            {equipoRows.length > 0 ? (
                                equipoRows.map((item) => {
                                    const visibleInPdf = item.ids.every((id) => !hiddenEquipoIds.includes(id));
                                    return (
                                        <tr
                                            key={item.ids.join("-")}
                                            className={visibleInPdf ? "bg-white" : "bg-slate-50 text-slate-400"}
                                        >
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.cod_producto}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.descripcion}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.unidad}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {String(item.cantidad)}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                                <input
                                                    type="checkbox"
                                                    checked={visibleInPdf}
                                                    onChange={() =>
                                                        item.ids.forEach((id) => {
                                                            const currentlyVisible = !hiddenEquipoIds.includes(id);
                                                            if (currentlyVisible === visibleInPdf) {
                                                                onToggleEquipoVisibility?.(id);
                                                            }
                                                        })
                                                    }
                                                    aria-label={`Mostrar ${item.descripcion || "equipo"} en el PDF`}
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
                                <th className="border-b border-slate-200 px-4 py-4 text-center text-[1.02rem] font-bold text-slate-900">
                                    Mostrar en PDF
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {electricalMaterials.length > 0 ? (
                                electricalMaterials.map((item) => {
                                    const visibleInPdf = !hiddenMaterialIds.includes(String(item.id));
                                    return (
                                        <tr
                                            key={`${item.id}`}
                                            className={visibleInPdf ? "bg-white" : "bg-slate-50 text-slate-400"}
                                        >
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
                                            <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                                <MaterialVisibilityCheckbox
                                                    item={item}
                                                    hiddenMaterialIds={hiddenMaterialIds}
                                                    onToggleMaterialVisibility={onToggleMaterialVisibility}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
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
                                <th className="border-b border-slate-200 px-4 py-4 text-center text-[1.02rem] font-bold text-slate-900">
                                    Mostrar en PDF
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {canalizationMaterials.length > 0 ? (
                                canalizationMaterials.map((item) => {
                                    const visibleInPdf = !hiddenMaterialIds.includes(String(item.id));
                                    return (
                                        <tr
                                            key={`${item.id}`}
                                            className={visibleInPdf ? "bg-white" : "bg-slate-50 text-slate-400"}
                                        >
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
                                            <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                                <MaterialVisibilityCheckbox
                                                    item={item}
                                                    hiddenMaterialIds={hiddenMaterialIds}
                                                    onToggleMaterialVisibility={onToggleMaterialVisibility}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
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
