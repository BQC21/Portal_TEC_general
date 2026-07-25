"use client";

import { useEffect, useState } from "react";
import { AddProductCloseIcon } from "@/features/view/components/Icons/AddCloseIcon";
import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { createEquiposFormStateFromEquipos } from "@/lib/mapping/mapping_equipos";
import { EditEquipoModalProps } from "@/lib/types/components/modals";
import {
    INITIAL_BRAND_FORM,
    INITIAL_SUPPLIER_FORM,
    INITIAL_TYPE_FORM,
} from "@/lib/utils/initialValues";
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

function buildSupplierForm(equipo: EquiposFormState): SupplierFormstate {
    if (equipo.proveedor_info) {
        const info = equipo.proveedor_info;
        return {
            nombre: info.nombre,
            ruc: info.ruc,
            contacto: info.contacto,
            telefono: info.telefono,
            categoria: info.categoria,
            codigo: info.codigo,
            created_at: info.created_at,
            updated_at: info.updated_at,
        };
    }

    return {
        ...INITIAL_SUPPLIER_FORM,
        nombre: equipo.proveedor,
        codigo: equipo.cod_prov,
    };
}

function buildBrandForm(equipo: EquiposFormState): BrandFormstate {
    if (equipo.marca_info) {
        const info = equipo.marca_info;
        return {
            nombre: info.nombre,
            categoria: info.categoria,
            created_at: info.created_at,
            updated_at: info.updated_at,
        };
    }

    return {
        ...INITIAL_BRAND_FORM,
        nombre: equipo.marca,
    };
}

function buildTypeForm(equipo: EquiposFormState): TypeFormstate {
    if (equipo.tipo_info) {
        const info = equipo.tipo_info;
        return {
            nombre: info.nombre,
            categoria: info.categoria,
            created_at: info.created_at,
            updated_at: info.updated_at,
        };
    }

    return {
        ...INITIAL_TYPE_FORM,
        nombre: equipo.tipo_de_producto,
    };
}

export function EditEquipoModal({ equipo, onUpdateEquipo, onClose }: EditEquipoModalProps) {
    // ----------------------------
    // ------- Estados ------------
    // ----------------------------
    const { type } = useTypes();
    const { brand } = useBrands();
    const { supplier } = useProveedores();

    const [form, setForm] = useState<EquiposFormState>(() => createEquiposFormStateFromEquipos(equipo));
    const [form_tipo, setForm_tipo] = useState<TypeFormstate>(() =>
        buildTypeForm(createEquiposFormStateFromEquipos(equipo)),
    );
    const [form_marca, setForm_marca] = useState<BrandFormstate>(() =>
        buildBrandForm(createEquiposFormStateFromEquipos(equipo)),
    );
    const [form_proveedor, setForm_proveedor] = useState<SupplierFormstate>(() =>
        buildSupplierForm(createEquiposFormStateFromEquipos(equipo)),
    );

    useEffect(() => {
        const nextForm = createEquiposFormStateFromEquipos(equipo);
        setForm(nextForm);
        setForm_proveedor(buildSupplierForm(nextForm));
        setForm_marca(buildBrandForm(nextForm));
        setForm_tipo(buildTypeForm(nextForm));
    }, [equipo]);

    // ----------------------------------------
    // ------- INFORMACIÓN SELECTA ------------
    // ----------------------------------------
    const selectedType = form_tipo.nombre;
    const selectedBrand = form_marca.nombre;
    const selectedSupplier = form_proveedor.nombre;

    // ----------------------------------------
    // ------- EVENTOS ------------------------
    // ----------------------------------------
    function updateField<K extends keyof EquiposFormState>(field: K, value: EquiposFormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onUpdateEquipo({
            id: equipo.id,
            ...form,
            updated_at: new Date(),
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
                        <Data_info_M1
                            form={form}
                            setForm={(value) => setForm(value as EquiposFormState)}
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
                            Actualizar Equipo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
