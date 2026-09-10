import { EQUIPOS_HEADERS } from "@/lib/utils/headers";
import { Button2Edit } from "../../Buttons/Equipos/Button2Edit";
import { Button2Trash } from "../../Buttons/Equipos/Button2Trash";
import {
    displayApplicableCellValue,
    displayCellValue,
    getApplicableCellTextClass,
    getCellTextClass,
} from "@/lib/utils/helpers/manage_info/cell_manage";
import { toSafeNumber } from "@/lib/utils/normalization";
import { EquiposTableProps } from "@/lib/types/components/General/tables";
import {
    shouldRenderBatteryProp,
    shouldRenderInversorProp,
    shouldRenderModuloProp,
} from "@/lib/utils/helpers/render/render_modals";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";

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
                                equipos.map((equipo) => {
                                    const tipo = equipo.tipo_de_producto;
                                    const isModulo = shouldRenderModuloProp(tipo);
                                    const isInversor = shouldRenderInversorProp(tipo);
                                    const isBateria = shouldRenderBatteryProp(tipo);

                                    // Condiciones para visualizar contenido de la celda
                                    const showPanelesPalet = isModulo;
                                    const showPotenciaMaxima = isModulo || isInversor;
                                    const showInversorCount = isInversor;
                                    const showPotenciaAc = isInversor;
                                    const showDod = isBateria;
                                    const showVmpp = isBateria || isInversor || isModulo;
                                    const showVoc = isInversor || isModulo;
                                    const showVoltajeNominal = isInversor;
                                    const showIsc = isInversor || isModulo;

                                    // tasa de cambio
                                    const exchange_rate = (equipo.precio_soles/equipo.precio_dolares).toFixed(3)

                                    return (
                                    <tr key={equipo.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(equipo.cod_prov)}`}>{displayCellValue(equipo.cod_prov)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.proveedor)}`}>{displayCellValue(equipo.proveedor)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.cod_producto)}`}>{displayCellValue(equipo.cod_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.tipo_de_producto)}`}>{displayCellValue(equipo.tipo_de_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.marca)}`}>{displayCellValue(equipo.marca)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.descripcion)}`}>{displayCellValue(equipo.descripcion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.unidad)}`}>{displayCellValue(equipo.unidad)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.paneles_palet, showPanelesPalet)}`}>{displayApplicableCellValue(equipo.paneles_palet, showPanelesPalet)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.tipo_conexion)}`}>{displayCellValue(equipo.tipo_conexion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.potencia_maxima, showPotenciaMaxima)}`}>{displayApplicableCellValue(showPotenciaMaxima ? equipo.potencia_maxima.toFixed(3) : null, showPotenciaMaxima)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.mppt, showInversorCount)}`}>{displayApplicableCellValue(equipo.mppt, showInversorCount)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.cadenas, showInversorCount)}`}>{displayApplicableCellValue(equipo.cadenas, showInversorCount)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.potencia_ac, showPotenciaAc)}`}>{displayApplicableCellValue(equipo.potencia_ac, showPotenciaAc)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.dod, showDod)}`}>{displayApplicableCellValue(showDod ? equipo.dod.toFixed(0) : null, showDod)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.vmpp_vmin, showVmpp)}`}>{displayApplicableCellValue(equipo.vmpp_vmin, showVmpp)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.voc_vmax, showVoc)}`}>{displayApplicableCellValue(equipo.voc_vmax, showVoc)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.voltaje_nominal_inversor, showVoltajeNominal)}`}>{displayApplicableCellValue(equipo.voltaje_nominal_inversor, showVoltajeNominal)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.impp_i_in)}`}>{displayCellValue(equipo.impp_i_in)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getApplicableCellTextClass(equipo.isc_i_out, showIsc)}`}>{displayApplicableCellValue(equipo.isc_i_out, showIsc)}</td>
                                        {/* <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.unidad)}`}>{displayCellValue(equipo.unidad)}</td> */}
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(exchange_rate)}`}>{displayApplicableCellValue(exchange_rate, true)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_soles)}`}>{toSafeNumber(equipo.precio_soles).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_dolares)}`}>{toSafeNumber(equipo.precio_dolares).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.igv)}`}>{toSafeNumber(equipo.igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_soles_igv)}`}>{toSafeNumber(equipo.precio_soles_igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.precio_dolares_igv)}`}>{toSafeNumber(equipo.precio_dolares_igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.created_at)}`}>{formatDate(equipo.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(equipo.updated_at)}`}>{formatDate(equipo.updated_at)}</td>
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
                                    );
                                })
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