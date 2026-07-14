import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { ManualResourceCosts } from "@/lib/types/components/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";
import { useEffect, useState } from "react";

export function Hotel_PriceTable({ manualResourceCosts, updateManualCost }: { 
    manualResourceCosts: ManualResourceCosts, 
    updateManualCost: <K extends keyof ManualResourceCosts>(
        section: K,
        field: keyof ManualResourceCosts[K],
        value: ManualResourceCosts[K][keyof ManualResourceCosts[K]],
    ) => void,
    })
{
    const [monto, setMonto] = useState<number>(Number(manualResourceCosts.hotel.monto ?? 0));
    const [personas, setPersonas] = useState<number>(Number(manualResourceCosts.hotel.personas ?? 0));
    const [dias, setDias] = useState<number>(Number(manualResourceCosts.hotel.dias ?? 0));

    // useEffect(() => {
    //     // sincronizar los valores de la tabla con los valores del manual de costos
    //     setMonto(Number(manualResourceCosts.hotel.monto ?? 0));
    //     setPersonas(Number(manualResourceCosts.hotel.personas ?? 0));
    //     setDias(Number(manualResourceCosts.hotel.dias ?? 0));
    // }, [manualResourceCosts]);

    useEffect(() => {
        // actualizar los valores del manual de costos cuando los valores de la tabla cambian
        updateManualCost("hotel", "monto", Number(monto));
        updateManualCost("hotel", "personas", Number(personas));
        updateManualCost("hotel", "dias", Number(dias));
    }, [monto, personas, dias, updateManualCost]);

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Hotel</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Monto
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
                                            value={monto}
                                            onChange={(value) => setMonto(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Personas"
                                            value={personas} min={0}
                                            onChange={(value) => setPersonas(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Días"
                                            value={dias} min={0}
                                            onChange={(value) => setDias(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(monto) * Number(personas) * Number(dias), "PEN")}
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