"use client";

import { useMemo, useState } from "react";
import { AddProductCloseIcon } from "@/features/components/Icons/AddProductCloseIcon";
import { AddProductNumberField } from "@/features/components/Form_fields/AddProductNumberField";
import { AddProductRadioField } from "@/features/components/Form_fields/AddProductRadioField";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField";
import { AddProductSectionTitle } from "@/features/components/Form_fields/AddProductSectionTitle";
import { AddProductSelectField } from "@/features/components/Form_fields/AddProductSelectField";
import { AddProductTextAreaField } from "@/features/components/Form_fields/AddProductTextAreaField";
import { AddProductTextField } from "@/features/components/Form_fields/AddProductTextField";
import type { CurrencyCode, ProductFormData } from "@/features/types/product-types";
import {
    CONNECTION_TYPE_OPTIONS,
    INITIAL_PRODUCT_FORM,
    BRAND_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    SUPPLIER_OPTIONS,
    UNIT_OPTIONS,
    POWER_SOURCE_OPTIONS,
    computePricesWithIgv,
    convertPenToUsd,
    convertUsdToPen,
    formatReadonlyCurrency,
    type ProductFormState,
} from "@/lib/utils/helpers";
import { 
    shouldRenderArraysPerMppt, 
    shouldRenderDod, 
    shouldRenderMaxPower, 
    shouldRenderMppt, 
    shouldRenderPowerSource, 
    shouldRenderVocVmppIscImpp, 
    shouldRenderConnectionType, 
    shouldRenderBeta
} from "@/lib/utils/renders";

// --- Tipo de variables ---
type AddProductModalProps = {
    exchangeRate: number;
    onAddProduct: (product: ProductFormData) => void;
    onClose: () => void;
};

