import { ReportTableProps } from "@/lib/types/components/tables";
import { TABLE_HEADERS_REPORT } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";


export default function ReportTable({report, totalReport, 
    onUpdateReport, onDeleteReport}: ReportTableProps){
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_REPORT.map((header) => (
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
                            {report.length > 0 ? (
                                report.map((report) => {
                                    return (
                                    <tr key={report.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{report.cotizacion_info?.cod_cotizacion}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{report.cliente}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{report.porcentaje_eqmt}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{report.porcentaje_inst}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{report.precio_cotizacion}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(report.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(report.updated_at)}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit
                                                    report={report}
                                                    onUpdateReport={onUpdateReport}
                                                />
                                                <Button2Trash
                                                    report={report}
                                                    onDeleteReport={() => onDeleteReport(report.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_REPORT.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay reportes registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalReport} reportes
            </p>
        </section>
    )
}