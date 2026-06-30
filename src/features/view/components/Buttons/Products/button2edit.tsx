"use client";

import { EditProductModal } from "@/features/view/components/Modals/Products/EditProductModal";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import type { Product } from "@/lib/types/supabase/product-types";
import { useState } from "react";
import { EditProductModalProps } from "@/lib/types/components/buttons";

export function Button2Edit({ product, exchangeRate, onUpdateProduct }: EditProductModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-brand-500"
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