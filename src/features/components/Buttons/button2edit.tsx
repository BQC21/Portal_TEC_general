"use client";

import { EditProductModal } from "@/features/components/Modals/EditProductModal";
import { EditIcon } from "@/features/components/Icons/EditIcon";
import type { Product } from "@/lib/types/product-types";
import { useState } from "react";

type EditProductModalProps = {
    product: Product;
    exchangeRate: number;
    onUpdateProduct: (product: Product) => void;
};

export function Button2Edit({ product, exchangeRate, onUpdateProduct }: EditProductModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Editar producto"
        >
            <EditIcon />
        </button>

        {open && (
            <EditProductModal
                product={product}
                exchangeRate={exchangeRate}
                onUpdateProduct={(product) => {
                    onUpdateProduct(product);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}