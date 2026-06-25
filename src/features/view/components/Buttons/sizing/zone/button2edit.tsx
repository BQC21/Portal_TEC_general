"use client";

import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import EditZoneModal  from "@/features/view/components/Modals/sizing/zone/EditZoneModal";
import type { Zone, ZoneFormData } from "@/lib/types/supabase/zone-types";
import { EditZoneModalProps } from "@/lib/types/components/buttons";

export default function Button2Edit({ zone, onUpdateZone }: EditZoneModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                <EditIcon />
                <span>Actualizar Zona</span> 
            </button>
            
            {open && (
                <EditZoneModal
                    existingZone={zone}
                    onUpdateZone={async function (formData: ZoneFormData) {
                        const updatedZone: Zone = { ...zone, ...formData };
                        await onUpdateZone(updatedZone);
                        setOpen(false);
                    }}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}