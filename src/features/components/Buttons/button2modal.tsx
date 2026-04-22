"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/components/Icons/PlusIcon";
import { AddProductModal } from "@/features/components/Modals/AddProductModal";
import type { Product, ProductFormData } from "@/lib/types/product-types";

type Button2ModalProps = {
    exchangeRate: number;
    existingProducts: Product[];
    onAddProduct: (product: ProductFormData) => void;
};

export default function Button2Modal({ exchangeRate, existingProducts, onAddProduct }: Button2ModalProps) {
    const [open, setOpen] = useState(false);

    return (
    <div>
        <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            <PlusIcon />
            <span>Añadir Producto</span>
        </button>

        {open && (
            <AddProductModal
                exchangeRate={exchangeRate}
                existingProducts={existingProducts}
                onAddProduct={async (product) => {
                    await onAddProduct(product);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
    </div>
    );
}