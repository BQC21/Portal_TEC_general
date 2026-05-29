import type { Equipos } from "@/lib/types/equipos-types";
import { EQUIPOS_HEADERS } from "@/lib/utils/headers";
import { displayCellValue, getCellTextClass, toSafeNumber } from "@/lib/utils/helpers";

type EquiposTableProps = {
    products: Equipos[];
    totalProducts: number;
};

export function EquiposTable({ products, totalProducts }: EquiposTableProps) {
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
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(product.cod_prov)}`}>{displayCellValue(product.cod_prov)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.proveedor)}`}>{displayCellValue(product.proveedor)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.cod_producto)}`}>{displayCellValue(product.cod_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_de_producto)}`}>{displayCellValue(product.tipo_de_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.marca)}`}>{displayCellValue(product.marca)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.descripcion)}`}>{displayCellValue(product.descripcion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_conexion)}`}>{displayCellValue(product.tipo_conexion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.potencia_maxima)}`}>{displayCellValue(product.potencia_maxima)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.mppt_dod)}`}>{displayCellValue(product.mppt_dod)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.potencia_ac)}`}>{displayCellValue(product.potencia_ac)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.voc_vmax)}`}>{displayCellValue(product.voc_vmax)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.vmpp_vmin)}`}>{displayCellValue(product.vmpp_vmin)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.isc_imax_in)}`}>{displayCellValue(product.isc_imax_in)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.impp_imax_out)}`}>{displayCellValue(product.impp_imax_out)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.unidad)}`}>{displayCellValue(product.unidad)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.precio_soles)}`}>{toSafeNumber(product.precio_soles).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.precio_dolares)}`}>{toSafeNumber(product.precio_dolares).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.igv)}`}>{toSafeNumber(product.igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.precio_soles_igv)}`}>{toSafeNumber(product.precio_soles_igv).toFixed(2)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.precio_dolares_igv)}`}>{toSafeNumber(product.precio_dolares_igv).toFixed(2)}</td>
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
                Mostrando {products.length} de {totalProducts} equipos
            </p>
        </section>
    );
}