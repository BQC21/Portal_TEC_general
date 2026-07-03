import { MarcasTableProps } from "@/lib/types/components/tables";
import { TABLE_HEADERS_BRAND } from "@/lib/utils/headers";
import Button2Edit_Brand from "../../Buttons/Proveedores/marcas/button2Edit";
import { Button2Trash_Brand } from "../../Buttons/Proveedores/marcas/button2Delete";

export default function BrandTable({ brand, 
    totalBrand, 
    onUpdateBrand, 
    onDeleteBrand }: MarcasTableProps) {
    
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_BRAND.map((header) => (
                                <th
                                    key={header}
                                    className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"
                                >
                                    {header}
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {brand.length > 0 ? (
                                brand.map((brand) => (
                                    <tr key={brand.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{brand.nombre}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{brand.categoria}</td>
            
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit_Brand
                                                    brand={brand}
                                                    onUpdateBrand={onUpdateBrand}
                                                />
                                                <Button2Trash_Brand
                                                    brand={brand}
                                                    onDeleteBrand={() => onDeleteBrand(String(brand.id))}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_BRAND.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay marcas registradas todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalBrand} marcas
            </p>
        </section>
    )
}