import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { useEffect, useState } from "react";

export function Personal_PriceTable(){
    const [dias, setDias] = useState<number>(0);
    const [precio_dia, setPrecio_dia] = useState<number>(0);
    const [nombre, setNombre] = useState<string>("");
    const [puesto, setPuesto] = useState<string>("");

    useEffect(() => {
        setNombre(nombre);
        setPuesto(puesto);
        setDias(dias);
        setPrecio_dia(precio_dia);
    }, [nombre, puesto, dias, precio_dia]);

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
                                        <span className="text-slate-900">
                                            {dias * precio_dia}
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