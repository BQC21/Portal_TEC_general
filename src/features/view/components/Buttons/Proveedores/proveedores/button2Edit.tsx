"use client";

import { EditSupplierModalProps } from "@/lib/types/components/buttons";
import { useState } from "react";
import { EditIcon } from "../../../Icons/EditIcon";
import { Supplier, SupplierFormData } from "@/lib/types/supabase/supplier-types";
import EditSupplierModal from "../../../Modals/Proveedores/proveedores/EditSupplierModal";

export default function Button2Edit_Supplier({ supplier, onUpdateSupplier }: EditSupplierModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Actualizar Proveedor</span> 
            </button>
            
            {open && (
                <EditSupplierModal
                    existingSupplier={supplier}
                    onUpdateSupplier={async function (formData: SupplierFormData) {
                        const updatedSupplier: Supplier = { ...supplier, ...formData };
                        await onUpdateSupplier(updatedSupplier);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}