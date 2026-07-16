import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { ManualResourceCosts } from "@/lib/types/components/Quotes/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";


export function EPP_PriceTable({ manualResourceCosts, updateManualCost }: 
    { manualResourceCosts: ManualResourceCosts, 
        updateManualCost: <K extends keyof ManualResourceCosts>(
            section: K,
            field: keyof ManualResourceCosts[K],
            value: ManualResourceCosts[K][keyof ManualResourceCosts[K]],
        ) => void,
    }){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de EPPs</h2>
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
                                            value={manualResourceCosts.epp.descripcion}
                                            onChange={(value) => updateManualCost("epp", "descripcion", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Cantidad"
                                            value={Number(manualResourceCosts.epp.cantidad)} min={0}
                                            onChange={(value) => updateManualCost("epp", "cantidad", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Precio Unidad (s/.)"
                                            value={Number(manualResourceCosts.epp.precio_unitario)} min={0}
                                            onChange={(value) => updateManualCost("epp", "precio_unitario", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {/* El precio total se calcula como la cantidad por el precio unitario */}
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(manualResourceCosts.epp.cantidad) * Number(manualResourceCosts.epp.precio_unitario), "PEN")}
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