"use client";

import { useEffect, useMemo, useState } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductRadioField } from "@/features/view/components/Form_fields/AddRadioField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextAreaField } from "@/features/view/components/Form_fields/AddTextAreaField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { AddProductDateField } from "@/features/view/components/Form_fields/AddDateField";

import { SUPPLIER_CODE_OPTIONS } from "@/lib/utils/options";

import {
    CONNECTION_TYPE_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    SUPPLIER_OPTIONS,
} from "@/lib/utils/options";

import {
    // INITIAL_PRODUCT_FORM,
} from "@/lib/utils/initialValues";

import { 
    shouldRenderConnectionTypeBattery, 
    shouldRenderConnectionTypeInversor,
    shouldRenderBatteryProp,
    shouldRenderInversorProp,
    shouldRenderModuloProp,
    shouldRender_SupplyInfoSelection,
    shouldRenderConnectionTypeAccesories,
} from "@/lib/utils/helpers/render/render_modals";
import { Equipos, EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { createEquiposFormStateFromEquipos } from "@/lib/mapping/mapping_equipos";
import { shouldRender_EquipoInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";

// --- Tipo de variables ---
type EditEquipoModalProps = {
    equipo: Equipos;
    onUpdateEquipo: (equipo: Equipos) => void;
    onClose: () => void;
};

export function EditEquipoModal({ equipo, onUpdateEquipo, onClose }: EditEquipoModalProps) {
    const [form, setForm] = useState<EquiposFormState>(() => createEquiposFormStateFromEquipos(equipo));

    useEffect(() => {
        setForm(createEquiposFormStateFromEquipos(equipo));
    }, [equipo]);

    // Actualizar campos del formulario
    function updateField<K extends keyof EquiposFormState>(field: K, value: EquiposFormState[K]) {
        setForm((current) => {
            const updated = {
                ...current,
                [field]: value,
            };

            if (field === "proveedor") {
                const { supplierCode } = shouldRender_SupplyInfoSelection(String(value));
                updated.cod_prov = supplierCode;
            }

            if (field === "tipo_de_producto") {
                const { brand_options, unit } = shouldRender_EquipoInfoSelection(String(value));
                if (!brand_options.includes(updated.marca)) {
                    updated.marca = brand_options[0] || "";
                }
                updated.unidad = unit || "";
            }

            if (field === "tipo_de_producto") {
                if (value === "Batería") {
                    updated.tipo_conexion = "BAT";
                } else if (current.tipo_conexion === "BAT") {
                    updated.tipo_conexion = "";
                }
            }

            return updated;
        });
    }

    const equipoInfoSelection = shouldRender_EquipoInfoSelection(form.tipo_de_producto);

    // Aceptar actualizacion
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateEquipo({
            id: equipo.id,
            ...form,
            updated_at: new Date()
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-900">Editar Equipo</h2>
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
                <div className="space-y-8">
                <section className="space-y-5">
                <AddProductSectionTitle title="Información Básica" />
                            <div className="grid gap-5 md:grid-cols-2">
                                <AddProductSelectField
                                    label="COD PROV"
                                    required
                                    value={form.cod_prov}
                                    options={SUPPLIER_CODE_OPTIONS}
                                    onChange={(value) => updateField("cod_prov", value)}
                                />
                                <AddProductSelectField
                                    label="PROVEEDOR"
                                    required
                                    value={form.proveedor}
                                    options={SUPPLIER_OPTIONS}
                                    onChange={(value) => updateField("proveedor", value)}
                                />
                                <AddProductReadonlyField
                                    label="Código del Producto"
                                    value={form.cod_producto}
                                />
                                <AddProductSelectField
                                    label="TIPO DE PRODUCTO"
                                    required
                                    value={form.tipo_de_producto}
                                    options={PRODUCT_TYPE_OPTIONS}
                                    onChange={(value) => updateField("tipo_de_producto", value)}
                                />
                                <AddProductSelectField
                                    label="MARCA"
                                    required
                                    value={form.marca}
                                    options={equipoInfoSelection.brand_options.length > 0 ? equipoInfoSelection.brand_options : [""]}
                                    onChange={(value) => updateField("marca", value)}
                                />
                                <AddProductReadonlyField
                                    label="UNIDAD"
                                    value={form.unidad}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <AddProductTextAreaField
                                    label="Descripción"
                                    required
                                    placeholder="Descripción detallada del producto"
                                    value={form.descripcion}
                                    onChange={(value) => updateField("descripcion", value)}
                                />
                            </div>
                </section>

            <section className="space-y-5">
                        <AddProductSectionTitle title="Propiedades Técnicas" />
                        <div className="grid gap-5 md:grid-cols-2">
                            {/* Batería */}
                            {shouldRenderConnectionTypeBattery(form.tipo_de_producto) && (
                                <AddProductSelectField
                                    label="Tipo de Conexión"
                                    value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                                    options={["---", "BAT"]}
                                    onChange={(value) =>
                                    updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                                    }
                                />
                            )}
                            {shouldRenderBatteryProp(form.tipo_de_producto) && (
                            <>
                                <AddProductTextField
                                    label="DoD (%) degradación"
                                    placeholder="80"
                                    value={String(form.dod)}
                                    onChange={(value) => updateField("dod", Number(value))}
                                />
                                <AddProductTextField
                                    label="Amperaje de la batería (Ah)"
                                    placeholder=""
                                    value={form.impp_i_in}
                                    onChange={(value) => updateField("impp_i_in", value)}
                                />
                                <AddProductTextField
                                    label="Voltaje de la batería (V)"
                                    placeholder=""
                                    value={String(form.vmpp_vmin)}
                                    onChange={(value) => updateField("vmpp_vmin", Number(value))}
                                />
                            </>
                            )}

                            {/* Inversor */}
                            {shouldRenderConnectionTypeInversor(form.tipo_de_producto) && (
                            <AddProductSelectField
                                label="Tipo de Conexión"
                                value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                                options={CONNECTION_TYPE_OPTIONS}
                                onChange={(value) =>
                                    updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                                }
                            />
                            )}
                            {shouldRenderInversorProp(form.tipo_de_producto) && (
                            <>
                                <AddProductTextField
                                    label="Potencia máxima(kw)"
                                    placeholder=""
                                    value={String(form.potencia_maxima)}
                                    onChange={(value) => updateField("potencia_maxima", Number(value))}
                                />
                                <AddProductTextField
                                    label="Número de MPPT"
                                    placeholder=""
                                    value={String(form.mppt)}
                                    onChange={(value) => updateField("mppt", Number(value))}
                                />
                                <AddProductTextField
                                    label="Potencia AC del inversor (kw)"
                                    placeholder=""
                                    value={String(form.potencia_ac)}
                                    onChange={(value) => updateField("potencia_ac", Number(value))}
                                />
                                <AddProductTextField
                                    label="Voltaje mínimo del inversor"
                                    placeholder=""
                                    value={String(form.vmpp_vmin)}
                                    onChange={(value) => updateField("vmpp_vmin", Number(value))}
                                />
                                <AddProductTextField
                                    label="Voltaje máximo del inversor"
                                    placeholder=""
                                    value={String(form.voc_vmax)}
                                    onChange={(value) => updateField("voc_vmax", Number(value))}
                                />
                                <AddProductTextField
                                    label="Corriente de entrada"
                                    placeholder=""
                                    value={String(form.impp_i_in)}
                                    onChange={(value) => updateField("impp_i_in", value)}
                                />
                                <AddProductTextField
                                    label="Corriente de salida"
                                    placeholder=""
                                    value={String(form.isc_i_out)}
                                    onChange={(value) => updateField("isc_i_out", Number(value))}
                                />
                            </>
                            )}

                            {/* Módulo */}
                            {shouldRenderModuloProp(form.tipo_de_producto) && (
                            <>
                                <AddProductTextField
                                    label="Potencia máxima del panel (kw)"
                                    placeholder=""
                                    value={String(form.potencia_maxima)}
                                    onChange={(value) => updateField("potencia_maxima", Number(value))}
                                />
                                <AddProductTextField
                                    label="VOC (Voltaje a circuito abierto) [V]"
                                    placeholder=""
                                    value={String(form.voc_vmax)}
                                    onChange={(value) => updateField("voc_vmax", Number(value))}
                                />
                                <AddProductTextField
                                    label="ISC (Corriente a corto circuito) [A]"
                                    placeholder=""
                                    value={String(form.isc_i_out)}
                                    onChange={(value) => updateField("isc_i_out", Number(value))}
                                />
                                <AddProductTextField
                                    label="VMPP (Voltaje punto de máxima potencia) [V]"
                                    placeholder=""
                                    value={String(form.vmpp_vmin)}
                                    onChange={(value) => updateField("vmpp_vmin", Number(value))}
                                />
                                <AddProductTextField
                                    label="IMPP (Corriente punto de máxima potencia) [A]"
                                    placeholder=""
                                    value={String(form.impp_i_in)}
                                    onChange={(value) => updateField("impp_i_in", value)}
                                />
                            </>
                            )}

                            {/* Accesorio */}
                            {shouldRenderConnectionTypeAccesories(form.tipo_conexion) && (
                            <AddProductSelectField
                                label="Tipo de Conexión"
                                value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                                options={CONNECTION_TYPE_OPTIONS}
                                onChange={(value) =>
                                    updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                                }
                            />
                            )}
                        </div>
                    </section>

                <section className="space-y-5">
                    <AddProductSectionTitle title="Información de Precios" />
                    <div className="space-y-5">
                        {/* <AddProductSelectField
                            label="Fuente de tasa de cambio"
                            value={form.priceInputCurrency}
                            options={[...PRICE_CURRENCY_OPTIONS]}
                            onChange={(value) => updateField("priceInputCurrency", value as CurrencyCode)}
                        />
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-slate-800">Ingresar precio en:</p>
                            <div className="flex flex-wrap gap-6">
                                <AddProductRadioField
                                    label="Soles (S/.)"
                                    checked={form.priceInputCurrency === "PEN"}
                                    onChange={() => handleCurrencyModeChange("PEN")}
                                />
                                <AddProductRadioField
                                    label="Dólares ($)"
                                    checked={form.priceInputCurrency === "USD"}
                                    onChange={() => handleCurrencyModeChange("USD")}
                                />
                            </div>
                        </div> */}

                        <div className="grid gap-5 md:grid-cols-2">
                                <AddProductNumberField
                                    label="Precio ($)"
                                    // required
                                    step={0.01}
                                    min={0.00}
                                    // disabled={form.priceInputCurrency !== "USD"}
                                    value={form.precio_dolares > 0 ? form.precio_dolares : ""}
                                    onChange={(value) => updateField("precio_dolares", value)}
                                />
                                <AddProductNumberField
                                    label="Precio (S/.)"
                                    // required
                                    step={0.01}
                                    min={0.00}
                                    // disabled={form.priceInputCurrency !== "PEN"}
                                    value={form.precio_soles > 0 ? form.precio_soles : ""}
                                    onChange={(value) => updateField("precio_soles", value)}
                                /> 
                                <AddProductNumberField
                                    label="IGV (%)"
                                    required
                                    step={1}
                                    min={0}
                                    value={form.igv}
                                    onChange={(value) => updateField("igv", value)}
                                />
                                <div />
                                    {/* <AddProductReadonlyField
                                        label="Precio + IGV ($)"
                                        value={formatReadonlyCurrency("$", computedPrices.totalUsd)}
                                    /> */}
                                    <AddProductNumberField
                                        label="Precio ($) + IGV"
                                        // required
                                        step={0.01}
                                        min={0.00}
                                        // disabled={form.priceInputCurrency !== "PEN"}
                                        value={form.precio_dolares_igv > 0 ? form.precio_dolares_igv : ""}
                                        onChange={(value) => updateField("precio_dolares_igv", value)}
                                    /> 
                                    {/* <AddProductReadonlyField
                                        label="Precio + IGV (S/.)"
                                        value={3.412*formatReadonlyCurrency("S/.", computedPrices.totalPen)}
                                    /> */}
                                    <AddProductNumberField
                                        label="Precio (S/.) + IGV"
                                        // required
                                        step={0.01}
                                        min={0.00}
                                        // disabled={form.priceInputCurrency !== "PEN"}
                                        value={form.precio_soles_igv > 0 ? form.precio_soles_igv : ""}
                                        onChange={(value) => updateField("precio_soles_igv", value)}
                                    /> 
                                </div>
                    </div>
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
                    Actualizar Equipo
                </button>
                </div>
            </form>
            </div>
        </div>
    );
}