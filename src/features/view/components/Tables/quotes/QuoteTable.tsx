import { QuoteTableProps } from "@/lib/types/components/General/tables";
import { TABLE_HEADERS_QUOTE } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { formatVersionLabel } from "@/lib/utils/helpers/manage_info/version";
import Button2Edit from "../../Buttons/shared/button2Edit";
import { Button2Delete } from "../../Buttons/shared/button2Delete";
import { Button2Duplicate } from "../../Buttons/shared/button2Duplicate";
import EditQuoteModal from "../../Modals/quotes/quote/EditQuoteModal";
import { DeleteQuoteModal } from "../../Modals/quotes/quote/DeleteQuoteModal";
import { Quote } from "@/lib/types/supabase/quote-types";
import { formatCurrency } from "@/lib/utils/normalization";
import { quoteAssociatedLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { DATE_CELL_CLASS, getDateHeaderClass } from "@/lib/utils/helpers/render/tableDateColumn";

export default function QuoteTable({quote, totalQuote, 
    onUpdateQuote, onDeleteQuote, onDuplicateQuote, projects_equipos, projects_materiales}: QuoteTableProps){
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
                                    className={`border border-slate-200 px-4 py-4 text-[1.02rem] font-bold ${getDateHeaderClass(header)}`}
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
                                        
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit title="Ver cotización" label="Ver Cotización">
                                                    {(close) => (
                                                        <EditQuoteModal
                                                            existingQuote={quote}
                                                            onUpdateQuote={async (formData) => {
                                                                const updatedQuote: Quote = { ...quote, ...formData } as Quote;
                                                                await onUpdateQuote(updatedQuote);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                            existing_project_equipos={projects_equipos}
                                                            existing_project_materiales={projects_materiales}
                                                        />
                                                    )}
                                                </Button2Edit>
                                                <Button2Duplicate
                                                    title="Duplicar cotización"
                                                    onDuplicate={() => onDuplicateQuote(quote)}
                                                />
                                                <Button2Delete title="Eliminar cotización">
                                                    {(close) => (
                                                        <DeleteQuoteModal
                                                            quote={quote}
                                                            onDeleteQuote={(quoteId) => {
                                                                onDeleteQuote(quoteId);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Delete>
                                            </div>
                                        </td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${DATE_CELL_CLASS}`}>{formatDate(quote.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium ${DATE_CELL_CLASS}`}>{formatDate(quote.updated_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.cod_cotizacion}</td>
                                        {/* <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.proyecto_info?.nombre}</td> */}
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quoteAssociatedLabel(quote)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatVersionLabel(quote.version)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.igv}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.tasa_cambio}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatCurrency(Number(quote.precio_dolares), 'USD')}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{(Number(quote.gm)*100).toFixed(2)} %</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{quote.depre_tool} meses</td>
                                        
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