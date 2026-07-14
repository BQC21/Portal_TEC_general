import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { AddProductNumberField } from "../../components/Form_fields/AddNumberField";
import { SetStateAction } from "react";
import { computedRequirements } from "@/lib/types/components/Sizing/computes";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

export type Tables_M2_props = {
    selectedEquipmentTable: SelectedEquipmentItem[],
    setSelectedEquipmentTable: (value: SetStateAction<SelectedEquipmentItem[]>) => void,
    selectedMaterialTable: SelectedMaterialItem[],
    setSelectedMaterialTable: (value: SetStateAction<SelectedMaterialItem[]>) => void,
    computedRequirements: computedRequirements,
    form: ProjectFormState
}

export function Tables_M2({selectedEquipmentTable, setSelectedEquipmentTable,
    selectedMaterialTable, setSelectedMaterialTable, computedRequirements, form}: Tables_M2_props){
    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Equipos principales seleccionados</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Equipo seleccionado
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedEquipmentTable.length > 0 ? (
                                    selectedEquipmentTable.map((item) => (
                                        <tr key={`${item.row}-${item.id}`} className="bg-white">
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.description}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <AddProductNumberField
                                                    label="ingrese cantidad"
                                                    required
                                                    value={Number(item.cantidad ?? 0)}
                                                    onChange={(value) =>
                                                        setSelectedEquipmentTable((curr) =>
                                                            curr.map((r) =>
                                                                r.row === item.row && r.id === item.id ? 
                                                                    { ...r, cantidad: Number(value.toFixed(0)) } : r,
                                                            ),
                                                        )
                                                    }
                                                    step={1} min={0} max={item.row === "ESTRUCTURA" && item.description.includes("baterías") ?
                                                        Math.floor(Number(computedRequirements.num_baterias)/
                                                            parseInt(item.description.match(/\d+/)?.[0] || "0" || ""))  :
                                                        item.row === "ESTRUCTURA" && item.description.includes("módulos") ? 
                                                        Math.floor(Number((form.strings))/parseInt(item.description.match(/\d+/)?.[0] || "0" || "")) :
                                                        100000}
                                                    disabled={item.row === "INVERSOR" || item.row === "MÓDULO FV" ||
                                                        item.row === "BATERÍA"}
                                                />
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEquipmentTable((current) =>
                                                            current.filter((row) => !(row.row === item.row && row.id === item.id)),
                                                        );
                                                    }}
                                                    className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                            No hay equipos seleccionados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Materiales eléctricos seleccionados</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Material seleccionado
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMaterialTable.length > 0 ? (
                                    selectedMaterialTable.map((item) => (
                                        <tr key={`${item.row}-${item.id}`} className="bg-white">
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                {item.description}
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                <AddProductNumberField
                                                    label="ingrese cantidad"
                                                    required
                                                    value={Number(item.cantidad ?? 0)}
                                                    onChange={(value) => 
                                                        setSelectedMaterialTable((curr) => 
                                                            curr.map((r) => 
                                                                r.row === item.row && r.id === item.id ?
                                                                    { ...r, cantidad: Number(value) } : r
                                                            ),
                                                        )
                                                    }
                                                    step={1} min={0}
                                                    disabled={item.row === "MC4" && item.description.includes("MC4")}
                                                />
                                            </td>
                                            <td className="border-b border-slate-200 px-4 py-5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMaterialTable((current) =>
                                                            current.filter((row) => row.id !== item.id),
                                                        );
                                                    }}
                                                    className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={2} className="px-4 py-10 text-center text-slate-500">
                                            No hay materiales seleccionados todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}