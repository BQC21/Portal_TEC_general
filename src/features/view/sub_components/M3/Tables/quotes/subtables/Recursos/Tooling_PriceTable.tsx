import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { QuantityPriceItem } from "@/lib/types/components/Quotes/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";

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
                                </tr>
                            </thead>
                            <tbody>
                                {/* Permitir un CRUD interno (solo agregar / eliminar) */}
                                <tr className="bg-slate-100 text-left">
                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductTextField
                                            label="Descripción"
                                            value={items[0].descripcion}
                                            onChange={(value) => onUpdateItem(0, "descripcion", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Cantidad"
                                            value={Number(items[0].cantidad)} min={0}
                                            onChange={(value) => onUpdateItem(0, "cantidad", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Precio Unidad (s/.)"
                                            value={Number(items[0].precio_unitario)} min={0}
                                            onChange={(value) => onUpdateItem(0, "precio_unitario", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {/* El precio total se calcula como la cantidad por el precio unitario */}
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(items[0].cantidad) * 
                                                Number(items[0].precio_unitario), "PEN")}
                                        />
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    )
}