import { MO_Content_Props } from "@/lib/types/components/sub_components/module_render";
import { formatCurrency } from "@/lib/utils/normalization";

export function MO_Content({
    title, precioFinal, MO,
    hiddenMOIds = [],
    onToggleMOVisibility,
}: MO_Content_Props){

    const MORows = [
        {ids: ["1"], descripcion: "Acarreo de materiales para instalación"},
        {ids: ["2"], descripcion: "Realizar trazos y medidas"},
        {ids: ["3"], descripcion: "Montaje de estructura metálica"},
        {ids: ["4"], descripcion: "Instalación de paneles (Estructura)"},
        {ids: ["5"], descripcion: "Instalación de panele (Conexionado)"},
        {ids: ["6"], descripcion: "Instalación de tablero FV"},
        {ids: ["7"], descripcion: "Instalación de inversor"},
        {ids: ["8"], descripcion: "Canalización de acometida DC"},
        {ids: ["9"], descripcion: "Canalización de acometida AC"},
        {ids: ["10"], descripcion: "Mediciones, pruebas eléctricas, ajustes y optimización"},
        {ids: ["11"], descripcion: "Conexión, programación, control y puesta en marcha"},
        {ids: ["12"], descripcion: "Viáticos"},
    ];

    return(
        <>
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-2xl font-bold uppercase">
                        {title}
                    </h2>

                    <div className="flex items-center gap-24 text-2xl font-bold">
                        <span>{formatCurrency(precioFinal * MO / 100, "USD")}</span>
                    </div>
                </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        {/* PUESTA EN MARCHA */}
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-white text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción - PUESTA EN MARCHA
                                    </th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        MOSTRAR EN PDF
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {MORows.length > 0 ? (
                                    MORows.map((item) => {
                                        const visibleInPdf = item.ids.every((id) => !hiddenMOIds.includes(id));
                                        return (
                                            <tr
                                                key={item.ids.join("-")}
                                                className={visibleInPdf ? "bg-white" : "bg-slate-50 text-slate-400"}
                                            >
                                                <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                                    {item.descripcion}
                                                </td>
                                                <td className="border-b border-slate-200 px-4 py-5 text-center font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={visibleInPdf}
                                                        onChange={() =>
                                                            item.ids.forEach((id) => {
                                                                const currentlyVisible = !hiddenMOIds.includes(id);
                                                                if (currentlyVisible === visibleInPdf) {
                                                                    onToggleMOVisibility?.(id);
                                                                }
                                                            })
                                                        }
                                                        aria-label={`Mostrar ${item.descripcion || "Puesta en marcha"} en el PDF`}
                                                        className="h-5 w-5 accent-orange-500"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                            No hay Puesta en marcha a mostrarse todavía.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
            </section>
        </>
    )
} 