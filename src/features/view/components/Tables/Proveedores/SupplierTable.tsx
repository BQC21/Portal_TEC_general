import { ProveedoresTableProps } from "@/lib/types/components/General/tables";
import { TABLE_HEADERS_SUPPLIER } from "@/lib/utils/headers";
import Button2Edit from "../../Buttons/shared/button2Edit";
import { Button2Delete } from "../../Buttons/shared/button2Delete";
import EditSupplierModal from "../../Modals/Proveedores/proveedores/EditSupplierModal";
import { DeleteSupplierModal } from "../../Modals/Proveedores/proveedores/DeleteSupplierModal";
import { Supplier } from "@/lib/types/supabase/supplier-types";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { DATE_CELL_CLASS, getDateHeaderClass } from "@/lib/utils/helpers/render/tableDateColumn";

export default function SupplierTable({ supplier, 
    totalSupplier, 
    onUpdateSupplier, 
    onDeleteSupplier }: ProveedoresTableProps) {
    
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto !max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_SUPPLIER.map((header) => (
                                <th
                                    key={header}
                                    className={`border border-slate-200 px-4 py-4 text-[1.02rem] font-bold ${getDateHeaderClass(header)}`}
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
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${DATE_CELL_CLASS}`}>{formatDate(supplier.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${DATE_CELL_CLASS}`}>{formatDate(supplier.updated_at)}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit title="Actualizar proveedor" label="Actualizar Proveedor">
                                                    {(close) => (
                                                        <EditSupplierModal
                                                            existingSupplier={supplier}
                                                            onUpdateSupplier={async (formData) => {
                                                                const updatedSupplier: Supplier = { ...supplier, ...formData };
                                                                await onUpdateSupplier(updatedSupplier);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Edit>
                                                <Button2Delete title="Eliminar proveedor">
                                                    {(close) => (
                                                        <DeleteSupplierModal
                                                            supplier={supplier}
                                                            onDeleteSupplier={(supplierId) => {
                                                                onDeleteSupplier(supplierId);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Delete>
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