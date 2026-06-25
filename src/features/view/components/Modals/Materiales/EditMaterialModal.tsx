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

import { POWER_SOURCE_OPTIONS, SUPPLIER_CODE_OPTIONS } from "@/lib/utils/options";

import {
    PRODUCT_TYPE_OPTIONS,
    SUPPLIER_OPTIONS,
} from "@/lib/utils/options";

import {
    // INITIAL_PRODUCT_FORM,
} from "@/lib/utils/initialValues";

import { 
    shouldRender_SupplyInfoSelection,
} from "@/lib/utils/helpers/render/render_modals";

import { Materiales, MaterialesFormState } from "@/lib/types/supabase/materiales-types";
import { createMaterialesFormStateFromMateriales } from "@/lib/mapping/mapping_materiales";
import { shouldRender_MaterialInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";

// --- Tipo de variables ---
type EditMaterialModalProps = {
    material: Materiales;
    onUpdateMaterial: (material: Materiales) => void;
    onClose: () => void;
};

export function EditMaterialModal({ material, onUpdateMaterial, onClose }: EditMaterialModalProps) {
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState<MaterialesFormState>(() => createMaterialesFormStateFromMateriales(material));

    useEffect(() => {
        setForm(createMaterialesFormStateFromMateriales(material));
    }, [material]);

    // Actualizar campos del formulario
    function updateField<K extends keyof MaterialesFormState>(field: K, value: MaterialesFormState[K]) {
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
                const { brand_options, unit } = shouldRender_MaterialInfoSelection(String(value));
                if (!brand_options.includes(updated.marca)) {
                    updated.marca = brand_options[0] || "";
                }
                updated.unidad = unit || "";
            }

            return updated;
        });
    }

    const materialInfoSelection = shouldRender_MaterialInfoSelection(form.tipo_de_producto);

    // Aceptar actualizacion
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateMaterial({
            id: material.id,
            ...form,
            updated_at: new Date()
        });

        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <h2 className="text-2xl font-bold text-slate-900">Editar Material</h2>
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
                                    options={materialInfoSelection.brand_options.length > 0 
                                        ? materialInfoSelection.brand_options : [""]}
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
                            <AddProductSelectField
                                label="Parte eléctrica"
                                value={form.parte_electrica || POWER_SOURCE_OPTIONS[0]}
                                options={POWER_SOURCE_OPTIONS}
                                onChange={(value) =>
                                    updateField("parte_electrica", value === POWER_SOURCE_OPTIONS[0] ? "" : value)
                                }
                            />
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
                    Actualizar Material
                </button>
                </div>
            </form>
            </div>
        </div>
    );
}