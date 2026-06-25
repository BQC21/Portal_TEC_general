"use client";

import { useState } from "react";

import type {
    ZoneFormState,
} from "@/lib/types/supabase/zone-types";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";

import { TABLE_HEADERS_ZONE } from "@/lib/utils/headers";

import { createZoneFormStateFromZone } from "@/lib/mapping/zone_mapping"; 
import { EditZoneModalProps } from "@/lib/types/components/modals";

export default function EditZoneModal({ existingZone, onUpdateZone, onClose }: EditZoneModalProps) {
    const [form_zone, setForm_zone] = useState<ZoneFormState>(() => createZoneFormStateFromZone(existingZone));;
    
    function updateField<K extends keyof ZoneFormState>(field: K, value: ZoneFormState[K]) {
        setForm_zone((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onUpdateZone({ ...form_zone });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar Zona</h2>
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
                        </section>
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[3]}
                                required
                                placeholder=" "
                                value={form_zone.ghi_respaldo}
                                onChange={(value) => updateField("ghi_respaldo", value)}
                            />
                                <AddProductTextField
                                label={TABLE_HEADERS_ZONE[4]}
                                required
                                placeholder=" "
                                value={form_zone.ghi_respaldo_diario}
                                onChange={(value) => updateField("ghi_respaldo_diario", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[5]}
                                required
                                placeholder=" "
                                value={form_zone.gti_respaldo}
                                onChange={(value) => updateField("gti_respaldo", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[6]}
                                required
                                placeholder=" "
                                value={form_zone.gti_respaldo_diario}
                                onChange={(value) => updateField("gti_respaldo_diario", value)}
                            />
                            <AddProductTextField
                                label={TABLE_HEADERS_ZONE[7]}
                                required
                                placeholder=" "
                                value={String(form_zone.hsp_peor_mes)}
                                onChange={(value) => updateField("hsp_peor_mes", value)}
                            />
                        </section>
                    </div>
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800">Actualizar Zona</button>
                    </div>
                </form>
            </div>
        </div>
    );
}