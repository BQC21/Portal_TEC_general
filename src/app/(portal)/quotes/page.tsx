"use client";

import Button2Add_quote from "@/features/view/components/Buttons/quotes/quote/button2Add";
import Button2Add_report from "@/features/view/components/Buttons/quotes/report/button2Add";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import QuoteTable from "@/features/view/components/Tables/quotes/QuoteTable";
import ReportTable from "@/features/view/components/Tables/quotes/ReportTable";
import { useProjectEquipos } from "@/features/view/hooks/services/useRealtimeProjectsEquipos";
import { useProjectMateriales } from "@/features/view/hooks/services/useRealtimeProjectsMateriales";
import { useQuoteMutations, useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useReportMutations, useReports } from "@/features/view/hooks/services/useRealtimeReports";
import { Quote, QuoteFormData } from "@/lib/types/supabase/quote-types";
import { Report, ReportFormData } from "@/lib/types/supabase/report-types";

export default function QuotesPage(){
    // ---------------------------------
    // ---- Usar Base de datos ---------
    // ---------------------------------  
    const { quotes, refetch: refetch_quote } = useQuotes();
    const { create: create_quote,
        update: update_quote,
        remove: remove_quote
    } = useQuoteMutations();


    // JOIN EQUIPOS <---> PROYECTOS
    const { projects_equipos: project_equipos} = useProjectEquipos();

    // JOIN MATERIALES <---> PROYECTOS    
    const { projects_materiales: project_materiales} = useProjectMateriales();

    // REPORTES
    const { reports, refetch: refetch_report } = useReports();
    const { create: create_report,
        update: update_report,
        remove: remove_report,
    } = useReportMutations();

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    //------- Agregar
    async function handleAddQuote(
        quote: QuoteFormData,
    ) {
        await create_quote(quote);
        await refetch_quote();
    }

    // REPORTES
    async function handleAddReport(
        report: ReportFormData,
    ) {
        await create_report(report);
        await refetch_report();
    }

    //------ Actualizar
    async function handleEditQuote(
        updatedQuote: Quote,
    ) {
        const { id, ...quoteData } = updatedQuote;
        await update_quote(id, quoteData);
        await refetch_quote();
    }

    // REPORTES
    async function handleEditReport(
        updatedReport: Report,
    ) {
        const { id, ...reportData } = updatedReport;
        await update_report(id, reportData);
        await refetch_report();
    }

    //------ Remover
    async function handleDeleteQuote(quoteId: string){
        await remove_quote(quoteId);
        await refetch_quote();
    }

    // REPORTES
    async function handleDeleteReport(reportId: string){
        await remove_report(reportId);
        await refetch_report();
    }

    return (
        <PortalShell
            title="Proceso de cotización para los proyectos de dimensionamiento"
            subtitle="Calcule el precio de venta y genera su reporte de cotización en formato PDF"
            activePath="/quotes"
        >
            <main className="min-h-screen bg-background text-foreground">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                    <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button2Add_quote
                                onAddQuote={handleAddQuote}
                                project_equipos={project_equipos}
                                project_materiales={project_materiales}
                            />
                        </div>
                    </section>
                    <QuoteTable
                        quote={quotes}
                        totalQuote={quotes.length}
                        onUpdateQuote={handleEditQuote}
                        onDeleteQuote={handleDeleteQuote}
                        projects_equipos={project_equipos}
                        projects_materiales={project_materiales}
                    />
                </div>

                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                    <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button2Add_report
                                onAddReport={handleAddReport}
                                project_equipos={project_equipos}
                                project_materiales={project_materiales}
                            />
                        </div>
                    </section>
                    <ReportTable
                        report={reports}
                        totalReport={reports.length}
                        onUpdateReport={handleEditReport}
                        onDeleteReport={handleDeleteReport}
                        projects_equipos={project_equipos}
                        projects_materiales={project_materiales}
                    />
                </div>
            </main>
        </PortalShell>
    )
}