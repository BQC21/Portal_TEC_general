"use client";

import { useState } from "react";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import AddZoneModal  from "@/features/view/components/Modals/sizing/zone/AddZoneModal";
import type { ZoneFormData } from "@/lib/types/zone-types";

type Button2ModalProps = {
    onAddZone: (zone: ZoneFormData) => void;
};

export default function Button2Modal_zone({ onAddZone }: Button2ModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <PlusIcon />
                <span>Añadir Zona</span> 
            </button>
            
            {open && (
                <AddZoneModal
                    onAddZone={async (zone: ZoneFormData) => {
                        await onAddZone(zone);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}