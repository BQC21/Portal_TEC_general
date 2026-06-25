import { MATERIALES_HEADERS } from "@/lib/utils/headers";
import { displayCellValue, getCellTextClass } from "@/lib/utils/helpers/manage_info/cell_manage";
import { toSafeNumber } from "@/lib/utils/normalization";
import { Button2Edit } from "../../Buttons/Materiales/Button2Edit";
import { Button2Trash } from "../../Buttons/Materiales/Button2Trash";
import { MaterialesTableProps } from "@/lib/types/components/tables";

export function MaterialesTable({ materiales, totalMateriales, 
    onUpdateMateriales, onDeleteMateriales}: MaterialesTableProps) {
    return (
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {MATERIALES_HEADERS.map((header) => (
                                    <th key={header} className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {materiales.length > 0 ? (
                                materiales.map((material) => (
                                    <tr key={material.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(material.cod_prov)}`}>{displayCellValue(material.cod_prov)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.proveedor)}`}>{displayCellValue(material.proveedor)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.cod_producto)}`}>{displayCellValue(material.cod_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.tipo_de_producto)}`}>{displayCellValue(material.tipo_de_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.marca)}`}>{displayCellValue(material.marca)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.descripcion)}`}>{displayCellValue(material.descripcion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.parte_electrica)}`}>{displayCellValue(material.parte_electrica)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.unidad)}`}>{displayCellValue(material.unidad)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.precio_soles)}`}>{toSafeNumber(material.precio_soles).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.precio_dolares)}`}>{toSafeNumber(material.precio_dolares).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.igv)}`}>{toSafeNumber(material.igv).toFixed(0)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.precio_soles_igv)}`}>{toSafeNumber(material.precio_soles_igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(material.precio_dolares_igv)}`}>{toSafeNumber(material.precio_dolares_igv).toFixed(2)}</td>
                                        {/* acciones */}
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit
                                                    material={material}
                                                    onUpdateMateriales={onUpdateMateriales}
                                                />
                                                <Button2Trash 
                                                    material={material}
                                                    onDeleteMaterial={onDeleteMateriales}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={MATERIALES_HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay materiales registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {materiales.length} de {totalMateriales} materiales
            </p>
            <p className="text-lg text-slate-500">
                <strong>Nota:</strong> Los campos donde tengan barritas representan que no corresponden según el tipo de producto. 
            </p>
        </section>
    );
}