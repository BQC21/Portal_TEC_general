"use client";

import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { AddProductCloseIcon } from "../../Icons/AddCloseIcon";
import {
    INITIAL_BRAND_FORM,
    INITIAL_EQUIPOS_FORM,
    INITIAL_SUPPLIER_FORM,
    INITIAL_TYPE_FORM,
} from "@/lib/utils/initialValues";
import { useMemo, useState } from "react";
import { buildNextProductCode } from "@/lib/utils/helpers/render/render_codeProduct";
import { AddEquipoModalProps } from "@/lib/types/components/modals";
import { useTypes } from "@/features/view/hooks/services/useRealtimeTipos";
import { useBrands } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores } from "@/features/view/hooks/services/useRealtimeProveedores";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { BrandFormstate } from "@/lib/types/supabase/brand.types";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { useTypeSelection } from "@/features/view/hooks/modals/equipos/useTypeSelection";
import { useBrandSelection } from "@/features/view/hooks/modals/equipos/useBrandSelection";
import { useSuplierSelection } from "@/features/view/hooks/modals/equipos/useSupplierSelection";
import { Data_info_M1 } from "@/features/view/sub_components/M1/Data_info_M1";
import { General_info_M1_EQ } from "@/features/view/sub_components/M1/refactor_equipos/General_info_M1";
import { Price_info_M1 } from "@/features/view/sub_components/M1/Price_info_M1";
import { getModalCascadeOptions } from "@/lib/utils/helpers/filters/cascadeFilterOptions";

export function AddEquipoModal({ existingEquipos, onAddEquipos, onClose }: AddEquipoModalProps) {
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    const { type } = useTypes();
    const { brand } = useBrands();
    const { supplier } = useProveedores();

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
    // ------- EVENTOS ------------------------
    // ----------------------------------------
    function updateField<K extends keyof EquiposFormState>(
        field: K, 
        value: EquiposFormState[K]
    ) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    // Opciones en cascada
    const cascadeOptions = useMemo(
        () => getModalCascadeOptions(existingEquipos, form.proveedor, form.marca),
        [existingEquipos, form.proveedor, form.marca],
    );

    // Generación automático para el código del producto
    const generatedCode = buildNextProductCode(
        existingEquipos,
        form.tipo_de_producto,
        form.proveedor,
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddEquipos({
            ...form,
            cod_producto: generatedCode || form.cod_producto,
        });
    }

    // // ----------------------------
    // // ------- Logs ---------------
    // // ----------------------------
    // console.log({
    //     formProveedor: form.proveedor,
    //     cascadeBrands: cascadeOptions.brands,
    //     proveedoresEnEquipos: [...new Set(existingEquipos.map(e => e.proveedor))],
    // });

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
                        <Data_info_M1
                            form={form}
                            setForm={(value) => setForm(value as EquiposFormState)}
                            cascadeOptions={cascadeOptions}
                            form_proveedor={form_proveedor}
                            form_marca={form_marca}
                            form_tipo={form_tipo}
                            setForm_proveedor={setForm_proveedor}
                            setForm_marca={setForm_marca}
                            setForm_tipo={setForm_tipo}
                            selectedSupplier={selectedSupplier}
                            selectedBrand={selectedBrand}
                            selectedType={selectedType}
                            supplier={supplier}
                            brand={brand}
                            type={type}
                            productCategory="Equipos"
                            useSuplierSelection={(value, supplierList, setProveedor, setProductForm) => {
                                useSuplierSelection(
                                    value,
                                    supplierList,
                                    setProveedor,
                                    setProductForm as typeof setForm,
                                );
                                setForm_marca(INITIAL_BRAND_FORM);
                                setForm_tipo(INITIAL_TYPE_FORM);
                            }}
                            useBrandSelection={(value, brandList, setMarca, setProductForm) => {
                                useBrandSelection(
                                    value,
                                    brandList,
                                    setMarca,
                                    setProductForm as typeof setForm,
                                );
                                setForm_tipo(INITIAL_TYPE_FORM);
                            }}
                            useTypeSelection={(value, typeList, setTipo, setProductForm) => {
                                useTypeSelection(
                                    value,
                                    typeList,
                                    setTipo,
                                    setProductForm as typeof setForm,
                                );
                            }}
                            updateField={(field, value) => {
                                updateField(
                                    field as keyof EquiposFormState,
                                    value as EquiposFormState[keyof EquiposFormState],
                                );
                            }}
                        />

                        {selectedSupplier && selectedBrand && selectedType && (
                            <>
                                <General_info_M1_EQ
                                    form={form}
                                    updateField={updateField}
                                />
                                <Price_info_M1
                                    form={form}
                                    updateField={(field, value) => {
                                        updateField(
                                            field as keyof EquiposFormState,
                                            value as EquiposFormState[keyof EquiposFormState],
                                        );
                                    }}
                                />
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
