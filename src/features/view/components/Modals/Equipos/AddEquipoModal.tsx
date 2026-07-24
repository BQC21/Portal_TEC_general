"use client";

import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { AddProductCloseIcon } from "../../Icons/AddCloseIcon";
import { INITIAL_BRAND_FORM, INITIAL_EQUIPOS_FORM, INITIAL_SUPPLIER_FORM, INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { useMemo, useState } from "react";
import { CONNECTION_TYPE_OPTIONS } from "@/lib/utils/options";
import { AddProductSelectField } from "../../Form_fields/AddSelectField";
import { AddProductReadonlyField } from "../../Form_fields/AddReadonlyField";
import { shouldRender_SupplyInfoSelection, 
    shouldRenderBatteryProp, shouldRenderConnectionTypeAccesories, 
    shouldRenderConnectionTypeBattery, shouldRenderConnectionTypeInversor, 
    shouldRenderInversorProp, shouldRenderModuloProp } from "@/lib/utils/helpers/render/render_modals";
import { AddProductSectionTitle } from "../../Form_fields/AddSectionTitle";
import { AddProductTextAreaField } from "../../Form_fields/AddTextAreaField";
import { AddProductTextField } from "../../Form_fields/AddTextField";
import { AddProductNumberField } from "../../Form_fields/AddNumberField";
import { shouldRender_EquipoInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";
import { buildProductCode } from "@/lib/utils/helpers/render/render_codeProduct";
import { AddEquipoModalProps } from "@/lib/types/components/modals";
import {
    getModalCascadeOptions,
    resolveFormCascadeFilters,
    withCascadePlaceholder,
} from "@/lib/utils/helpers/filters/cascadeFilterOptions";
import { useTypes } from "@/features/view/hooks/services/useRealtimeTipos";
import { useBrands } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores } from "@/features/view/hooks/services/useRealtimeProveedores";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { BrandFormstate } from "@/lib/types/supabase/brand.types";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { useTypeSelection } from "@/features/view/hooks/modals/Sizing/useTypeSelection";
import { useBrandSelection } from "@/features/view/hooks/modals/Sizing/useBrandSelection";
import { useSuplierSelection } from "@/features/view/hooks/modals/Sizing/useSupplierSelection";

export function AddEquipoModal({ existingEquipos, onAddEquipos, onClose }: AddEquipoModalProps) {
    
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    // usar información de la tabla
    const { type } = useTypes();
    const { brand } = useBrands();
    const { supplier } = useProveedores();    
    // valores iniciales
    const [form, setForm] = useState<EquiposFormState>(INITIAL_EQUIPOS_FORM);
    const [form_tipo, setForm_tipo] = useState<TypeFormstate>(INITIAL_TYPE_FORM);
    const [form_marca, setForm_marca] = useState<BrandFormstate>(INITIAL_BRAND_FORM);
    const [form_proveedor, setForm_proveedor] = useState<SupplierFormstate>(INITIAL_SUPPLIER_FORM);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    const selectedType = form_tipo.nombre;
    const selectedBrand = form_marca.nombre;
    const selectedSupplier = form_proveedor.nombre;

    // ----------------------------------------
    // ------- CONDICIONAMIENTO ---------------
    // ----------------------------------------
    
    const cascadeOptions = useMemo(
        () => getModalCascadeOptions(existingEquipos, form.proveedor, form.marca),
        [existingEquipos, form.proveedor, form.marca],
    );

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------
    
    // Actualizar campos del formulario
    function updateField<K extends keyof EquiposFormState>(field: K, value: EquiposFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };

            if (field === "proveedor" || field === "marca" || field === "tipo_de_producto") {
                const cascaded = resolveFormCascadeFilters(
                    existingEquipos,
                    current,
                    field,
                    String(value),
                );
                updated.proveedor = cascaded.proveedor;
                updated.marca = cascaded.marca;
                updated.tipo_de_producto = cascaded.tipo_de_producto;
            }

            if (field === "proveedor" || updated.proveedor !== current.proveedor) {
                const { supplierCode } = shouldRender_SupplyInfoSelection(String(updated.proveedor));
                updated.cod_prov = supplierCode;
            }

            if (field === "tipo_de_producto" || updated.tipo_de_producto !== current.tipo_de_producto) {
                const { unit } = shouldRender_EquipoInfoSelection(String(updated.tipo_de_producto));
                updated.unidad = unit || "";
            }

            if (updated.tipo_de_producto === "BATERÍA") {
                updated.tipo_conexion = "BAT";
            }

            return updated;
        });
    }    

    const supplierEquipoCount = existingEquipos.filter((equipo) => equipo.proveedor === form.proveedor).length;
    const generatedCode = buildProductCode(form.tipo_de_producto, form.proveedor, supplierEquipoCount + 1);

    // Aceptar insercion
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddEquipos({
            ...form,
            cod_producto: generatedCode || form.cod_producto, // añadir código generado
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Equipo</h2>
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
                                    label="PROVEEDOR"
                                    required
                                    value={form_proveedor.nombre ?? ""}
                                    options={[
                                        "Seleccione proveedor",
                                        ...supplier
                                            .filter((s) => s.categoria === "Equipos" || s.categoria === "Ambas")
                                            .map((s) => s.nombre ?? ""),
                                    ]}
                                    onChange={(value) => useSuplierSelection(value, supplier, setForm_proveedor, setForm)}
                                />
                                {selectedSupplier && (
                                    <>
                                    <AddProductReadonlyField
                                        label="COD PROV"
                                        value={form.cod_prov}
                                    />
                                    <AddProductSelectField
                                        label="MARCA"
                                        required
                                        value={form_marca.nombre ?? ""}
                                        options={["Seleccione marca", ...brand.map((b) => b.nombre ?? "")]}
                                        onChange={(value) => useBrandSelection(value, brand, setForm_marca, setForm)}
                                    />
                                    {selectedBrand && (
                                        <>
                                        <AddProductSelectField
                                            label="TIPO DE PRODUCTO"
                                            required
                                            value={form_tipo.nombre ?? ""}
                                            options={["Seleccione tipo de producto", ...type.map((t) => t.nombre ?? "")]}
                                            onChange={(value) => useTypeSelection(value, type, setForm_tipo, setForm)}
                                        />
                                        {selectedType && (
                                            <>
                                            <AddProductReadonlyField
                                                label="UNIDAD"
                                                value={form.unidad}
                                            />
                                            <div className="md:col-span-2">
                                                <AddProductTextAreaField
                                                    label="Descripción"
                                                    required
                                                    placeholder="Descripción detallada del producto"
                                                    value={form.descripcion}
                                                    onChange={(value) => updateField("descripcion", value)}
                                                />
                                            </div>
                                            </>
                                            
                                        )}
                                        </>
                                    )}
                                    </>
                                )}
                            </div>
                    </section>
                    
                    {(selectedSupplier && selectedBrand && selectedType) && (
                        <>
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
                            
                            {/* Precios */}
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
                        </>
                    )}
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
                    className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                    >
                    Añadir Equipo
                    </button>
                </div>
                </form>
            </div>
        </div>    
    );
}