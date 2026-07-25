"use client";

import { AddProductCloseIcon } from "../../Icons/AddCloseIcon";
import {
    INITIAL_BRAND_FORM,
    INITIAL_MATERIALES_FORM,
    INITIAL_SUPPLIER_FORM,
    INITIAL_TYPE_FORM,
} from "@/lib/utils/initialValues";
import { useState } from "react";
import { MaterialesFormState } from "@/lib/types/supabase/materiales-types";
import { buildProductCode } from "@/lib/utils/helpers/render/render_codeProduct";
import { AddMaterialModalProps } from "@/lib/types/components/modals";
import { useBrands } from "@/features/view/hooks/services/useRealtimeMarcas";
import { BrandFormstate } from "@/lib/types/supabase/brand.types";
import { useTypes } from "@/features/view/hooks/services/useRealtimeTipos";
import { useProveedores } from "@/features/view/hooks/services/useRealtimeProveedores";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { useSuplierSelection } from "@/features/view/hooks/modals/materiales/useSupplierSelection";
import { useBrandSelection } from "@/features/view/hooks/modals/materiales/useBrandSelection";
import { useTypeSelection } from "@/features/view/hooks/modals/materiales/useTypeSelection";
import { Data_info_M1 } from "@/features/view/sub_components/M1/Data_info_M1";
import { General_info_M1_MAT } from "@/features/view/sub_components/M1/refactor_materiales/General_info_M1";
import { Price_info_M1 } from "@/features/view/sub_components/M1/Price_info_M1";

export function AddMaterialModal({
    existingMateriales,
    onAddMateriales,
    onClose,
}: AddMaterialModalProps) {
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    const { type } = useTypes();
    const { brand } = useBrands();
    const { supplier } = useProveedores();

    const [form, setForm] = useState<MaterialesFormState>(INITIAL_MATERIALES_FORM);
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
    function updateField<K extends keyof MaterialesFormState>(
        field: K,
        value: MaterialesFormState[K],
    ) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    const supplierProductCount = existingMateriales.filter(
        (material) => material.proveedor === form.proveedor,
    ).length;
    const generatedCode = buildProductCode(
        form.tipo_de_producto,
        form.proveedor,
        supplierProductCount + 1,
    );

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onAddMateriales({
            ...form,
            cod_producto: generatedCode || form.cod_producto,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo Material</h2>
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
                            setForm={(value) => setForm(value as MaterialesFormState)}
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
                            productCategory="Materiales"
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
                                    field as keyof MaterialesFormState,
                                    value as MaterialesFormState[keyof MaterialesFormState],
                                );
                            }}
                        />

                        {selectedSupplier && selectedBrand && selectedType && (
                            <>
                                <General_info_M1_MAT
                                    form={form}
                                    updateField={updateField}
                                />
                                <Price_info_M1
                                    form={form}
                                    updateField={(field, value) => {
                                        updateField(
                                            field as keyof MaterialesFormState,
                                            value as MaterialesFormState[keyof MaterialesFormState],
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
                            Añadir Material
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
