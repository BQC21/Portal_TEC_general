"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/components/Icons/PlusIcon";
import { AddMassiveProductModal } from "@/features/components/Modals/AddMassiveProductModal";
import type { ProductFormData } from "@/lib/types/product-types";

type Button2MassiveUploadProps = {
    onMassiveAddProduct: (products: ProductFormData[]) => Promise<void>;
    isMassiveUploading?: boolean;
};

export default function Button2MassiveUpload({
    onMassiveAddProduct,
    isMassiveUploading = false,
}: Button2MassiveUploadProps) {
    const [open, setOpen] = useState(false);

    return (
    <div>
        <button
            onClick={() => setOpen(true)}
            disabled={isMassiveUploading}
            className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <PlusIcon />
            <span>Subida masiva</span>
        </button>

        {open && (
            <AddMassiveProductModal
                onMassiveAddProduct={async (products) => {
                    await onMassiveAddProduct(products);
                    setOpen(false);
                }}
                isMassiveUploading={isMassiveUploading}
                onClose={() => setOpen(false)}
            />
        )}
    </div>
    );
}