"use client";

import Button2Add from "@/features/view/components/Buttons/shared/button2Add";
import Button2MassiveClean from "@/features/view/components/Buttons/shared/button2MassiveClean";
import Button2MassiveDownload from "@/features/view/components/Buttons/shared/button2MassiveDownload";
import Button2MassiveUpload from "@/features/view/components/Buttons/shared/button2MassiveUpload";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import FinantialTable from "@/features/view/components/Tables/quotes/FinantialTable";
import QuoteTable from "@/features/view/components/Tables/quotes/QuoteTable";
import ReportTable from "@/features/view/components/Tables/quotes/ReportTable";
import AddFinantialModal from "@/features/view/components/Modals/quotes/finantial/AddFinantialModal";
import AddQuoteModal from "@/features/view/components/Modals/quotes/quote/AddQuoteModal";
import AddReportModal from "@/features/view/components/Modals/quotes/report/AddReportModal";
import { useProjectEquipos } from "@/features/ViewModel/hooks/services/useRealtimeProjectsEquipos";
import { useProjectMateriales } from "@/features/ViewModel/hooks/services/useRealtimeProjectsMateriales";
import { useQuoteMutations, useQuotes } from "@/features/ViewModel/hooks/services/useRealtimeQuotes";
import { useReportMutations, useReports } from "@/features/ViewModel/hooks/services/useRealtimeReports";
import { useFinantialMutations, useFinantials } from "@/features/ViewModel/hooks/services/useRealtimeFinantial";
import { Finantial, FinantialFormData } from "@/lib/types/supabase/finantial-types";
import { Quote, QuoteFormData } from "@/lib/types/supabase/quote-types";
import { Report, ReportFormData } from "@/lib/types/supabase/report-types";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { useState } from "react";
import { useDateSorting } from "@/features/ViewModel/hooks/filters/useDateSorting";
import { QuoteFilters } from "@/features/view/components/Tables/quotes/QuoteFilters";
import { ReportFilters } from "@/features/view/components/Tables/quotes/ReportFilters";
import { FinantialFilters } from "@/features/view/components/Tables/quotes/FinantialFilters";
import { QuoteFilterValues, ReportFilterValues } from "@/lib/types/components/Filter/filter_tables";
import { matchesPriceFilter } from "@/lib/utils/helpers/filters/tableFilterOptions";
import { getNextCopyVersion, getVersionValue } from "@/lib/utils/helpers/manage_info/version";
import { quoteAssociatedLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import {
	transformFinantialRows,
	transformQuoteRows,
	transformReportRows,
} from "@/lib/utils/helpers/massive/massiveUpload";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { displayPayback } from "@/lib/utils/helpers/render/table_display_values";
import { FinantialExportRow, QuoteExportRow, ReportExportRow } from "@/lib/types/components/Massive/download";
import {
	FINANTIAL_EXPORT_COLUMNS,
	QUOTE_EXPORT_COLUMNS,
	REPORT_EXPORT_COLUMNS,
} from "@/lib/utils/consts/massiveDownload";
import {
	FINANTIAL_UPLOAD_COLUMNS,
	FINANTIAL_UPLOAD_HEADERS,
	QUOTE_UPLOAD_COLUMNS,
	QUOTE_UPLOAD_HEADERS,
	REPORT_UPLOAD_COLUMNS,
	REPORT_UPLOAD_HEADERS,
} from "@/lib/utils/consts/massiveUpload";
import { FINANTIAL_TABLE, QUOTE_TABLE, REPORT_TABLE } from "@/lib/utils/namingTolerance";
import { formatCurrency } from "@/lib/utils/normalization";


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
    const [quoteFilters, setQuoteFilters] = useState<QuoteFilterValues>({
        precio_dolares: "",
    });
    const [reportFilters, setReportFilters] = useState<ReportFilterValues>({
        precio_cotizacion: "",
    });

    const filteredQuotes = quotes.filter((quote) => {
		const matchesDescription = !searchQuote ||
            quoteAssociatedLabel(quote)
                .toLowerCase()
                .includes(searchQuote.toLowerCase());
        const matchesPrice = matchesPriceFilter(quote.precio_dolares, quoteFilters.precio_dolares);

		return matchesDescription && matchesPrice;
	});

    const filteredReports = reports.filter((report) => {
		const matchesDescription = !searchReport ||
            quoteAssociatedLabel(report.cotizacion_info)
                .toLowerCase()
                .includes(searchReport.toLowerCase());
        const matchesPrice = matchesPriceFilter(
            report.cotizacion_info?.precio_dolares,
            reportFilters.precio_cotizacion,
        );

		return matchesDescription && matchesPrice;
	});

    const filteredFinantial = finantials.filter((finantial) => {
		const matchesDescription = !searchFinantial ||
            quoteAssociatedLabel(finantial.cotizacion_info)
                .toLowerCase()
                .includes(searchFinantial.toLowerCase());

		return matchesDescription;
	});

    const quoteDateSort = useDateSorting(filteredQuotes);
    const reportDateSort = useDateSorting(filteredReports);
    const finantialDateSort = useDateSorting(filteredFinantial);

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

    async function handleDuplicateQuote(quote: Quote) {
        const now = new Date();
        const existingVersions = quotes
            .filter((item) => item.proyecto_id === quote.proyecto_id)
            .map((item) => getVersionValue(item.version));
        const nextVersion = getNextCopyVersion(
            getVersionValue(quote.version),
            existingVersions,
        );
        const { id: _id, created_at: _createdAt, updated_at: _updatedAt, version: _version, ...quoteData } = quote;

        await create_quote({
            ...quoteData,
            version: nextVersion,
            created_at: now,
            updated_at: now,
            costos_manuales: JSON.parse(JSON.stringify(quote.costos_manuales)),
        });
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
        await refetch_report();
        await refetch_finantial();
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
        await refetch_quote();
        await refetch_finantial();
    }

    // FINANZAS
    async function handleEditFinantial(
        updatedFinantial: Finantial,
    ) {
        const { id, ...finantialData } = updatedFinantial;
        await update_finantials(id, finantialData);
        await refetch_finantial();
        await refetch_quote();
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
                                                <Button2MassiveUpload
                                                    title="Subida masiva de cotizaciones"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de cotizaciones."
                                                    tableName={QUOTE_TABLE}
                                                    expectedHeaders={QUOTE_UPLOAD_HEADERS}
                                                    columns={QUOTE_UPLOAD_COLUMNS}
                                                    transformRows={transformQuoteRows}
                                                    onSuccess={refetch_quote}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de cotizaciones"
                                                    description="Exporta la lista de cotizaciones en XLSX o CSV."
                                                    items={quotes.map((quote): QuoteExportRow => ({
                                                        cod_cotizacion: quote.cod_cotizacion ?? "",
                                                        proyecto: quoteAssociatedLabel(quote),
                                                        igv: quote.igv ?? "",
                                                        tasa_cambio: quote.tasa_cambio ?? "",
                                                        precio_dolares: formatCurrency(Number(quote.precio_dolares), "USD"),
                                                        gm: Number(quote.gm) || 0,
                                                        depre_tool: Number(quote.depre_tool) || 0,
                                                        created_at: formatDate(quote.created_at),
                                                        updated_at: formatDate(quote.updated_at),
                                                    }))}
                                                    columns={QUOTE_EXPORT_COLUMNS}
                                                    defaultFileName="cotizaciones"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={quotes.length}
                                                    onSuccess={refetch_quote}
                                                    tableName={QUOTE_TABLE}
                                                    title="Limpieza masiva de cotizaciones"
                                                    description="Esta acción elimina todas las filas de cotizaciones."
                                                    entityLabel="cotizaciones"
                                                />
                                                <Button2Add label="Añadir Cotización">
                                                    {(close) => (
                                                        <AddQuoteModal
                                                            onAddQuote={async (quote) => {
                                                                await handleAddQuote(quote);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                            existingQuotes={quotes}
                                                            existing_project_equipos={project_equipos}
                                                            existing_project_materiales={project_materiales}
                                                        />
                                                    )}
                                                </Button2Add>
                                            </div>
                                        </section>
                                        <section className="panel mb-4 p-4">
                                            <div className="space-y-6">
                                                <QuoteFilters
                                                    quotes={quotes}
                                                    values={quoteFilters}
                                                    onFilterChange={(key, value) => {
                                                        setQuoteFilters((current) => ({ ...current, [key]: value }));
                                                    }}
                                                    createdOrder={quoteDateSort.createdOrder}
                                                    updatedOrder={quoteDateSort.updatedOrder}
                                                    onCreatedOrderChange={quoteDateSort.setCreatedOrder}
                                                    onUpdatedOrderChange={quoteDateSort.setUpdatedOrder}
                                                />
                                            </div>
                                        </section>
                                        <QuoteTable
                                            quote={quoteDateSort.sortedRows}
                                            totalQuote={quoteDateSort.sortedRows.length}
                                            onUpdateQuote={handleEditQuote}
                                            onDeleteQuote={handleDeleteQuote}
                                            onDuplicateQuote={handleDuplicateQuote}
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
                                                    placeholder="Buscar por proyecto asociado..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2MassiveUpload
                                                    title="Subida masiva de reportes"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de reportes."
                                                    tableName={REPORT_TABLE}
                                                    expectedHeaders={REPORT_UPLOAD_HEADERS}
                                                    columns={REPORT_UPLOAD_COLUMNS}
                                                    transformRows={transformReportRows}
                                                    onSuccess={refetch_report}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de reportes"
                                                    description="Exporta la lista de reportes en XLSX o CSV."
                                                    items={reports.map((report): ReportExportRow => ({
                                                        cotizacion: report.cotizacion_info?.cod_cotizacion ?? "",
                                                        proyecto: quoteAssociatedLabel(report.cotizacion_info),
                                                        cliente: report.cliente ?? "",
                                                        ruc_dni: report.ruc_dni ?? "",
                                                        lugar: report.lugar ?? "",
                                                        atencion: report.atencion ?? "",
                                                        porcentaje_eqmt: report.porcentaje_eqmt ?? "",
                                                        porcentaje_inst: report.porcentaje_inst ?? "",
                                                        precio_cotizacion: formatCurrency(Number(report.cotizacion_info?.precio_dolares), "USD"),
                                                        created_at: formatDate(report.created_at),
                                                        updated_at: formatDate(report.updated_at),
                                                    }))}
                                                    columns={REPORT_EXPORT_COLUMNS}
                                                    defaultFileName="reportes"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={reports.length}
                                                    onSuccess={refetch_report}
                                                    tableName={REPORT_TABLE}
                                                    title="Limpieza masiva de reportes"
                                                    description="Esta acción elimina todas las filas de reportes."
                                                    entityLabel="reportes"
                                                />
                                                <Button2Add label="Añadir Reporte">
                                                    {(close) => (
                                                        <AddReportModal
                                                            onAddReport={async (report) => {
                                                                await handleAddReport(report);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                            existing_project_equipos={project_equipos}
                                                            existing_project_materiales={project_materiales}
                                                        />
                                                    )}
                                                </Button2Add>
                                            </div>
                                        </section>
                                        <section className="panel mb-4 p-4">
                                            <div className="space-y-6">
                                                <ReportFilters
                                                    reports={reports}
                                                    values={reportFilters}
                                                    onFilterChange={(key, value) => {
                                                        setReportFilters((current) => ({ ...current, [key]: value }));
                                                    }}
                                                    createdOrder={reportDateSort.createdOrder}
                                                    updatedOrder={reportDateSort.updatedOrder}
                                                    onCreatedOrderChange={reportDateSort.setCreatedOrder}
                                                    onUpdatedOrderChange={reportDateSort.setUpdatedOrder}
                                                />
                                            </div>
                                        </section>
                                        <ReportTable
                                            report={reportDateSort.sortedRows}
                                            totalReport={reportDateSort.sortedRows.length}
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
                                                <Button2MassiveUpload
                                                    title="Subida masiva de finanzas"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de análisis financieros."
                                                    tableName={FINANTIAL_TABLE}
                                                    expectedHeaders={FINANTIAL_UPLOAD_HEADERS}
                                                    columns={FINANTIAL_UPLOAD_COLUMNS}
                                                    transformRows={transformFinantialRows}
                                                    onSuccess={refetch_finantial}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de finanzas"
                                                    description="Exporta la lista de análisis financieros en XLSX o CSV."
                                                    items={finantials.map((finantial): FinantialExportRow => ({
                                                        cotizacion: finantial.cotizacion_info?.cod_cotizacion ?? "",
                                                        proyecto: quoteAssociatedLabel(finantial.cotizacion_info),
                                                        planta: Number(finantial.planta) || 0,
                                                        generacion: Number(finantial.generacion) || 0,
                                                        tarifa_red: Number(finantial.tarifa_red) || 0,
                                                        degra_1er: Number(finantial.degra_1er) || 0,
                                                        degra_2do: Number(finantial.degra_2do) || 0,
                                                        tarifa_crecimiento: Number(finantial.tarifa_crecimiento) || 0,
                                                        tasa_descuento: Number(finantial.tasa_descuento) || 0,
                                                        tiempo_retorno: displayPayback(finantial.tiempo_retorno),
                                                        lcoe: finantial.lcoe ? `${finantial.lcoe} USD/MWh` : "",
                                                        created_at: formatDate(finantial.created_at),
                                                        updated_at: formatDate(finantial.updated_at),
                                                    }))}
                                                    columns={FINANTIAL_EXPORT_COLUMNS}
                                                    defaultFileName="finanzas"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={finantials.length}
                                                    onSuccess={refetch_finantial}
                                                    tableName={FINANTIAL_TABLE}
                                                    title="Limpieza masiva de finanzas"
                                                    description="Esta acción elimina todas las filas de análisis financieros."
                                                    entityLabel="análisis financieros"
                                                />
                                                <Button2Add label="Añadir Finanzas">
                                                    {(close) => (
                                                        <AddFinantialModal
                                                            onAddFinantial={async (finantial) => {
                                                                await handleAddFinantial(finantial);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                            existing_project_equipos={project_equipos}
                                                        />
                                                    )}
                                                </Button2Add>
                                            </div>
                                        </section>
                                        <section className="panel mb-4 p-4">
                                            <div className="space-y-6">
                                                <FinantialFilters
                                                    createdOrder={finantialDateSort.createdOrder}
                                                    updatedOrder={finantialDateSort.updatedOrder}
                                                    onCreatedOrderChange={finantialDateSort.setCreatedOrder}
                                                    onUpdatedOrderChange={finantialDateSort.setUpdatedOrder}
                                                />
                                            </div>
                                        </section>
                                        <FinantialTable
                                            finantial={finantialDateSort.sortedRows}
                                            totalFinantial={finantialDateSort.sortedRows.length}
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