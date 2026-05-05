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
import { AddProductDateField } from "@/features/components/Form_fields/AddProductDateField";

import type { CurrencyCode, Product, ProductFormData, ProductFormState } from "@/lib/types/product-types";

import {
    computePricesWithIgv,
    convertPenToUsd,
    convertUsdToPen,
    formatReadonlyCurrency,
} from "@/lib/utils/helpers";

import {
    CONNECTION_TYPE_OPTIONS,
    PRODUCT_TYPE_OPTIONS,
    SUPPLIER_OPTIONS,
    POWER_SOURCE_OPTIONS,
    STATUS_OPTIONS, 
    PRICE_CURRENCY_OPTIONS,
} from "@/lib/utils/options";

import {
    INITIAL_PRODUCT_FORM,
} from "@/lib/utils/initialValues";

import { 
    shouldRenderPowerSource, 
    shouldRenderConnectionTypeBattery, 
    shouldRenderConnectionTypeInversor,
    shouldRenderConnectionTypeSmartMeter,
    shouldRenderPanelArray,
    shouldRenderBatteryProp,
    shouldRenderInversorProp,
    shouldRenderModuloProp,
    shouldRenderImportDate,
    shouldRender_SupplyInfoSelection,
    shouldRender_ProductInfoSelection,
    shouldRender_CodeProduct,
    buildProductCode,
} from "@/lib/utils/renders";

// --- Tipo de variables ---
type AddProductModalProps = {
    exchangeRate: number;
    existingProducts: Product[];
    onAddProduct: (product: ProductFormData) => void;
    onClose: () => void;
};

