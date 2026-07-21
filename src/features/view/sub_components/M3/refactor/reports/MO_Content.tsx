import { MO_Content_Props } from "@/lib/types/components/module_render";

export function MO_Content({
    title, precioFinal, MO
}: MO_Content_Props){
    return(
        <>
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-2xl font-bold uppercase">
                        {title}
                    </h2>

                    <div className="flex items-center gap-24 text-2xl font-bold">
                        <span>$</span>
                        <span>{(precioFinal * MO/100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}</span>
                    </div>
                </div>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        {/* PUESTA EN MARCHA */}
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-10 bg-slate-100">
                                <tr className="bg-slate-400 text-white text-left">
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"></th>
                                    <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                        Descripción - PUESTA EN MARCHA
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">2</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">3</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">4</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">5</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">6</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">7</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">8</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">9</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">10</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">11</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                                <tr className="bg-slate-200 text-left">
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">12</td>
                                    <td className="border-b border-slate-200 px-4 py-5 font-medium">1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </section>
        </>
    )
} 