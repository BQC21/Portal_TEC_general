"use client";

import { useEffect, useMemo, useState } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextAreaField } from "@/features/view/components/Form_fields/AddTextAreaField";

import { POWER_SOURCE_OPTIONS, SUPPLIER_CODE_OPTIONS_MATERIALES } from "@/lib/utils/options";

import { 
    shouldRender_SupplyInfoSelection,
} from "@/lib/utils/helpers/render/render_modals";

import { MaterialesFormState } from "@/lib/types/supabase/materiales-types";
import { createMaterialesFormStateFromMateriales } from "@/lib/mapping/mapping_materiales";
import { shouldRender_MaterialInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";
import { EditMaterialModalProps } from "@/lib/types/components/modals";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
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
import { buildBrandForm, buildSupplierForm, buildTypeForm } from "@/lib/utils/helpers/buildForm/buildForm_functions";
import { buildNextProductCode } from "@/lib/utils/helpers/render/render_codeProduct";
import { General_info_M1_MAT } from "@/features/view/sub_components/M1/refactor_materiales/General_info_M1";
import { Price_info_M1 } from "@/features/view/sub_components/M1/Price_info_M1";
import { Data_info_M1 } from "@/features/view/sub_components/M1/Data_info_M1";
import { INITIAL_BRAND_FORM, INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { useSuplierSelection } from "@/features/view/hooks/modals/materiales/useSupplierSelection";
import { useBrandSelection } from "@/features/view/hooks/modals/materiales/useBrandSelection";
import { useTypeSelection } from "@/features/view/hooks/modals/materiales/useTypeSelection";
import { getMaterialSupplierCascade } from "@/lib/utils/helpers/filters/supplierCascadeMap";

export function EditMaterialModal({ material, onUpdateMaterial, onClose }: EditMaterialModalProps) {
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    const { type } = useTypes();
    const { brand } = useBrands();
    const { supplier } = useProveedores();
    const { materiales: existingMateriales } = useMateriales();

    const [form, setForm] = useState<MaterialesFormState>(() => createMaterialesFormStateFromMateriales(material));
    const [form_tipo, setForm_tipo] = useState<TypeFormstate>(() =>
        buildTypeForm(createMaterialesFormStateFromMateriales(material)),
    );
    const [form_marca, setForm_marca] = useState<BrandFormstate>(() =>
        buildBrandForm(createMaterialesFormStateFromMateriales(material)),
    );
    const [form_proveedor, setForm_proveedor] = useState<SupplierFormstate>(() =>
        buildSupplierForm(createMaterialesFormStateFromMateriales(material)),
    );

    useEffect(() => {
        const nextForm = createMaterialesFormStateFromMateriales(material);
        setForm(nextForm);
        setForm_proveedor(buildSupplierForm(nextForm));
        setForm_marca(buildBrandForm(nextForm));
        setForm_tipo(buildTypeForm(nextForm));
    }, [material]);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    const selectedType = form_tipo.nombre;
    const selectedBrand = form_marca.nombre;
    const selectedSupplier = form_proveedor.nombre;

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------

    // Actualizar campos del formulario
    function updateField<K extends keyof MaterialesFormState>(
        field: K,
        value: MaterialesFormState[K],
    ) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    // Cascada por datos + override estático (mismo criterio que AddMaterialModal)
    const cascadeOptions = useMemo(() => {
        const fromData = getModalCascadeOptions(
            existingMateriales,
            form.proveedor,
            form.marca,
        );
        const staticCascade = getMaterialSupplierCascade(form.proveedor);

        if (!staticCascade) return fromData;

        return {
            ...fromData,
            brands:
                fromData.brands.length > 0 ? fromData.brands : staticCascade.brands,
            types: form.marca ? staticCascade.types : [],
        };
    }, [existingMateriales, form.proveedor, form.marca]);

    // Código de producto dinámico al cambiar proveedor / tipo
    const generatedCode = useMemo(() => {
        if (!form.proveedor || !form.tipo_de_producto) return "";

        const unchanged =
            form.proveedor === material.proveedor &&
            form.tipo_de_producto === material.tipo_de_producto;

        if (unchanged) return material.cod_producto;

        return buildNextProductCode(
            existingMateriales.filter((item) => item.id !== material.id),
            form.tipo_de_producto,
            form.proveedor,
        );
    }, [
        existingMateriales,
        form.proveedor,
        form.tipo_de_producto,
        material.id,
        material.proveedor,
        material.tipo_de_producto,
        material.cod_producto,
    ]);

    // generación automática de código
    useEffect(() => {
        setForm((current) => {
            const nextCode = generatedCode;
            // Si aún no hay tipo (p. ej. tras cambiar proveedor), limpiar código obsoleto
            if (!form.tipo_de_producto) {
                return current.cod_producto === ""
                    ? current
                    : { ...current, cod_producto: "" };
            }
            if (!nextCode || current.cod_producto === nextCode) return current;
            return { ...current, cod_producto: nextCode };
        });
    }, [generatedCode, form.tipo_de_producto]);

    // Aceptar actualizacion
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateMaterial({
            id: material.id,
            ...form,
            cod_producto: generatedCode || form.cod_producto,
            updated_at: new Date(),
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
                    <Data_info_M1
                        form={form}
                        setForm={(value) => setForm(value as MaterialesFormState)}
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
                        productCategory="Materiales"
                        showProductCode
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
                    Actualizar Material
                </button>
                </div>
            </form>
            </div>
        </div>
    );
}