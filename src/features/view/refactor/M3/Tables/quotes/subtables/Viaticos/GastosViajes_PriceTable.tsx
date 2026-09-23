import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";
import { GastosViajes_PriceTable_props } from "@/lib/types/components/Quotes/Quote_tables";
import { formatCurrency } from "@/lib/utils/normalization";

export function GastosViajes_PriceTable({ items, onUpdateItem, onAddItem, onRemoveItem }: GastosViajes_PriceTable_props){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Gastos de viaje</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Monto (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Personas
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Días
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {items.length > 0 ? (
                                    items.map((item, index) => (
                                    <tr key={item.id} className="bg-slate-100 text-left">
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductTextField
                                                label=""
                                                value={item.descripcion}
                                                onChange={(value) => onUpdateItem(index, "descripcion", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductNumberField
                                                label=""
                                                value={Number(item.monto)} min={0} step={0.01}
                                                onChange={(value) => onUpdateItem(index, "monto", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductNumberField
                                                label=""
                                                value={Number(item.personas)} min={0} step={1}
                                                onChange={(value) => onUpdateItem(index, "personas", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductNumberField
                                                label=""
                                                value={Number(item.dias)} min={0} step={1}
                                                onChange={(value) => onUpdateItem(index, "dias", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductReadonlyField
                                                label=""
                                                value={formatCurrency(Number(item.monto) 
                                                    * Number(item.personas)
                                                    * Number(item.dias), "PEN")}
                                            />
                                        </td>
                                        {/* Nueva celda de eliminar */}
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <button
                                            type="button"
                                            onClick={() => onRemoveItem(index)}
                                            className="table-icon-button"
                                            aria-label="Eliminar ítem"
                                        >
                                            <TrashIcon />
                                        </button>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                            No hay ítems registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-start px-2 pt-3">
                            <button
                                type="button"
                                onClick={onAddItem}
                                className="table-icon-button"
                                aria-label="Agregar ítem"
                            >
                                <PlusIcon />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}