import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { ManualResourceCosts } from "@/lib/types/components/manual_resources";
import { formatCurrency } from "@/lib/utils/normalization";
import { useEffect, useState } from "react";

export function Tooling_PriceTable({ manualResourceCosts, updateManualCost }: { 
    manualResourceCosts: ManualResourceCosts, 
    updateManualCost: <K extends keyof ManualResourceCosts>(
        section: K,
        field: keyof ManualResourceCosts[K],
        value: ManualResourceCosts[K][keyof ManualResourceCosts[K]],
    ) => void,
}){
    const [descripcion, setDescripcion] = useState<string>(manualResourceCosts.tooling.descripcion);
    const [cantidad, setCantidad] = useState<number>(Number(manualResourceCosts.tooling.cantidad));
    const [precio_unitario, setPrecio_unitario] = useState<number>(Number(manualResourceCosts.tooling.precio_unitario));

    // useEffect(() => {
    //     // sincronizar los valores de la tabla con los valores del manual de costos
    //     setDescripcion(manualResourceCosts.tooling.descripcion);
    //     setCantidad(Number(manualResourceCosts.tooling.cantidad));
    //     setPrecio_unitario(Number(manualResourceCosts.tooling.precio_unitario));
    // }, [manualResourceCosts]);

    useEffect(() => {
        // actualizar los valores del manual de costos cuando los valores de la tabla cambian
        updateManualCost("tooling", "descripcion", String(descripcion));
        updateManualCost("tooling", "cantidad", Number(cantidad));
        updateManualCost("tooling", "precio_unitario", Number(precio_unitario));
    }, [cantidad, precio_unitario, descripcion, updateManualCost]);

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
                                <tr className="bg-slate-100 text-left">
                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductTextField
                                            label="Descripción"
                                            value={descripcion}
                                            onChange={(value) => setDescripcion(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Cantidad"
                                            value={cantidad} min={0}
                                            onChange={(value) => setCantidad(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        <AddProductNumberField
                                            label="Precio Unidad (s/.)"
                                            value={precio_unitario} min={0}
                                            onChange={(value) => setPrecio_unitario(value)}
                                        />
                                    </td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                        {/* El precio total se calcula como la cantidad por el precio unitario */}
                                        <AddProductReadonlyField
                                            label="Precio Total (s/.)"
                                            value={formatCurrency(Number(cantidad) * Number(precio_unitario), "PEN")}
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