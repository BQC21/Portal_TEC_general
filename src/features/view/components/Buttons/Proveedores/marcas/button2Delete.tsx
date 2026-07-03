"use client";

import { useState } from "react";
import { TrashIcon } from "../../../Icons/TrashIcon";
import { DeleteBrandModalProps } from "@/lib/types/components/buttons";
import { DeleteBrandModal } from "../../../Modals/Proveedores/marcas/DeleteBrandModal";

export function Button2Trash_Brand({ brand, onDeleteBrand }: DeleteBrandModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar marca"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteBrandModal
                brand={brand}
                onDeleteBrand={(brandId: string) => {
                    onDeleteBrand(brandId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}