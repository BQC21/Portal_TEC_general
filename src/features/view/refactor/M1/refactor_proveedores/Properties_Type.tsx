"use client";

import { useMemo, useState } from "react";
import { TypeProperty } from "@/lib/utils/consts/typeProperties";
import {
    catalogPropertiesForCategory,
    isValidColumnName,
    suggestColumnName,
} from "@/lib/utils/helpers/render/EP_MAT_tables";

type Properties_TypeProps = {
    categoria?: string;
    properties: TypeProperty[];
    onChange: (properties: TypeProperty[]) => void;
};

export function Properties_Type({ categoria, properties, onChange }: Properties_TypeProps) {
    const [selectedColumn, setSelectedColumn] = useState("");
    const [newLabel, setNewLabel] = useState("");
    const [newColumn, setNewColumn] = useState("");
    const [columnEdited, setColumnEdited] = useState(false);

    const available = useMemo(() => {
        const selected = new Set(properties.map((property) => property.columna));
        return catalogPropertiesForCategory(categoria).filter(
            (property) => !selected.has(property.columna),
        );
    }, [categoria, properties]);

    function addExisting() {
        const property = available.find((item) => item.columna === selectedColumn);
        if (!property) return;
        onChange([...properties, property]);
        setSelectedColumn("");
    }

    function addNew() {
        const etiqueta = newLabel.trim();
        const columna = (newColumn || suggestColumnName(etiqueta)).trim();
        if (!etiqueta || !isValidColumnName(columna)) return;
        if (properties.some((property) => property.columna === columna)) return;
        onChange([...properties, { etiqueta, columna }]);
        setNewLabel("");
        setNewColumn("");
        setColumnEdited(false);
    }

    function updateNewLabel(value: string) {
        setNewLabel(value);
        if (!columnEdited) setNewColumn(suggestColumnName(value));
    }

    const newColumnValue = newColumn || (newLabel ? suggestColumnName(newLabel) : "");
    const canAddNew = Boolean(newLabel.trim()) && isValidColumnName(newColumnValue);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Propiedades específicas</h2>
                    <p className="max-w-md text-sm text-slate-500">
                        Para el nombre de la base de datos sugerimos letras en minúsculas y evitar separaciones.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <label className="min-w-0 flex-1 space-y-2">
                        <span className="block text-sm font-semibold text-slate-600">Propiedades asociadas</span>
                        <select
                            value={selectedColumn}
                            onChange={(event) => setSelectedColumn(event.target.value)}
                            className="input-focus w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
                        >
                            <option value="">Seleccionar - Propiedades específicas</option>
                            {available.map((property) => (
                                <option key={property.columna} value={property.columna}>
                                    {property.etiqueta}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={addExisting}
                        disabled={!selectedColumn}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Agregar
                    </button>
                </div>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                    <label className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-600">Nueva propiedad</span>
                        <input
                            value={newLabel}
                            onChange={(event) => updateNewLabel(event.target.value)}
                            placeholder="Nombre en la tabla"
                            className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900"
                        />
                    </label>
                    <label className="space-y-2">
                        <span className="block text-sm font-semibold text-slate-600">Nombre en la base de datos</span>
                        <input
                            value={newColumnValue}
                            onChange={(event) => {
                                setColumnEdited(true);
                                setNewColumn(event.target.value.toLowerCase());
                            }}
                            placeholder="nombre_columna"
                            className="input-focus w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={addNew}
                        disabled={!canAddNew}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Agregar
                    </button>
                </div>
            </section>
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Propiedades asociadas</h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="bg-slate-100">
                            <tr className="text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Nombre en la tabla
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Nombre en la Base de datos
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.length > 0 ? (
                                properties.map((property) => (
                                    <tr key={property.columna} className="bg-white">
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            {property.etiqueta}
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            {property.columna}
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onChange(properties.filter((item) => item.columna !== property.columna))
                                                }
                                                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                                        No hay propiedades seleccionadas todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
