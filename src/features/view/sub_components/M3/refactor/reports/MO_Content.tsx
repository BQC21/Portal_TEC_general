import { useState } from "react";
import { EditIcon } from "@/features/view/components/Icons/EditIcon";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { MOActivity, MO_Content_Props } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

export function MO_Content({
    title, precioFinal, MO,
    activities,
    onToggleActivityVisibility,
    onAddActivity,
    onUpdateActivity,
    onRemoveActivity,
}: MO_Content_Props){
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState("");

    function startEdit(item: MOActivity) {
        setEditingId(item.id);
        setDraft(item.descripcion);
    }

    function commitEdit() {
        if (!editingId) return;
        const next = draft.trim();
        if (next) onUpdateActivity?.(editingId, next);
        setEditingId(null);
        setDraft("");
    }

    function cancelEdit() {
        setEditingId(null);
        setDraft("");
    }

    return(
        <>
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-2xl font-bold uppercase">
                        {title}
                    </h2>

                    <div className="flex items-center gap-6 text-2xl font-bold">
                        <button
                            type="button"
                            onClick={onAddActivity}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-lg font-semibold text-white transition hover:bg-blue-700"
                        >
                            + Actividad
                        </button>
                        <span>{formatCurrency(precioFinal * MO / 100, "USD")}</span>
                    </div>
                </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        {/* PUESTA EN MARCHA */}
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-white text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción - PUESTA EN MARCHA
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-center text-[1.02rem] font-bold text-slate-900">
                                        MOSTRAR EN PDF
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-center text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length > 0 ? (
                                    activities.map((item) => {
                                        const isEditing = editingId === item.id;
                                        return (
                                            <tr
                                                key={item.id}
                                                className={item.visible ? "bg-white" : "bg-slate-50 text-slate-400"}
                                            >
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {isEditing ? (
                                                        <input
                                                            autoFocus
                                                            value={draft}
                                                            onChange={(event) => setDraft(event.target.value)}
                                                            onBlur={commitEdit}
                                                            onKeyDown={(event) => {
                                                                if (event.key === "Enter") {
                                                                    event.preventDefault();
                                                                    commitEdit();
                                                                }
                                                                if (event.key === "Escape") {
                                                                    event.preventDefault();
                                                                    cancelEdit();
                                                                }
                                                            }}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-base text-slate-900"
                                                            aria-label="Editar actividad"
                                                        />
                                                    ) : (
                                                        item.descripcion
                                                    )}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.visible}
                                                        onChange={() => onToggleActivityVisibility?.(item.id)}
                                                        aria-label={`Mostrar ${item.descripcion || "Puesta en marcha"} en el PDF`}
                                                        className="h-5 w-5 accent-orange-500"
                                                    />
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEdit(item)}
                                                            className="table-icon-button text-blue-600"
                                                            aria-label={`Editar ${item.descripcion}`}
                                                        >
                                                            <EditIcon />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onRemoveActivity?.(item.id)}
                                                            className="table-icon-button text-red-600"
                                                            aria-label={`Eliminar ${item.descripcion}`}
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                                            No hay Puesta en marcha a mostrarse todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
            </section>
        </>
    )
}
