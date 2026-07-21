import { Eq_Mat_Content_Props } from "@/lib/types/components/module_render";

export function Eq_Mat_Content({
    title, precioFinal, Eq_Mt
}: Eq_Mat_Content_Props){
    return(
        <>
        <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-2xl font-bold uppercase">
                    {title}
                </h2>

                <div className="flex items-center gap-24 text-2xl font-bold">
                    <span>$</span>
                    <span>{(precioFinal * Eq_Mt/100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</span>
                </div>
            </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    {/* EQUIPOS */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - EQUIPOS
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>

                    {/* MATERIALES */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - MATERIALES ELÉCTRICOS
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>

                    {/* CANALIZACIÓN */}
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Código
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción - MATERIALES DE CANALIZACIÓN
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Unidad
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Cantidad
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
        </section>
        </>
    )
}