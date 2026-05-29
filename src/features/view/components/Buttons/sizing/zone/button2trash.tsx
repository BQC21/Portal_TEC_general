"use client";

import { DeleteZoneModal } from "@/features/view/components/Modals/sizing/zone/DeleteZoneModal";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { useState } from "react";
import { Zone } from "@/lib/types/zone-types";

type DeleteZoneModalProps = {
    zone: Zone;
    onDeleteZone: (zoneId: string) => void;
};

export function Button2Trash({ zone, onDeleteZone }: DeleteZoneModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="table-icon-button text-indigo-600"
            title="Eliminar zona"
        >
            <TrashIcon />
        </button>

        {open && (
            <DeleteZoneModal
                zone={zone}
                onDeleteZone={(zoneId: string) => {
                    onDeleteZone(zoneId);
                    setOpen(false);
                }}
                onClose={() => setOpen(false)}
            />
        )}
        </>
    );
}