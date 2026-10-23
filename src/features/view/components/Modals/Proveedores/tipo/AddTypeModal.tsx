"use client";

import { AddTypeModalProps } from "@/lib/types/components/General/modals";
import { INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { Category } from "@/lib/utils/options";
import { useEffect, useRef, useState } from "react";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { useBrands } from "@/features/ViewModel/hooks/services/useRealtimeMarcas";
import { useBrandSelectionHandlers } from "@/features/ViewModel/hooks/modals/proveedores/useBrandSelectionHandlers";
import { applySelectedBrandsToType, findDefaultBrand, toSelectedBrandItem } from "@/lib/utils/helpers/project_modals/brandOptions";
import { General_info_Type } from "@/features/view/refactor/M1/refactor_proveedores/General_info_Type";
import { Selectors_Type } from "@/features/view/refactor/M1/refactor_proveedores/Selectors_Type";
import { Tables_Type } from "@/features/view/refactor/M1/refactor_proveedores/Tables_Type";
import { Properties_Type } from "@/features/view/refactor/M1/refactor_proveedores/Properties_Type";
import { TypeProperty } from "@/lib/utils/consts/typeProperties";
import { ensureTypePropertyColumns } from "@/features/model/services/catalogColumn";

export default function AddTypeModal({ onAddType, onClose }: AddTypeModalProps) {

    // Hooks
    const { brand } = useBrands();
    
    // Estados
    const [form_type, setForm_type] = useState<TypeFormstate>({
        ...INITIAL_TYPE_FORM,
        categoria: Category[0],
    });
    
    // Selector de marcas
    const {
        selectedBrandByRow,
        selectedBrandTable,
        setSelectedBrandTable,
        brandOptions,
        handleBrandChange,
        handleAddBrand,
    } = useBrandSelectionHandlers({
        brand,
        typeCategoria: form_type.categoria,
    });
    const seededDefaultBrand = useRef(false);

    // propiedades
    const [properties, setProperties] = useState<TypeProperty[]>([]);
    const [propertyError, setPropertyError] = useState("");

    // Sincronización
    useEffect(() => {
        if (seededDefaultBrand.current) return;
        const found = findDefaultBrand(brand);
        if (!found) return;
        seededDefaultBrand.current = true;
        setSelectedBrandTable((current) => {
            if (current.length > 0 || current.some((item) => item.id === String(found.id))) return current;
            return [toSelectedBrandItem(found)];
        });
    }, [brand, setSelectedBrandTable]);

    // Actualizar formularios
    function updateField<K extends keyof TypeFormstate>(field: K, value: TypeFormstate[K]) {
        setForm_type((current) => ({ ...current, [field]: value }));
    }

    // Handler
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!form_type.nombre?.trim() || !form_type.categoria?.trim()) return;
        setPropertyError("");
        try {
            await ensureTypePropertyColumns(form_type.categoria, properties);
        } catch (error) {
            setPropertyError(error instanceof Error ? error.message : "No se pudo crear la propiedad.");
            return;
        }
        onAddType(applySelectedBrandsToType({ ...form_type, propiedades: properties }, selectedBrandTable));
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nuevo tipo de producto</h2>
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
                    <General_info_Type form={form_type} updateField={updateField} />
                    <Selectors_Type
                        selectedBrandByRow={selectedBrandByRow}
                        brandOptions={brandOptions}
                        handleBrandChange={handleBrandChange}
                        handleAddBrand={handleAddBrand}
                    />
                    <Tables_Type
                        selectedBrandTable={selectedBrandTable}
                        setSelectedBrandTable={setSelectedBrandTable}
                    />
                    <Properties_Type
                        categoria={form_type.categoria}
                        properties={properties}
                        onChange={setProperties}
                    />
                    {propertyError ? (
                        <p className="mx-auto mt-2 max-w-7xl px-3 text-sm font-medium text-red-600 sm:px-6 lg:px-8">
                            {propertyError}
                        </p>
                    ) : null}
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
                            Añadir Tipo de producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