export function AddProductModal({ exchangeRate, onAddProduct, onClose }: AddProductModalProps) {
    const [form, setForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);

    // Calcular cambios de precios
    const computedPrices = useMemo(() => {
        const basePen = form.priceInputCurrency === "PEN" ? form.pricePen : convertUsdToPen(form.priceUsd, exchangeRate);
        const baseUsd = form.priceInputCurrency === "USD" ? form.priceUsd : convertPenToUsd(form.pricePen, exchangeRate);

        return computePricesWithIgv(
        Number.isFinite(basePen) ? basePen : 0,
        Number.isFinite(baseUsd) ? baseUsd : 0,
        form.igv,
        );
    }, [exchangeRate, form.igv, form.priceInputCurrency, form.pricePen, form.priceUsd]);

    // Actualizar campos del formulario
    function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
        setForm((current) => {
        const updated = { ...current, [field]: value };
        // Establecer connectionType a "BAT" cuando se selecciona Batería
        if (field === "type" && value === "Batería") {
            updated.connectionType = "BAT";
        }
        return updated;
        });
    }

    // Cambiar la modalidad base de precios
    function handleCurrencyModeChange(currency: CurrencyCode) {
        setForm((current) => ({
        ...current,
        priceInputCurrency: currency,
        pricePen: currency === "PEN" ? current.pricePen : convertUsdToPen(current.priceUsd, exchangeRate),
        priceUsd: currency === "USD" ? current.priceUsd : convertPenToUsd(current.pricePen, exchangeRate),
        }));
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddProduct({
        ...form,
        pricePen: Number(computedPrices.pricePen.toFixed(2)),
        priceUsd: Number(computedPrices.priceUsd.toFixed(2)),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Producto</h2>
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
                    label="Proveedor"
                    required
                    value={form.supplier}
                    options={SUPPLIER_OPTIONS}
                    onChange={(value) => updateField("supplier", value)}
                    />
                    <AddProductTextField
                    label="Código del Proveedor"
                    required
                    value={form.supplierCode}
                    onChange={(value) => updateField("supplierCode", value)}
                    />
                    <AddProductTextField
                    label="Código del Producto"
                    required
                    placeholder="PANEL-450-MONO"
                    value={form.code}
                    onChange={(value) => updateField("code", value)}
                    />
                    <AddProductSelectField
                    label="Tipo de Producto"
                    required
                    value={form.type}
                    options={PRODUCT_TYPE_OPTIONS}
                    onChange={(value) => updateField("type", value)}
                    />
                    <AddProductSelectField
                    label="Marca"
                    required
                    value={form.brand}
                    options={BRAND_OPTIONS}
                    onChange={(value) => updateField("brand", value)}
                    />
                    <AddProductSelectField
                    label="Unidad"
                    required
                    value={form.unit}
                    options={UNIT_OPTIONS}
                    onChange={(value) => updateField("unit", value)}
                    />
                    <div className="md:col-span-2">
                    <AddProductTextAreaField
                        label="Descripción"
                        required
                        placeholder="Descripción detallada del producto"
                        value={form.description}
                        onChange={(value) => updateField("description", value)}
                    />
                    </div>
                </div>
                </section>

                <section className="space-y-5">
                <AddProductSectionTitle title="Especificaciones Técnicas" />
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Tipo de Conexión - Inversor y Batería */}
                    {shouldRenderConnectionType(form.type) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.connectionType || CONNECTION_TYPE_OPTIONS[0]}
                        options={
                        form.type === "Batería"
                            ? ["BAT"]
                            : CONNECTION_TYPE_OPTIONS
                        }
                        onChange={(value) =>
                        updateField("connectionType", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}

                    {/* Potencia Máxima - Inversor y Módulo */}
                    {shouldRenderMaxPower(form.type) && (
                    <AddProductTextField
                        label="Potencia Máxima en Kw"
                        placeholder="5kW"
                        value={form.maxPower}
                        onChange={(value) => updateField("maxPower", value)}
                    />
                    )}

                    {/* MPPT - Solo Inversor */}
                    {shouldRenderMppt(form.type) && (
                    <AddProductTextField
                        label="Número de MPPT"
                        placeholder="2"
                        value={form.mpptNumber}
                        onChange={(value) => updateField("mpptNumber", value)}
                    />
                    )}

                    {/* DoD - Batería */}
                    {shouldRenderDod(form.type) && (
                    <AddProductTextField
                        label="DoD - Grado de degradación (%)"
                        placeholder="95%"
                        value={form.dod}
                        onChange={(value) => updateField("dod", value)}
                    />
                    )}

                    {/* Beta - Módulo */}
                    {shouldRenderBeta(form.type) && (
                    <AddProductTextField
                        label="Beta - Porcentaje de degradación por temperatura (%)"
                        placeholder="25%"
                        value={String(form.beta_percent)}
                        onChange={(value) => updateField("beta_percent", parseFloat(value) || 0)}
                    />
                    )}

                    {/* Arreglos por MPPT - Solo Inversor */}
                    {shouldRenderArraysPerMppt(form.type) && (
                    <AddProductTextField
                        label="Arreglos por MPPT"
                        placeholder="2"
                        value={form.arraysPerMppt}
                        onChange={(value) => updateField("arraysPerMppt", value)}
                    />
                    )}

                    {/* VOC, VMPP, ISC, IMPP - Inversor, Módulo y Batería */}
                    {shouldRenderVocVmppIscImpp(form.type) && (
                    <>
                        <AddProductTextField
                            label="VOC (Voltaje máximo) en Voltios"
                            placeholder="550V"
                            value={form.voc}
                            onChange={(value) => updateField("voc", value)}
                        />
                        <AddProductTextField
                            label="ISC (Corriente máxima entrada) en Amperios"
                            placeholder="12.5A"
                            value={form.isc}
                            onChange={(value) => updateField("isc", value)}
                        />
                        {(form.type === "Inversor" || form.type === "Módulo") && (
                            <AddProductTextField
                                label="VMPP (Voltaje mínimo) en Voltios"
                                placeholder="120V"
                                value={form.vmpp}
                                onChange={(value) => updateField("vmpp", value)}
                            />
                        )}
                        {(form.type === "Inversor" || form.type === "Módulo") && (
                            <AddProductTextField
                                label="IMPP (Corriente máxima salida) en Amperios"
                                placeholder="11.8A"
                                value={form.impp}
                                onChange={(value) => updateField("impp", value)}
                            />
                        )}
                    </>
                    )}

                    {/* Fuente Eléctrica - Cable, Protección y MC4 */}
                    {shouldRenderPowerSource(form.type) && (
                    <AddProductSelectField
                        label="Fuente Eléctrica"
                        value={form.powerSource}
                        options={POWER_SOURCE_OPTIONS}
                        onChange={(value) => updateField("powerSource", value)}
                    />
                    )}
                </div>
                </section>

                <section className="space-y-5">
                <AddProductSectionTitle title="Información de Precios" />
                <div className="space-y-5">
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
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                    <AddProductNumberField
                        label="Precio (S/.)"
                        required
                        step="0.01"
                        min="0"
                        disabled={form.priceInputCurrency !== "PEN"}
                        value={form.priceInputCurrency === "PEN" ? form.pricePen : computedPrices.pricePen}
                        onChange={(value) => updateField("pricePen", value)}
                    />
                    <AddProductNumberField
                        label="Precio ($)"
                        required
                        step="0.01"
                        min="0"
                        disabled={form.priceInputCurrency !== "USD"}
                        value={form.priceInputCurrency === "USD" ? form.priceUsd : computedPrices.priceUsd}
                        onChange={(value) => updateField("priceUsd", value)}
                    />
                    <AddProductNumberField
                        label="IGV (%)"
                        required
                        step="0.01"
                        min="0"
                        value={form.igv}
                        onChange={(value) => updateField("igv", value)}
                    />
                    <div />
                    <AddProductReadonlyField
                        label="Precio + IGV (S/.)"
                        value={formatReadonlyCurrency("S/.", computedPrices.totalPen)}
                    />
                    <AddProductReadonlyField
                        label="Precio + IGV ($)"
                        value={formatReadonlyCurrency("$", computedPrices.totalUsd)}
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
                Añadir Producto
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}