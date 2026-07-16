import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { ManualCostMontoSection } from "@/features/view/hooks/modals/Quotes/useManageLocalCosts";
import { MontoItem } from "@/lib/types/components/Quotes/manual_resources";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";

export function Eating_PriceTable({ manualResourceCosts, updateManualCostMonto }: { 
    manualResourceCosts: ManualCosts, 
    updateManualCostMonto: (
        section: ManualCostMontoSection, 
        field: keyof MontoItem, 
        value: MontoItem[keyof MontoItem]
    ) => void
}){

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Alimentación</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
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
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Monto"
                                            value={Number(manualResourceCosts.Viaticos.eating.monto ?? 0)} min={0}
                                            onChange={(value) => updateManualCostMonto("Viaticos.eating", "monto", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Personas"
                                            value={Number(manualResourceCosts.Viaticos.eating.personas ?? 0)} min={0}
                                            onChange={(value) => updateManualCostMonto("Viaticos.eating", "personas", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Días"
                                            value={Number(manualResourceCosts.Viaticos.eating.dias ?? 0)} min={0}
                                            onChange={(value) => updateManualCostMonto("Viaticos.eating", "dias", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(manualResourceCosts.Viaticos.eating.monto ?? 0) * 
                                                Number(manualResourceCosts.Viaticos.eating.personas ?? 0) * 
                                                Number(manualResourceCosts.Viaticos.eating.dias ?? 0), "PEN")}
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