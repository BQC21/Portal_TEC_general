"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { AddProductModal } from "@/features/view/components/Modals/Products/AddProductModal";
import { Button2ModalPropsProducto } from "@/lib/types/components/buttons";

export default function Button2Modal({ exchangeRate, existingProducts, onAddProduct }: Button2ModalPropsProducto) {
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