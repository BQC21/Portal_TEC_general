import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { ManualResourceCosts } from "@/lib/types/components/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";
import { useEffect, useState } from "react";

export function Personal_PriceTable({ manualResourceCosts, updateManualCost }: { 
    manualResourceCosts: ManualResourceCosts, 
    updateManualCost: <K extends keyof ManualResourceCosts>(
        section: K,
        field: keyof ManualResourceCosts[K],
        value: ManualResourceCosts[K][keyof ManualResourceCosts[K]],
    ) => void,
}){
    const [dias, setDias] = useState<number>(Number(manualResourceCosts.personal.dias));
    const [precio_dia, setPrecio_dia] = useState<number>(Number(manualResourceCosts.personal.precio_dia));
    const [nombre, setNombre] = useState<string>(manualResourceCosts.personal.nombre);
    const [puesto, setPuesto] = useState<string>(manualResourceCosts.personal.puesto);

    useEffect(() => {
        // sincronizar los valores de la tabla con los valores del manual de costos
        setNombre(manualResourceCosts.personal.nombre);
        setPuesto(manualResourceCosts.personal.puesto);
        setDias(Number(manualResourceCosts.personal.dias));
        setPrecio_dia(Number(manualResourceCosts.personal.precio_dia));
    }, [manualResourceCosts]);

    useEffect(() => {
        // actualizar los valores del manual de costos cuando los valores de la tabla cambian
        updateManualCost("personal", "dias", Number(dias));
        updateManualCost("personal", "precio_dia", Number(precio_dia));
        updateManualCost("personal", "nombre", String(nombre));
        updateManualCost("personal", "puesto", String(puesto));
    }, [dias, precio_dia, nombre, puesto, updateManualCost]);

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de Personal</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-100 text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Nombre
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Puesto
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Días
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio x Día
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Precio Total (s/.)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-100 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductTextField
                                            label="Nombre"
                                            value={nombre}
                                            onChange={(value) => setNombre(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductTextField
                                            label="Puesto"
                                            value={puesto}
                                            onChange={(value) => setPuesto(value)}
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
                                        <AddProductNumberField
                                            label="Precio x Día"
                                            value={precio_dia} min={0}
                                            onChange={(value) => setPrecio_dia(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(dias) * Number(precio_dia), "PEN")}
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