export function AddProductModal({ exchangeRate, existingProducts, onAddProduct, onClose }: AddProductModalProps) {
    const today = new Date().toISOString().split('T')[0];
    const [form, setForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);

    // Calcular cambios de precios
    const computedPrices = useMemo(() => {
        const basePen = form.priceInputCurrency === "PEN" ? form.precio_soles : convertUsdToPen(form.precio_dolares, exchangeRate);
        const baseUsd = form.priceInputCurrency === "USD" ? form.precio_dolares : convertPenToUsd(form.precio_soles, exchangeRate);

        return computePricesWithIgv(
            Number.isFinite(basePen) ? basePen : 0,
            Number.isFinite(baseUsd) ? baseUsd : 0,
            form.igv,
        );
    }, [exchangeRate, form.igv, form.priceInputCurrency, form.precio_soles, form.precio_dolares]);

    // Actualizar campos del formulario
    function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
        setForm((current) => {
        const updated = { ...current, [field]: value };

        if (field === "proveedor") {
            const { RUC, supplierCode } = shouldRender_SupplyInfoSelection(String(value));
            updated.ruc = RUC;
            updated.cod_prov = supplierCode;
        }

        if (field === "tipo") {
            const { brand_options, unit } = shouldRender_ProductInfoSelection(String(value));
            if (!brand_options.includes(updated.marca)) {
                updated.marca = brand_options[0] || "";
            }
            updated.unidad = unit || "";
        }

        // Establecer connectionType a "BAT" cuando se selecciona Batería
        if (field === "tipo" && value === "Batería") {
            updated.tipo_conexion_bateria = "BAT";
        }
        if (field === "estado_equipo" && value !== "En importación") {
            updated.fecha_estimada_importacion = null;
        }
        return updated;
        });
    }

    const productInfoSelection = shouldRender_ProductInfoSelection(form.tipo);
    const supplierProductCount = existingProducts.filter((product) => product.proveedor === form.proveedor).length;
    const generatedCode = buildProductCode(form.tipo, form.proveedor, supplierProductCount + 1);

    // Cambiar la modalidad base de precios
    function handleCurrencyModeChange(currency: CurrencyCode) {
        setForm((current) => ({
        ...current,
        priceInputCurrency: currency,
        pricePen: currency === "PEN" ? current.precio_soles : convertUsdToPen(current.precio_dolares, exchangeRate),
        priceUsd: currency === "USD" ? current.precio_dolares : convertPenToUsd(current.precio_soles, exchangeRate),
        }));
    }

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddProduct({
        ...form,
        codigo: generatedCode || form.codigo,
        fecha_estimada_importacion:
            form.estado_equipo === "En importación" ? form.fecha_estimada_importacion : null,
        precio_soles: Number(computedPrices.pricePen.toFixed(2)),
        precio_dolares: Number(computedPrices.priceUsd.toFixed(2)),
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
                        value={form.proveedor}
                        options={SUPPLIER_OPTIONS}
                        onChange={(value) => updateField("proveedor", value)}
                    />
                    <AddProductReadonlyField
                        label="RUC"
                        value={form.ruc}
                    />
                    <AddProductReadonlyField
                        label="Código del proveedor"
                        value={form.cod_prov}
                    />
                    <AddProductSelectField
                    label="Tipo de Producto"
                    required
                    value={form.tipo}
                    options={PRODUCT_TYPE_OPTIONS}
                    onChange={(value) => updateField("tipo", value)}
                    />
                    {shouldRender_CodeProduct(form.tipo, form.proveedor) ? (
                    <AddProductReadonlyField
                        label="Código del Producto"
                        value={generatedCode}
                    />
                    ) : (
                    <AddProductReadonlyField
                        label="Código del Producto"
                        value="Selecciona tipo de producto y proveedor"
                    />
                    )}
                    <AddProductSelectField
                    label="Marca"
                    required
                    value={form.marca}
                    options={productInfoSelection.brand_options.length > 0 ? productInfoSelection.brand_options : [""]}
                    onChange={(value) => updateField("marca", value)}
                    />
                    <AddProductReadonlyField
                        label="Unidad"
                        value={form.unidad}
                    />
                    <AddProductSelectField
                    label="Estado del producto"
                    required
                    value={form.estado_equipo}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateField("estado_equipo", value)}
                    />

                    {/* En caso el producto se encuentre en importación */}
                    {shouldRenderImportDate(form.estado_equipo) && (
                    <AddProductDateField
                    label="Fecha estimada de importación"
                    required
                    value={
                        form.fecha_estimada_importacion
                            ? form.fecha_estimada_importacion.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(value) => updateField("fecha_estimada_importacion", value ? new Date(value) : null)}
                    min={today}
                    />
                    )}

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
                    {shouldRenderConnectionTypeBattery(form.tipo) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.tipo_conexion_bateria || CONNECTION_TYPE_OPTIONS[0]}
                        options={["---", "BAT"]}
                        onChange={(value) =>
                        updateField("tipo_conexion_bateria", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}
                    {shouldRenderBatteryProp(form.tipo) && (
                    <>
                        <AddProductTextField
                            label="DoD (%) degradación"
                            placeholder="80"
                            value={form.dod}
                            onChange={(value) => updateField("dod", value)}
                        />
                        <AddProductTextField
                            label="Amperaje de la batería (Ah)"
                            placeholder=""
                            value={form.amperaje_bateria}
                            onChange={(value) => updateField("amperaje_bateria", value)}
                        />
                        <AddProductTextField
                            label="Voltaje de la batería (V)"
                            placeholder=""
                            value={form.voltaje_bateria}
                            onChange={(value) => updateField("voltaje_bateria", value)}
                        />
                    </>
                    )}

                    {/* Estructura */}
                    {shouldRenderPanelArray(form.tipo) && (
                    <AddProductTextField
                        label="Paneles por estructura"
                        placeholder="4"
                        value={String(form.panel_array ?? " ")}
                        onChange={(value) => updateField("panel_array", value)}
                    />
                    )}   

                    {/* Inversor */}
                    {shouldRenderConnectionTypeInversor(form.tipo) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.tipo_conexion_inversor || CONNECTION_TYPE_OPTIONS[0]}
                        options={CONNECTION_TYPE_OPTIONS}
                        onChange={(value) =>
                        updateField("tipo_conexion_inversor", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}
                    {shouldRenderInversorProp(form.tipo) && (
                    <>
                        <AddProductTextField
                            label="Potencia DC máximo del inversor (kw)"
                            placeholder=""
                            value={form.potencia_dc_inversor}
                            onChange={(value) => updateField("potencia_dc_inversor", value)}
                        />
                        <AddProductTextField
                            label="Potencia AC del inversor (kw)"
                            placeholder=""
                            value={form.potencia_ac_inversor}
                            onChange={(value) => updateField("potencia_ac_inversor", value)}
                        />
                        <AddProductTextField
                            label="Número de MPPT"
                            placeholder=""
                            value={form.mppt}
                            onChange={(value) => updateField("mppt", value)}
                        />
                        <AddProductTextField
                            label="Corriente de entrada"
                            placeholder=""
                            value={form.i_entrada_inversor}
                            onChange={(value) => updateField("i_entrada_inversor", value)}
                        />
                        <AddProductTextField
                            label="Corriente de salida"
                            placeholder=""
                            value={form.i_salida_inversor}
                            onChange={(value) => updateField("i_salida_inversor", value)}
                        />
                        <AddProductTextField
                            label="Voltaje máximo del inversor"
                            placeholder=""
                            value={form.voltaje_maximo_inversor}
                            onChange={(value) => updateField("voltaje_maximo_inversor", value)}
                        />
                    </>
                    )}

                    {/* Módulo */}
                    {shouldRenderModuloProp(form.tipo) && (
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
                        <AddProductTextField
                            label="VMPP (Voltaje mínimo) en Voltios"
                            placeholder="120V"
                            value={form.vmpp}
                            onChange={(value) => updateField("vmpp", value)}
                        />
                        <AddProductTextField
                            label="IMPP (Corriente máxima salida) en Amperios"
                            placeholder="11.8A"
                            value={form.impp}
                            onChange={(value) => updateField("impp", value)}
                        />
                        <AddProductTextField
                            label="Área por módulo"
                            placeholder="1.6 m²"
                            value={String(form.panel_area ?? " ")}
                            onChange={(value) => updateField("panel_area", value)}
                        />
                    </>
                    )}

                    {/* Smart meter */}
                    {shouldRenderConnectionTypeSmartMeter(form.tipo) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.tipo_conexion_smartmeter || CONNECTION_TYPE_OPTIONS[0]}
                        options={CONNECTION_TYPE_OPTIONS}
                        onChange={(value) =>
                        updateField("tipo_conexion_smartmeter", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}
                    {/* Cableado */}
                    {shouldRenderPowerSource(form.tipo) && (
                    <AddProductSelectField
                        label="Fuente Eléctrica"
                        value={form.fuente_electrica}
                        options={POWER_SOURCE_OPTIONS}
                        onChange={(value) => updateField("fuente_electrica", value)}
                    />
                    )}

                </div>
                </section>
                
                {/* Precios */}
                <section className="space-y-5">
                <AddProductSectionTitle title="Información de Precios" />
                <div className="space-y-5">
                    <AddProductSelectField
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
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                    <AddProductNumberField
                        label="Precio (S/.)"
                        required
                        step="0.01"
                        min="0"
                        disabled={form.priceInputCurrency !== "PEN"}
                        value={form.priceInputCurrency === "PEN" ? form.precio_soles : computedPrices.pricePen}
                        onChange={(value) => updateField("precio_soles", value)}
                    />
                    <AddProductNumberField
                        label="Precio ($)"
                        required
                        step="0.01"
                        min="0"
                        disabled={form.priceInputCurrency !== "USD"}
                        value={form.priceInputCurrency === "USD" ? form.precio_dolares : computedPrices.priceUsd}
                        onChange={(value) => updateField("precio_dolares", value)}
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

            {/* Estado */}

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