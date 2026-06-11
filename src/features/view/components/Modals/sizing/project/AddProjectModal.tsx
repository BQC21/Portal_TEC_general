"use client";

import { useState, useMemo } from "react";

import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";

import type {
    ProjectFormState,
    ProjectFormData,
} from "@/lib/types/project-types";

import type {
    ZoneFormState,
} from "@/lib/types/zone-types"; // Tipados

import type { Equipos } from "@/lib/types/equipos-types";

import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextAreaField } from "@/features/view/components//Form_fields/AddTextAreaField"; // campos

import { INITIAL_PROJECT_FORM, INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";

import { CONNECTION_TYPE_OPTIONS, INSTALL_TYPE_OPTIONS } from "@/lib/utils/options"; // opciones
import { STATUS_PROJECT_OPTIONS } from "@/lib/utils/options";

// import { useConverterSolarcast } from "@/features/hooks/api/useConverterSolarcast";
// import { useConverterNasa } from "@/features/hooks/api/useConverterNasa";
import { useConverterNREL } from "@/features/view/hooks/api/useConverterNREL"
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";

import {
    computeEnergy,
    compute_DC_Power,
    compute_AC_Power,
    min_strings,
    max_strings,
    ITM_DC_MIN,
    ITM_AC_MIN,
    SPD_MIN
} from "@/lib/utils/helpers/computes/energy_requirements"

import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";

export type SelectedEquipmentItem = {
    row: string;
    id: string;
    description: string;
    potencia_maxima: number;
    mppt: number;
    potencia_ac: number;
    voc_vmax: number;
    vmpp_vmin: number;
    isc_i_out: number;
    impp_i_in: string;
};

export type SelectedMaterialItem = {
    row: string;
    id: string;
    description: string;
};

// --- Tipo de variables ---
type AddModalProps = {
    onAddProject: (
        project: ProjectFormData,
        selectedEquipos: SelectedEquipmentItem[],
        selectedMateriales: SelectedMaterialItem[],
    ) => Promise<void> | void;
    onClose: () => void;
};

export default function AddProjectModal({ onAddProject, onClose }: AddModalProps) {

    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    // usar información de la tabla
    const { zones } = useZone();
    const { equipos } = useEquipos();
    const { materiales } = useMateriales();

    // valores iniciales
    const [form, setForm] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
    const [form_zone, setForm_zone] = useState<ZoneFormState>(INITIAL_ZONE_FORM);

    // datos seleccionados
    const [selectedMaterialByRow, setSelectedMaterialByRow] = useState<Record<string, string>>({});
    const [selectedEquipmentByRow, setSelectedEquipmentByRow] = useState<Record<string, string>>({});
    const [selectedEquipmentTable, setSelectedEquipmentTable] = useState<SelectedEquipmentItem[]>([]);
    const [selectedMaterialTable, setSelectedMaterialTable] = useState<SelectedMaterialItem[]>([]);

    const selectedZone = form_zone.zona;

    // ----------------------------
    // ------- NREL API -----
    // ----------------------------
    const { ghi_nrel,
        // hsp,
        loading: NRELloading, error: NRELerror } = useConverterNREL({
        latitude:  form_zone.latitude ?? "",
        longitude: form_zone.longitude ?? "",
    })
    console.log("Datos de radiación obtenidos de NREL API:", { ghi_nrel, NRELloading, NRELerror });

    // Helper para el valor de un campo NREL
    const nrelValue = (val: number | null) => {
        if (NRELerror)       return `Error: ${NRELerror}`;
        if (NRELloading)     return "Cargando...";

        if (val !== null)    return `${val}`;
        return "Sin datos";
    };


    // ----------------------------------------
    // ------- Cálculos de requerimientos -----
    // ----------------------------------------

    const computedRequirements = useMemo(() => {

        const ghi = form.ghi ? Number(form.ghi) : form_zone.ghi_respaldo ? Number(form_zone.ghi_respaldo) : null;
        const selectedEquipment = selectedEquipmentTable.find((item) => item.row === "MÓDULO FV");
        const selectedInverter = selectedEquipmentTable.find((item) => item.row === "INVERSOR");

        console.log(selectedEquipment?.voc_vmax)

        const energia = String(computeEnergy(Number(form.demanda_electrica), Number(form.cobertura_porcentaje)));
        const potenciaDC = String(compute_DC_Power(Number(energia), Number(ghi), Number(form.rendimiento_modulo_porcentaje)));
        const potenciaAC = String(compute_AC_Power(Number(potenciaDC)));
        // calcular strings mínimo a partir de potencia DC requerida y potencia de módulo seleccionado 
        const strings_minimos = String(min_strings(Number(potenciaDC), 
                                    Number(selectedEquipment?.potencia_maxima ?? 0)));
        const strings_maximos = String(max_strings(Number(selectedInverter?.potencia_maxima ?? 0), 
                                    Number(selectedEquipment?.potencia_maxima ?? 0)));
        // calcular protecciones
        const itm_ac_min = String(ITM_AC_MIN(Number(selectedEquipment?.isc_i_out ?? 0)))
        const itm_dc_min = String(ITM_DC_MIN(Number(selectedInverter?.isc_i_out ?? 0)))
        const spd_min = String(SPD_MIN(Number(form.strings), Number(selectedEquipment?.voc_vmax ?? 0), Number(form.mppt_number)))

        return { energia, potenciaDC, potenciaAC, strings_minimos, strings_maximos, itm_ac_min, itm_dc_min, spd_min };
    }, [form.demanda_electrica, 
        form.cobertura_porcentaje, 
        form.ghi,
        form.rendimiento_modulo_porcentaje, 
        form.mppt_number,
        form.strings,
        form_zone.ghi_respaldo,
        selectedEquipmentTable,
    ]);
    console.log(form.strings)
    console.log(form.mppt_number)

    function updateField<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onAddProject({
            ...form,
        }, selectedEquipmentTable, selectedMaterialTable);
    }

    // --------------------------------------------------
    // ------- SELECTOR DE FILAS ------------------------
    // --------------------------------------------------

    const selectionRowStyles = "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_auto] lg:items-end";
    const actionButtonStyles = "shrink-0 whitespace-nowrap rounded-xl border border-slate-300 px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50";

    type SelectionRowProps = {
        label: string;
        buttonLabel: string;
        value: string;
        options: string[];
        onChange: (value: string) => void;
        onClick?: () => void;
    };

    function SelectionRow({ label, buttonLabel, value, options, onChange, onClick }: SelectionRowProps) {
        return (
            <div className={selectionRowStyles}>
                <div className="min-w-0">
                    <AddProductSelectField
                        label={label}
                        required
                        value={value}
                        options={options}
                        onChange={onChange}
                            />
                </div>
                <button type="button" className={actionButtonStyles} onClick={onClick}>
                    {buttonLabel}
                </button>
            </div>
        );
    }

    const equipmentRows = [
        "ACCESORIO",
        "BATERÍA",
        "ESTRUCTURA",
        "INVERSOR",
        "MÓDULO FV",
    ];

    const materialRows = [
        "CABLE",
        "PROTECCIÓN",
        "MC4",
        "CANALIZACIÓN",
        "CONSUMIBLE",
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Proyecto</h2>
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
                                label="Estado del proyecto"
                                required
                                value={form.estado_proyecto}
                                options={STATUS_PROJECT_OPTIONS}
                                onChange={(value) => updateField("estado_proyecto", value)}
                            />
                            <AddProductSelectField
                                label="Tipo de instalación"
                                required
                                value={form.tipo_instalacion}
                                options={INSTALL_TYPE_OPTIONS}
                                onChange={(value) => updateField("tipo_instalacion", value)}
                            />
                            <AddProductTextAreaField
                                label="Enlace al proyecto"
                                placeholder=" "
                                value={form.enlace}
                                onChange={(value) => updateField("enlace", value)}
                            />
                        </section>
                    </div>
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <AddProductSelectField
                                label="Zona"
                                required
                                value={form_zone.zona ?? ""}
                                options={["Seleccione zona", ...zones.map((zone) => zone.zona)]}
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
                                            ghi_respaldo_diario: selected.ghi_respaldo_diario,
                                            gti_respaldo: selected.gti_respaldo,
                                            gti_respaldo_diario: selected.gti_respaldo_diario,
                                            hsp_peor_mes: selected.hsp_peor_mes,
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
                                            label="Latitud de la zona"
                                            value={form_zone.latitude ?? "---"}
                                        />
                                    </span>
                                    <span>
                                        <AddProductReadonlyField
                                            label="Longitud de la zona"
                                            value={form_zone.longitude ?? "---"}
                                        />
                                    </span>
                                    {!NRELerror && ghi_nrel !== null ? (
                                        <span>
                                            <AddProductReadonlyField
                                                label="GHI (NREL) - kWh/m²/año"
                                                value={nrelValue(ghi_nrel)}
                                            />
                                        </span>
                                    ) : (
                                        <>
                                            <span>
                                                <AddProductReadonlyField
                                                    label="GHI anual de la zona"
                                                    value={form_zone.ghi_respaldo ?? "---"}
                                                />
                                            </span>
                                            <p className="w-50 text-sm text-yellow-600">
                                                En caso haya problemas con la API, los datos han sido registrados según Global Solar ATLAS.
                                            </p>
                                        </>
                                    )}
                                </>
                            )}
                        </section>
                    </div>

                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="grid grid-cols-1 gap-40 md:grid-cols-[minmax(0,1.0fr)_minmax(0,2.0fr)]">
                                <div>
                                    <h2 className="mb-10 text-2xl font-bold text-slate-900">Requerimientos técnicos</h2>
                                    <AddProductNumberField
                                        label="Demanda eléctrica anual (kWh)"
                                        required
                                        value={Number(form.demanda_electrica) > 0 ? Number(form.demanda_electrica) : ""}
                                        onChange={(value) => updateField("demanda_electrica", String(value))}
                                    />
                                    <AddProductSelectField
                                        label="Configuración"
                                        required
                                        value={form.configuracion}
                                        options={CONNECTION_TYPE_OPTIONS}
                                        onChange={(value) => updateField("configuracion", value)}
                                    />
                                    <AddProductNumberField
                                        label="Porcentaje de cobertura (%)"
                                        required
                                        value={Number(form.cobertura_porcentaje) > 0 ? Number(form.cobertura_porcentaje) : ""}
                                        onChange={(value) => updateField("cobertura_porcentaje", String(value))}
                                    />
                                    <AddProductNumberField
                                        label="Porcentaje de rendimiento del módulo (%)"
                                        required
                                        value={Number(form.rendimiento_modulo_porcentaje) > 0 ? Number(form.rendimiento_modulo_porcentaje) : ""}
                                        onChange={(value) => updateField("rendimiento_modulo_porcentaje", String(value))}
                                    />
                                    <AddProductReadonlyField
                                        label="Energía requerida"
                                        value={computedRequirements.energia}
                                    />
                                    <AddProductReadonlyField
                                        label="Potencia DC requerida (KW)"
                                        value={String(Number(computedRequirements.potenciaDC).toFixed(2))}
                                    />
                                    <AddProductReadonlyField
                                        label="Potencia AC requerida (KW)"
                                        value={String(Number(computedRequirements.potenciaAC).toFixed(2))}
                                    />
                                    <AddProductReadonlyField
                                        label="Mínimo de Strings"
                                        value={String(Number(computedRequirements.strings_minimos).toFixed(0))}
                                    />
                                    <AddProductReadonlyField
                                        label="Máximo de Strings"
                                        value={String(Number(computedRequirements.strings_maximos).toFixed(0))}
                                    />
                                    <AddProductNumberField
                                        label="Número exacto de Strings"
                                        required
                                        value={Number(form.strings) > 0 ? Number(form.strings) : ""}
                                        onChange={(value) => updateField("strings", String(value))}
                                    />
                                    <AddProductReadonlyField
                                        label="Protección ITM AC mínima"
                                        value={String(Number(computedRequirements.itm_ac_min).toFixed(0))}
                                    />
                                    <AddProductReadonlyField
                                        label="Protección ITM DC mínima"
                                        value={String(Number(computedRequirements.itm_dc_min).toFixed(0))}
                                    />
                                    <AddProductNumberField
                                        label="Número de MPPTs a usarse"
                                        required
                                        value={Number(form.mppt_number) > 0 ? Number(form.mppt_number) : ""}
                                        onChange={(value) => updateField("mppt_number", String(value))}
                                    />
                                    <AddProductReadonlyField
                                        label="Protección SPD"
                                        value={String(Number(computedRequirements.spd_min).toFixed(0))}
                                    />
                                </div>

                                <div>
                                    <h2 className="mb-10 text-2xl font-bold text-slate-900">Selección de equipos</h2>
                                    <div className="flex flex-col gap-4">
                                        {equipmentRows.map((label, index) => (
                                            <SelectionRow
                                                key={`equipment-${index}`}
                                                label={label}
                                                buttonLabel="Agregar"
                                                value={selectedEquipmentByRow[label] || `Seleccionar - ${label}`}
                                                options={[
                                                    `Seleccionar - ${label}`,
                                                    ...equipos
                                                        .map((equipo) => (equipo.tipo_de_producto === label ? equipo.descripcion : null))
                                                        .filter((descripcion): descripcion is string => Boolean(descripcion)),
                                                ]}
                                                onChange={(value) => {
                                                    if (value === `Seleccionar - ${label}`) {
                                                        setSelectedEquipmentByRow((current) => ({
                                                            ...current,
                                                            [label]: "",
                                                        }));
                                                        setSelectedEquipmentTable((current) =>
                                                            current.filter((item) => item.row !== label),
                                                        );
                                                        return;
                                                    }

                                                    setSelectedEquipmentByRow((current) => ({
                                                        ...current,
                                                        [label]: value,
                                                    }));
                                                }}
                                                onClick={() => {
                                                    const descripcion = selectedEquipmentByRow[label];
                                                    if (!descripcion || descripcion === `Seleccionar - ${label}`) {
                                                        return;
                                                    }

                                                    const selected = equipos.find((equipo) =>
                                                        equipo.tipo_de_producto === label &&
                                                        equipo.descripcion === descripcion,
                                                    );

                                                    if (!selected) {
                                                        return;
                                                    }

                                                    setSelectedEquipmentTable((current) => {
                                                        const next = current.filter((item) => item.row !== label);
                                                        return [...next, {
                                                            row: label,
                                                            id: String(selected.id),
                                                            description: selected.descripcion ?? "",
                                                            potencia_maxima: selected.potencia_maxima ?? 0,
                                                            mppt: selected.mppt ?? 0,
                                                            potencia_ac: selected.potencia_ac ?? 0,
                                                            voc_vmax: selected.voc_vmax ?? 0,
                                                            vmpp_vmin: selected.vmpp_vmin ?? 0,
                                                            isc_i_out: selected.isc_i_out ?? 0,
                                                            impp_i_in: selected.impp_i_in ?? "",
                                                        }];
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Selección de materiales</h2>
                                    <div className="flex flex-col gap-4">
                                        {materialRows.map((label, index) => (
                                            <SelectionRow
                                                key={`material-${index}`}
                                                label={label}
                                                buttonLabel="Agregar"
                                                value={selectedMaterialByRow[label] || `Seleccionar - ${label}`}
                                                options={[
                                                    `Seleccionar - ${label}`,
                                                    ...materiales
                                                        .map((material) =>
                                                            material.tipo_de_producto === label ? material.descripcion : null,
                                                        )
                                                        .filter((descripcion): descripcion is string => Boolean(descripcion)),
                                                ]}
                                                onChange={(value) => {
                                                    if (value === `Seleccionar - ${label}`) {
                                                        setSelectedMaterialByRow((current) => ({
                                                            ...current,
                                                            [label]: "",
                                                        }));
                                                        setSelectedMaterialTable((current) => current.filter((item) => item.row !== label));
                                                        return;
                                                    }
                                                    setSelectedMaterialByRow((current) => ({
                                                        ...current,
                                                        [label]: value,
                                                    }));
                                                }}
                                                onClick={() => {
                                                    const descripcion = selectedMaterialByRow[label];
                                                    const selected = materiales.find((material) =>
                                                        material.tipo_de_producto === label && material.descripcion === descripcion
                                                    );

                                                    if (!selected || !descripcion || descripcion === `Seleccionar - ${label}`) {
                                                        return;
                                                    }

                                                    setSelectedMaterialTable((current) => {
                                                        const next = current.filter((item) => item.row !== label);
                                                        return [...next, {
                                                            row: label,
                                                            id: String(selected.id),
                                                            description: descripcion,
                                                        }];
                                                    });
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <h4 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Notas adicionales</h4>
                                    <div className="flex flex-col gap-4">
                                        <li>Seleccione el inversor y el módulo para calcular el valor máximo y 
                                            mínimo de strings a poder usarse. Así como también los valores mínimos de Protección 
                                            ITM AC e ITM DC.</li>
                                        <li>Ingrese el número exacto de strings y de MPPTs a emplearse para 
                                            poder visualizar la protección SPD.</li>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">Equipos principales seleccionados</h2>
                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-10 bg-slate-100">
                                        <tr className="bg-slate-100 text-left">
                                            <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                                Equipo seleccionado
                                            </th>
                                            <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEquipmentTable.length > 0 ? (
                                            selectedEquipmentTable.map((item) => (
                                                <tr key={item.row} className="bg-white">
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.description}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5">
                                                        <button
                                                            type="button"
                                                onClick={() => {
                                                    setSelectedEquipmentTable((current) =>
                                                        current.filter((row) => row.row !== item.row),
                                                    );
                                                }}

                                                            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="bg-white">
                                                <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                                    No hay equipos seleccionados todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900">Materiales eléctricos seleccionados</h2>
                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="min-w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-10 bg-slate-100">
                                        <tr className="bg-slate-100 text-left">
                                            <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                                Material seleccionado
                                            </th>
                                            <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedMaterialTable.length > 0 ? (
                                            selectedMaterialTable.map((item) => (
                                                <tr key={item.row} className="bg-white">
                                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                        {item.description}
                                                    </td>
                                                    <td className="border-b border-slate-200 px-4 py-5">
                                                        <button
                                                            type="button"
                                                onClick={() => {
                                                    setSelectedMaterialTable((current) =>
                                                        current.filter((row) => row.row !== item.row),
                                                    );
                                                }}

                                                            className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="bg-white">
                                                <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                                    No hay materiales seleccionados todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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
                            Añadir Proyecto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
