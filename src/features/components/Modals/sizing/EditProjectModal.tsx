"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "../../Icons/AddProductCloseIcon";

import type {
    Project,
    ProjectFormState,
    ProjectFormData,
} from "@/lib/types/project-types";

import type { ZoneFormState } from "@/lib/types/zone-types";

import { AddProductSelectField } from "@/features/components/Form_fields/AddProductSelectField";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField";
import { AddProductTextAreaField } from "../../Form_fields/AddProductTextAreaField";

import { INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";
import { NAME_ZONES_OPTIONS, STATUS_PROJECT_OPTIONS } from "@/lib/utils/options";

import { createProjectFormStateFromProject } from "@/features/mapping/project_mapping";
import { useConverterNREL } from "@/features/hooks/api/useConverterNREL";
import { useZone } from "@/features/hooks/useRealtimeZones";

type EditProjectModalProps = {
    existingProject: Project;
    onUpdateProject: (project: ProjectFormData) => void;
    onClose: () => void;
};

export default function EditProjectModal({ existingProject, onUpdateProject, onClose }: EditProjectModalProps) {
    const { zones } = useZone();

    const [form, setForm] = useState<ProjectFormState>(() => createProjectFormStateFromProject(existingProject));
    const [form_zone, setForm_zone] = useState<ZoneFormState>(() =>
        existingProject.zona_info
            ? {
                zona: existingProject.zona_info.zona,
                latitude: existingProject.zona_info.latitude,
                longitude: existingProject.zona_info.longitude,
                ghi_respaldo: existingProject.zona_info.ghi_respaldo,
                created_at: existingProject.zona_info.created_at,
                updated_at: existingProject.zona_info.updated_at,
            }
            : INITIAL_ZONE_FORM // en caso no haya zona existente o no tenga zona_info
    );

    const selectedZone = form_zone.zona;

    const { ghi_nrel, loading: nrelLoading, error: nrelError } = useConverterNREL({
        latitude: form_zone.latitude ?? "",
        longitude: form_zone.longitude ?? "",
    });

    const nrelValue = (val: number | null) => {
        if (nrelError) return `Error: ${nrelError}`;
        if (nrelLoading) return "Cargando...";
        if (val !== null) return `${val}`;
        return "Sin datos";
    };

    const useFallbackData = Boolean(nrelError) && ghi_nrel === null;

    function updateField<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onUpdateProject({ ...form });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Editar Proyecto</h2>
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
                            <AddProductTextAreaField
                                label="Nombre del proyecto"
                                required
                                placeholder=" "
                                value={form.nombre}
                                onChange={(value) => updateField("nombre", value)}
                            />

                            <AddProductTextAreaField
                                label="Descripción del proyecto"
                                required
                                placeholder=" "
                                value={form.descripcion}
                                onChange={(value) => updateField("descripcion", value)}
                            />

                            <AddProductSelectField
                                label="Zona"
                                required
                                value={form_zone.zona ?? ""}
                                options={["Seleccione zona", ...(zones.length > 0 ? zones.map((p) => p.zona) : NAME_ZONES_OPTIONS)]}
                                onChange={(value) => {
                                    if (value === "Seleccione zona") {
                                        setForm_zone(INITIAL_ZONE_FORM);
                                        updateField("zona_id", "");
                                        updateField("zona_info", undefined);
                                        updateField("hsp", "");
                                        updateField("ghi", "");
                                        return;
                                    }
                                    const selected = zones.find((zone) => zone.zona === value);
                                    if (selected) {
                                        setForm_zone({
                                            zona: selected.zona,
                                            latitude: selected.latitude,
                                            longitude: selected.longitude,
                                            ghi_respaldo: selected.ghi_respaldo,
                                            created_at: selected.created_at,
                                            updated_at: selected.updated_at,
                                        });
                                        updateField("zona_id", selected.id);
                                        updateField("zona_info", selected);
                                    }
                                }}
                            />

                            {selectedZone && (
                                <>
                                    <span>
                                        <AddProductReadonlyField 
                                            label="Latitud de la zona" value={form_zone.latitude ?? "---"} />
                                    </span>
                                    <span>
                                        <AddProductReadonlyField 
                                        label="Longitud de la zona" value={form_zone.longitude ?? "---"} />
                                    </span>
                                    {!useFallbackData ? (
                                        <span>
                                            <AddProductReadonlyField label="GHI (NREL) - kWh/m²/año" value={nrelValue(ghi_nrel)} />
                                        </span>
                                    ) : (
                                        <>
                                            <p className="text-sm text-yellow-600">
                                                En caso haya problemas con la API, los datos han sido registrados según Global Solar ATLAS.
                                            </p>
                                            <span>
                                                <AddProductReadonlyField label="GHI anual de la zona" value={form_zone.ghi_respaldo ?? "---"} />
                                            </span>
                                        </>
                                    )}
                                </>
                            )}

                            <AddProductSelectField label="Estado del proyecto" required value={form.estado_proyecto} options={STATUS_PROJECT_OPTIONS} onChange={(value) => updateField("estado_proyecto", value)} />
                        </section>
                    </div>

                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800">Actualizar Proyecto</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
