import type { Equipos } from "@/lib/types/equipos-types";
import { EQUIPOS_HEADERS } from "@/lib/utils/headers";
import { Button2Edit } from "../../Buttons/Equipos/Button2Edit";
import { Button2Trash } from "../../Buttons/Equipos/Button2Trash";
import { displayCellValue, getCellTextClass } from "@/lib/utils/helpers/manage_info/cell_manage";
import { toSafeNumber } from "@/lib/utils/normalization";

type EquiposTableProps = {
    equipos: Equipos[];
    totalEquipos: number;
    onUpdateEquipos: (equipo: Equipos) => void;
    onDeleteEquipos: (equipoId: string) => void;
};

export function EquiposTable({ equipos, totalEquipos, onUpdateEquipos, onDeleteEquipos }: EquiposTableProps) {
    return (
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {EQUIPOS_HEADERS.map((header) => (
                                    <th key={header} className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {equipos.length > 0 ? (
                                equipos.map((equipo) => (
                                    <tr key={equipo.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(equipo.cod_prov)}`}>{displayCellValue(equipo.cod_prov)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.proveedor)}`}>{displayCellValue(equipo.proveedor)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.cod_producto)}`}>{displayCellValue(equipo.cod_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.tipo_de_producto)}`}>{displayCellValue(equipo.tipo_de_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.marca)}`}>{displayCellValue(equipo.marca)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.descripcion)}`}>{displayCellValue(equipo.descripcion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.tipo_conexion)}`}>{displayCellValue(equipo.tipo_conexion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.potencia_maxima)}`}>{displayCellValue(equipo.potencia_maxima)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.mppt)}`}>{displayCellValue(equipo.mppt)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.potencia_ac)}`}>{displayCellValue(equipo.potencia_ac)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.dod)}`}>{displayCellValue(equipo.dod.toFixed(0))}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.vmpp_vmin)}`}>{displayCellValue(equipo.vmpp_vmin)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.voc_vmax)}`}>{displayCellValue(equipo.voc_vmax)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.impp_i_in)}`}>{displayCellValue(equipo.impp_i_in)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.isc_i_out)}`}>{displayCellValue(equipo.isc_i_out)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.unidad)}`}>{displayCellValue(equipo.unidad)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_soles)}`}>{toSafeNumber(equipo.precio_soles).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_dolares)}`}>{toSafeNumber(equipo.precio_dolares).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.igv)}`}>{toSafeNumber(equipo.igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_soles_igv)}`}>{toSafeNumber(equipo.precio_soles_igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_dolares_igv)}`}>{toSafeNumber(equipo.precio_dolares_igv).toFixed(2)}</td>
                                        {/* acciones */}
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit
                                                    equipo={equipo}
                                                    onUpdateEquipo={onUpdateEquipos}
                                                />
                                                <Button2Trash 
                                                    equipo={equipo}
                                                    onDeleteEquipo={onDeleteEquipos}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={EQUIPOS_HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay equipos registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {equipos.length} de {totalEquipos} equipos
            </p>
            <p className="text-lg text-slate-500">
                <strong>Nota:</strong> Los campos donde tengan barritas representan que no corresponden según el tipo de producto. 
            </p>
        </section>
    );
}