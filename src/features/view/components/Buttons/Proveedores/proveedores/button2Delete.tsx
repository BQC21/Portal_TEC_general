"use client";

import { DeleteSupplierModalProps } from "@/lib/types/components/buttons";
import { useState } from "react";
import { TrashIcon } from "../../../Icons/TrashIcon";
import { DeleteSupplierModal } from "../../../Modals/Proveedores/proveedores/DeleteSupplierModal";

export function Button2Trash_Supplier({ supplier, onDeleteSupplier }: DeleteSupplierModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar proveedor"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteSupplierModal
                supplier={supplier}
                onDeleteSupplier={(supplierId: string) => {
                    onDeleteSupplier(supplierId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}