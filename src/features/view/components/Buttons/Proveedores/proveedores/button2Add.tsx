"use client";

import { Button2ModalPropsSupplier } from "@/lib/types/components/buttons";
import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import { SupplierFormData } from "@/lib/types/supabase/supplier-types";
import AddSupplierModal from "../../../Modals/Proveedores/proveedores/AddSupplierModal";

export default function Button2Modal_supplier({ onAddSupplier }: Button2ModalPropsSupplier) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Proveedor</span> 
            </button>
            
            {open && (
                <AddSupplierModal
                    onAddSupplier={async (supplier: SupplierFormData) => {
                        await onAddSupplier(supplier);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}