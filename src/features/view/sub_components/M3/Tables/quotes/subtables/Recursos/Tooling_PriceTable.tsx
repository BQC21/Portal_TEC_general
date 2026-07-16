import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { QuantityPriceItem } from "@/lib/types/components/Quotes/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";
import { PlusIcon } from "@/features/view/components/Icons/PlusIcon";
import { TrashIcon } from "@/features/view/components/Icons/TrashIcon";

export function Tooling_PriceTable({ items, onUpdateItem, onAddItem, onRemoveItem }: { 
    items: QuantityPriceItem[], 
    onUpdateItem: (
        index: number, 
        field: keyof QuantityPriceItem, 
        value: QuantityPriceItem[keyof QuantityPriceItem]
    ) => void,
    onAddItem: () => void,
    onRemoveItem: (index: number) => void,
}){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Herramientas</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Cantidad
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Unidad (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.)
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                    <tr key={item.id} className="bg-slate-100 text-left">
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductTextField
                                            label="Descripción"
                                            value={item.descripcion}
                                            onChange={(value) => onUpdateItem(index, "descripcion", value)}
                                        />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductNumberField
                                                label="Cantidad"
                                                value={Number(item.cantidad)} min={0}
                                                onChange={(value) => onUpdateItem(index, "cantidad", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductNumberField
                                                label="Precio Unidad (s/.)"
                                                value={Number(item.precio_unitario)} min={0}
                                                onChange={(value) => onUpdateItem(index, "precio_unitario", value)}
                                            />
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            <AddProductReadonlyField
                                                label="Precio Total (s/.)"
                                                value={formatCurrency(Number(item.cantidad) * Number(item.precio_unitario), "PEN")}
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