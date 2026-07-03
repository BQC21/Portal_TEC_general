"use client";

import { EditBrandModalProps } from "@/lib/types/components/buttons";
import { useState } from "react";
import { EditIcon } from "../../../Icons/EditIcon";
import { Brand, BrandFormData } from "@/lib/types/supabase/brand.types";
import EditBrandModal from "../../../Modals/Proveedores/marcas/EditBrandModal";

export default function Button2Edit_Brand({ brand, onUpdateBrand }: EditBrandModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Actualizar Marca</span> 
            </button>
            
            {open && (
                <EditBrandModal
                    existingBrand={brand}
                    onUpdateBrand={async function (formData: BrandFormData) {
                        const updatedBrand: Brand = { ...brand, ...formData };
                        await onUpdateBrand(updatedBrand);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}