"use client";

import { useState } from "react";
import { PlusIcon } from "../../../Icons/PlusIcon";
import { Button2ModalPropsBrand } from "@/lib/types/components/buttons";
import { BrandFormData } from "@/lib/types/supabase/brand.types";
import AddBrandModal from "../../../Modals/Proveedores/marcas/AddBrandModal";

export default function Button2Modal_brand({ onAddBrand }: Button2ModalPropsBrand) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Marca</span> 
            </button>
            
            {open && (
                <AddBrandModal
                    onAddBrand={async (brand: BrandFormData) => {
                        await onAddBrand(brand);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}