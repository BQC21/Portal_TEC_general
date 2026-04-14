"use client";

import { DeleteProductModal } from "@/features/components/Modals/DeleteProductModal";
import { TrashIcon } from "@/features/components/Icons/TrashIcon";
import { useState } from "react";
import { Product } from "@/features/types/product-types";

type DeleteProductModalProps = {
    product: Product;
    onDeleteProduct: (productId: string) => void;
};

export function Button2Trash({ product, onDeleteProduct }: DeleteProductModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
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