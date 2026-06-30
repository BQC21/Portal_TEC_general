"use client";

import { DeleteProductModal } from "@/features/view/components/Modals/Products/DeleteProductModal";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { DeleteProductModalProps } from "@/lib/types/components/buttons";

export function Button2Trash({ product, onDeleteProduct }: DeleteProductModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
            title="Eliminar producto"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteProductModal
                product={product}
                onDeleteProduct={(productId) => {
                    onDeleteProduct(productId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}