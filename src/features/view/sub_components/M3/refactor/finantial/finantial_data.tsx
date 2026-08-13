"use client";

import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { Finantial_selectedProps } from "@/lib/types/components/sub_components/module_render";
import { FinantialCambioEquipo, FinantialCambioItem } from "@/lib/types/supabase/finantial-types";
import { formatPaybackLabel } from "@/lib/utils/helpers/computes/finantial_computes";
import { formatCurrency } from "@/lib/utils/normalization";

const computedFieldClass = "bg-rose-100 text-rose-900 border-rose-200";
const MAX_CAMBIOS = 5;
const CAMBIO_OPTIONS = Array.from({ length: MAX_CAMBIOS + 1 }, (_, count) => ({
    value: String(count),
    label: count === 1 ? "1 cambio" : `${count} cambios`,
}));
const CAMBIO_ORDINAL = ["1er", "2do", "3er", "4to", "5to"];

function formatPayback(value: string | null): string {
    if (!value) return "—";
    if (value.includes("año") || value.includes("mes")) return value;
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return formatPaybackLabel(numeric);
    return value;
}

function defaultTipo(hasInverter: boolean, hasBattery: boolean): FinantialCambioEquipo {
    if (hasInverter && !hasBattery) return "INVERSOR";
    if (!hasInverter && hasBattery) return "BATERÍA";
    return "";
}

function emptyCambio(hasInverter: boolean, hasBattery: boolean): FinantialCambioItem {
    return { anio: "", tipo: defaultTipo(hasInverter, hasBattery) };
}

function resizeCambios(
    current: FinantialCambioItem[] | undefined,
    count: number,
    hasInverter: boolean,
    hasBattery: boolean,
): FinantialCambioItem[] {
    const next = (current ?? []).slice(0, count);
    while (next.length < count) next.push(emptyCambio(hasInverter, hasBattery));
    return next;
}

export function FinantialData({ form, updateField, analysis }: Finantial_selectedProps) {
    const cambioCount = Number(form.cantidad_cambios) || 0;
    const hasInverter = analysis.inverterReplacementCost > 0;
    const hasBattery = analysis.batteryReplacementCost > 0;
    const showReplacementFields = hasInverter || hasBattery;
    const tipoOptions = [
        ...(hasInverter ? [{ value: "INVERSOR", label: "Inversor" }] : []),
        ...(hasBattery ? [{ value: "BATERÍA", label: "Batería" }] : []),
    ];

    function handleCambioCountChange(value: string) {
        const count = Number(value) || 0;
        updateField("cantidad_cambios", value);
        updateField("cambios_equipo", resizeCambios(form.cambios_equipo, count, hasInverter, hasBattery));
    }

    function updateCambio(index: number, patch: Partial<FinantialCambioItem>) {
        const cambios = resizeCambios(form.cambios_equipo, cambioCount, hasInverter, hasBattery);
        cambios[index] = { ...cambios[index], ...patch };
        updateField("cambios_equipo", cambios);
    }

    return (
        <div className="grid gap-2">
            <h2 className="mt-2 mb-1 text-xl font-bold text-red-900">Ingrese datos</h2>
            <AddProductNumberField
                label="Energía generada por la planta (KWp)"
                required
                value={Number(form.planta) > 0 ? Number(form.planta) : ""}
                onChange={(value) => updateField("planta", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Generación en el primer año (MWh/primer año)"
                required
                value={Number(form.generacion) > 0 ? Number(form.generacion) : ""}
                onChange={(value) => updateField("generacion", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Tarifa de la red ($)"
                required
                value={Number(form.tarifa_red) > 0 ? Number(form.tarifa_red) : ""}
                onChange={(value) => updateField("tarifa_red", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) degradación en el 1er año"
                required
                value={Number(form.degra_1er) > 0 ? Number(form.degra_1er) : ""}
                onChange={(value) => updateField("degra_1er", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) degradación desde el 2do año"
                required
                value={Number(form.degra_2do) > 0 ? Number(form.degra_2do) : ""}
                onChange={(value) => updateField("degra_2do", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="(%) incremento de la tarifa"
                required
                value={Number(form.tarifa_crecimiento) > 0 ? Number(form.tarifa_crecimiento) : ""}
                onChange={(value) => updateField("tarifa_crecimiento", String(value))}
                step={0.01}
                min={0}
            />
            <AddProductNumberField
                label="Tasa de descuento (%)"
                required
                value={Number(form.tasa_descuento) > 0 ? Number(form.tasa_descuento) : ""}
                onChange={(value) => updateField("tasa_descuento", String(value))}
                step={0.01}
                min={0}
            />
            {showReplacementFields && (
                <AddProductSelectField
                    label="Cantidad de cambios a considerar"
                    value={form.cantidad_cambios || "0"}
                    options={CAMBIO_OPTIONS}
                    onChange={handleCambioCountChange}
                />
            )}
            {showReplacementFields && cambioCount > 0 &&
                Array.from({ length: cambioCount }, (_, index) => {
                    const cambio = form.cambios_equipo?.[index] ?? emptyCambio(hasInverter, hasBattery);
                    const ordinal = CAMBIO_ORDINAL[index] ?? `${index + 1}°`;
                    return (
                        <div key={`cambio-${index}`} className="grid gap-2 rounded-xl border border-slate-200 p-3">
                            <p className="text-sm font-semibold text-slate-700">{ordinal} cambio</p>
                            <AddProductSelectField
                                label="Equipo a cambiar"
                                value={cambio.tipo}
                                options={[
                                    { value: "", label: "Seleccione equipo" },
                                    ...tipoOptions,
                                ]}
                                onChange={(value) => updateCambio(index, { tipo: value as FinantialCambioEquipo })}
                            />
                            <AddProductNumberField
                                label={`Año del ${ordinal} cambio`}
                                value={Number(cambio.anio) > 0 ? Number(cambio.anio) : ""}
                                onChange={(value) => updateCambio(index, { anio: String(value) })}
                                step={1}
                                min={1}
                            />
                        </div>
                    );
                })}
            <AddProductReadonlyField
                label="CAPEX"
                value={formatCurrency(Number(form.cotizacion_info?.precio_dolares), "USD")}
                colorClass={computedFieldClass}
            />

            <AddProductReadonlyField
                label="OPEX"
                value={formatCurrency(analysis.opex, "USD")}
                colorClass={computedFieldClass}
            />
            <AddProductReadonlyField
                label="Tiempo de recuperación"
                value={formatPayback(analysis.tiempo_retorno)}
                colorClass={computedFieldClass}
            />
        </div>
    );
}
