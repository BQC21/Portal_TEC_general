"use client";

import Button2Add_finantial from "@/features/view/components/Buttons/quotes/finantial/button2Add";
import Button2Add_quote from "@/features/view/components/Buttons/quotes/quote/button2Add";
import Button2Add_report from "@/features/view/components/Buttons/quotes/report/button2Add";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import FinantialTable from "@/features/view/components/Tables/quotes/FinantialTable";
import QuoteTable from "@/features/view/components/Tables/quotes/QuoteTable";
import ReportTable from "@/features/view/components/Tables/quotes/ReportTable";
import { useProjectEquipos } from "@/features/view/hooks/services/useRealtimeProjectsEquipos";
import { useProjectMateriales } from "@/features/view/hooks/services/useRealtimeProjectsMateriales";
import { useQuoteMutations, useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useReportMutations, useReports } from "@/features/view/hooks/services/useRealtimeReports";
import { useFinantialMutations, useFinantials } from "@/features/view/hooks/services/useRealtimeFinantial";
import { Finantial, FinantialFormData } from "@/lib/types/supabase/finantial-types";
import { Quote, QuoteFormData } from "@/lib/types/supabase/quote-types";
import { Report, ReportFormData } from "@/lib/types/supabase/report-types";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { useState } from "react";

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
    const { projects_equipos: project_equipos, refetch: refetch_project_equipos } = useProjectEquipos();

    // JOIN MATERIALES <---> PROYECTOS    
    const { projects_materiales: project_materiales, refetch: refetch_project_materiales } = useProjectMateriales();

    // REPORTES
    const { reports, refetch: refetch_report } = useReports();
    const { create: create_report,
        update: update_report,
        remove: remove_report,
    } = useReportMutations();

    // FINANZAS
    const { finantials, refetch: refetch_finantial } = useFinantials();
    const { create: create_finantials,
        update: update_finantials,
        remove: remove_finantials,
    } = useFinantialMutations();

    // ---------------------------------
    // ---- Filtrado -------------------
    // ---------------------------------
	const [searchQuote, setSearchQuote] = useState<string>("");
	const [searchReport, setSearchReport] = useState<string>("");
	const [searchFinantial, setSearchFinantial] = useState<string>("");

    const filteredQuotes = quotes.filter((quote) => {
		const matchesDescription = !searchQuote || 
                quote.proyecto_info?.nombre.toLowerCase().includes(searchQuote.toLowerCase());

		return matchesDescription;
	});

    const filteredReports = reports.filter((report) => {
		const matchesDescription = !searchReport || 
            report.cliente?.toLowerCase().includes(searchReport.toLowerCase());

		return matchesDescription;
	});

    const filteredFinantial = finantials.filter((finantial) => {
		const matchesDescription = !searchFinantial || 
            finantial.cotizacion_info?.proyecto_info?.nombre.toLowerCase().includes(searchFinantial.toLowerCase());

		return matchesDescription;
	});

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    //------- Agregar
    async function handleAddQuote(
        quote: QuoteFormData,
    ) {
        await create_quote(quote);
        await refetch_quote();
        await refetch_project_equipos();
        await refetch_project_materiales();
    }

    // REPORTES
    async function handleAddReport(
        report: ReportFormData,
    ) {
        await create_report(report);
        await refetch_report();
    }

    // FINANZAS
    async function handleAddFinantial(
        report: FinantialFormData,
    ) {
        await create_finantials(report);
        await refetch_finantial();
    }

    //------ Actualizar
    async function handleEditQuote(
        updatedQuote: Quote,
    ) {
        const { id, ...quoteData } = updatedQuote;
        await update_quote(id, quoteData);
        await refetch_quote();
        await refetch_project_equipos();
        await refetch_project_materiales();
    }

    // REPORTES
    async function handleEditReport(
        updatedReport: Report,
    ) {
        const { id, ...reportData } = updatedReport;
        await update_report(id, reportData);
        await refetch_report();
    }

    // FINANZAS
    async function handleEditFinantial(
        updatedFinantial: Finantial,
    ) {
        const { id, ...finantialData } = updatedFinantial;
        await update_finantials(id, finantialData);
        await refetch_finantial();
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

    // FINANZAS
    async function handleDeleteFinantial(finantialId: string) {
        await remove_finantials(finantialId);
        await refetch_finantial();
    }

    return (
        <PortalShell
            title="Proceso de cotización para los proyectos de dimensionamiento"
            subtitle="Calcule el precio de venta y genera su reporte de cotización en formato PDF"
            activePath="/quotes"
        >
            <main className="min-h-screen bg-background text-foreground">
                <div className="flex w-full min-w-0 flex-col gap-6 py-5">
                    <ExcelWorkbook
                        sheets={[
                            {
                                id: "cotizaciones",
                                label: "Cotizaciones",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchQuote}
                                                    onChange={setSearchQuote}
                                                    placeholder="Buscar por proyecto asociado..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Add_quote
                                                    onAddQuote={handleAddQuote}
                                                    existingQuotes={quotes}
                                                    project_equipos={project_equipos}
                                                    project_materiales={project_materiales}
                                                />
                                            </div>
                                        </section>
                                        <QuoteTable
                                            quote={filteredQuotes}
                                            totalQuote={filteredQuotes.length}
                                            onUpdateQuote={handleEditQuote}
                                            onDeleteQuote={handleDeleteQuote}
                                            projects_equipos={project_equipos}
                                            projects_materiales={project_materiales}
                                        />
                                    </>
                                ),
                            },
                            {
                                id: "reportes",
                                label: "Reportes",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchReport}
                                                    onChange={setSearchReport}
                                                    placeholder="Buscar por nombre del cliente..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Add_report
                                                    onAddReport={handleAddReport}
                                                    project_equipos={project_equipos}
                                                    project_materiales={project_materiales}
                                                />
                                            </div>
                                        </section>
                                        <ReportTable
                                            report={filteredReports}
                                            totalReport={filteredReports.length}
                                            onUpdateReport={handleEditReport}
                                            onDeleteReport={handleDeleteReport}
                                            projects_equipos={project_equipos}
                                            projects_materiales={project_materiales}
                                        />
                                    </>
                                ),
                            },
                            {
                                id: "finanzas",
                                label: "Finanzas",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchFinantial}
                                                    onChange={setSearchFinantial}
                                                    placeholder="Buscar por proyecto asociado..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Add_finantial
                                                    onAddFinantial={handleAddFinantial}
                                                    project_equipos={project_equipos}
                                                />
                                            </div>
                                        </section>
                                        <FinantialTable
                                            finantial={filteredFinantial}
                                            totalFinantial={filteredFinantial.length}
                                            onUpdateFinantial={handleEditFinantial}
                                            onDeleteFinantial={handleDeleteFinantial}
                                            projects_equipos={project_equipos}
                                        />
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>
            </main>
        </PortalShell>
    )
}