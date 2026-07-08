import { QuoteTableProps } from "@/lib/types/components/tables";
import { TABLE_HEADERS_QUOTE } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import Button2Edit_quote from "../../Buttons/quotes/quote/button2Edit";
import { Button2Trash_quote } from "../../Buttons/quotes/quote/button2Delete";

export default function QuoteTable({quote, totalQuote, 
    onUpdateQuote, onDeleteQuote, projects_equipos, projects_materiales}: QuoteTableProps){
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_QUOTE.map((header) => (
                                <th
                                    key={header}
                                    className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"
                                >
                                    {header}
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {quote.length > 0 ? (
                                quote.map((quote) => {
                                    return (
                                    <tr key={quote.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.cod_cotizacion}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.proyecto_info?.nombre}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.igv}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.tasa_cambio}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.precio_dolares}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(quote.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(quote.updated_at)}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit_quote
                                                    quote={quote}
                                                    onUpdateQuote={onUpdateQuote}
                                                    project_equipos={projects_equipos}
                                                    project_materiales={projects_materiales}
                                                />
                                            </div>
                                        </td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4">
                                                <Button2Trash_quote
                                                    quote={quote}
                                                    onDeleteQuote={() => onDeleteQuote(quote.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_QUOTE.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay cotizaciones registradas todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalQuote} cotizaciones
            </p>
        </section>
    )
}