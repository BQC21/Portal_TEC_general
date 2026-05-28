import type { Materiales } from "@/lib/types/materiales-types";
import { MATERIALES_HEADERS } from "@/lib/utils/headers";
import { displayCellValue, getCellTextClass, toSafeNumber } from "@/lib/utils/helpers";

type MaterialesTableProps = {
    products: Materiales[];
    totalProducts: number;
};

export function MaterialesTable({ products, totalProducts}: MaterialesTableProps) {
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
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(product.cod_prov)}`}>{displayCellValue(product.cod_prov)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.proveedor)}`}>{displayCellValue(product.proveedor)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.cod_producto)}`}>{displayCellValue(product.cod_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_de_producto)}`}>{displayCellValue(product.tipo_de_producto)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.marca)}`}>{displayCellValue(product.marca)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.descripcion)}`}>{displayCellValue(product.descripcion)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.parte_electrica)}`}>{displayCellValue(product.parte_electrica)}</td>
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
                Mostrando {products.length} de {totalProducts} materiales
            </p>
        </section>
    );
}