import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { Mobility_PriceTable_props } from "@/lib/types/components/Quotes/Quote_tables";
import { formatCurrency } from "@/lib/utils/normalization";

export function Mobility_PriceTable({ manualResourceCosts, updateManualCostMonto }: Mobility_PriceTable_props){
    const mobility = manualResourceCosts.Viaticos.mobility ?? { monto: 0, personas: 0, dias: 0 };
    const total =
        Number(mobility.monto ?? 0) *
        Number(mobility.personas ?? 0) *
        Number(mobility.dias ?? 0);

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Movilidad</h2> 
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
                                            label=""
                                            value={Number(mobility.monto ?? 0)} min={0} step={0.01}
                                            onChange={(value) => updateManualCostMonto("Viaticos.mobility", "monto", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label=""
                                            value={Number(mobility.personas ?? 0)} min={0}
                                            onChange={(value) => updateManualCostMonto("Viaticos.mobility", "personas", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label=""
                                            value={Number(mobility.dias ?? 0)} min={0}
                                            onChange={(value) => updateManualCostMonto("Viaticos.mobility", "dias", value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductReadonlyField
                                            label=""
                                            value={formatCurrency(total, "PEN")}
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