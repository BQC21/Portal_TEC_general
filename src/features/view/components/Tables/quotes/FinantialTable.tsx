import { FinantialTableProps } from "@/lib/types/components/General/tables";
import { TABLE_HEADERS_FINANTIAL } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import Button2Edit_finantial from "../../Buttons/quotes/finantial/button2Edit";
import { Button2Trash_finantial } from "../../Buttons/quotes/finantial/button2Delete";


export default function FinantialTable({finantial, totalFinantial, 
    onUpdateFinantial, onDeleteFinantial, projects_equipos}: FinantialTableProps){
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_FINANTIAL.map((header) => (
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
                            {finantial.length > 0 ? (
                                finantial.map((finantial) => {
                                    return (
                                    <tr key={finantial.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{finantial.cotizacion_info?.cod_cotizacion}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{finantial.tiempo_retorno}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{finantial.lcoe}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(finantial.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(finantial.updated_at)}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit_finantial
                                                    finantial={finantial}
                                                    onUpdateFinantial={onUpdateFinantial}
                                                    project_equipos={projects_equipos}
                                                />
                                                <Button2Trash_finantial
                                                    finantial={finantial}
                                                    onDeleteFinantial={() => onDeleteFinantial(finantial.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_FINANTIAL.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay análisis financieros registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalFinantial} análisis financieros
            </p>
        </section>
    )
}