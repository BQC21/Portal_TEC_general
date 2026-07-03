import { ProveedoresTableProps } from "@/lib/types/components/tables";
import { TABLE_HEADERS_SUPPLIER } from "@/lib/utils/headers";
import Button2Edit_Supplier from "../../Buttons/Proveedores/proveedores/button2Edit";
import { Button2Trash_Supplier } from "../../Buttons/Proveedores/proveedores/button2Delete";

export default function SupplierTable({ supplier, 
    totalSupplier, 
    onUpdateSupplier, 
    onDeleteSupplier }: ProveedoresTableProps) {
    
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_SUPPLIER.map((header) => (
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
                            {supplier.length > 0 ? (
                                supplier.map((supplier) => (
                                    <tr key={supplier.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.nombre}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.codigo}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.ruc}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.contacto}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.telefono}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{supplier.categoria}</td>
            
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit_Supplier
                                                    supplier={supplier}
                                                    onUpdateSupplier={onUpdateSupplier}
                                                />
                                                <Button2Trash_Supplier
                                                    supplier={supplier}
                                                    onDeleteSupplier={() => onDeleteSupplier(String(supplier.id))}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_SUPPLIER.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay proveedores registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalSupplier} proveedores
            </p>
        </section>
    )
}