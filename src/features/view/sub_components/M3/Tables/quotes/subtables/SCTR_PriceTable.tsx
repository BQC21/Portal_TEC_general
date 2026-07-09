import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { useEffect, useState } from "react";

export function SCTR_PriceTable(){
    const [descripcion, setDescripcion] = useState<string>("");
    const [cantidad, setCantidad] = useState<number>(0);
    const [precio_unitario, setPrecio_unitario] = useState<number>(0);

    useEffect(() => {
        setDescripcion(descripcion);
        setCantidad(cantidad);
        setPrecio_unitario(precio_unitario);
    }, [cantidad, precio_unitario]);

    return(
        <>
            <div className="space-y-8 border-b border-slate-200 px-6 py-5">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Costos de SCTR</h2>
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
                                        <span className="text-slate-900">
                                            {cantidad * precio_unitario}
                                        </span>
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