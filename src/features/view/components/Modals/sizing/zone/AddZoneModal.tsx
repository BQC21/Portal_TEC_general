"use client";

import { useState } from "react";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type { 
    ZoneFormState,
    ZoneFormData,
} from "@/lib/types/zone-types"; 

import { AddProductTextField } from "@/features/view/components//Form_fields/AddTextField"; // campos

import { INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";
import { TABLE_HEADERS_ZONE } from "@/lib/utils/headers";

import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";

// --- Tipo de variables ---
type AddZoneModalProps = {
    onAddZone: (zone: ZoneFormData) => void;
    onClose: () => void;
};

export default function AddZoneModal({ onAddZone, onClose }: AddZoneModalProps) {
    const { zones } = useZone(); // obtener la lista de zonas

    const [form_zone, setForm_zone] = useState<ZoneFormState>(INITIAL_ZONE_FORM);

    function updateField<K extends keyof ZoneFormState>(field: K, value: ZoneFormState[K]) {
        setForm_zone((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddZone({
            ...form_zone,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nueva Zona</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            {/* Nombre de la zona */}
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[0]}
                                required
                                placeholder=" "
                                value={form_zone.zona}
                                onChange={(value) => updateField("zona", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[1]}
                                required
                                placeholder=" "
                                value={form_zone.latitude}
                                onChange={(value) => updateField("latitude", value)}
                            />                           
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[2]}
                                required
                                placeholder=" "
                                value={form_zone.longitude}
                                onChange={(value) => updateField("longitude", value)}
                            />                            
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[3]}
                                required
                                placeholder=" "
                                value={form_zone.ghi_respaldo}
                                onChange={(value) => updateField("ghi_respaldo", value)}
                            />
                        </section>
                    </div>
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                        type="submit"
                        className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800"
                        >
                            Añadir Zona
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}