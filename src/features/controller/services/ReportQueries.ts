import { mapReportToSupabaseRow, mapSupabaseRowtoReport } from "@/lib/mapping/mapping_reports";
import { createClient } from "@/lib/supabase/client";
import { Report, ReportFormData } from "@/lib/types/supabase/report-types";
import { REPORT_TABLE } from "@/lib/utils/namingTolerance";

// crear
export async function createReport(report: ReportFormData): Promise<Report> {
    const supabase = createClient();
    const baseRow = mapReportToSupabaseRow(report) as Record<string, unknown>;

    if (Object.prototype.hasOwnProperty.call(baseRow, "id")){
        delete (baseRow).id;
    }

    console.debug("[debug] createReport payload:", baseRow);

    const insertReport = async (row: Record<string, unknown>) => {
        return supabase
            .from(REPORT_TABLE)
            .insert(row)
            .select("*,cotizacion(*, proyectos(*))");
    };

    let { data, error } = await insertReport(baseRow);

    if (error && (error.code === "23505" || error.message.includes("reportes_pkey"))) {
        const { data: lastRows, error: lastError } = await supabase
            .from(REPORT_TABLE)
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

        if (lastError) {
            throw new Error(
                `Error al crear el reporte: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const lastIdRaw = Array.isArray(lastRows) && lastRows.length > 0 ? lastRows[0]?.id : null;
        const lastId = Number(lastIdRaw);

        if (!Number.isFinite(lastId)) {
            throw new Error(
                `Error al crear el reporte: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const retryRow = { ...baseRow, id: lastId + 1 };
        console.warn("[debug] Retrying createReport with explicit id:", retryRow.id);
        ({ data, error } = await insertReport(retryRow));
    }

    if (error) {
        throw new Error(`Error al crear el reporte: ${error.message} - ${JSON.stringify(error)}`)
    }

    const created = Array.isArray(data) ? data[0] : data;

    if (!created){
        throw new Error("La inserción no devolvió ningún registro.");
    }
    return mapSupabaseRowtoReport(created);
}

// obtener
export async function getReports(): Promise<Report[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from(REPORT_TABLE)
        .select("*,cotizacion(*, proyectos(*))");

    if (error) {
        throw new Error(`Error al obtener los reportes: ${error.message}`);
    }

    return data.map(mapSupabaseRowtoReport);
}

// obtener por id
export async function getReportById(id: string): Promise<Report> {
    const supabase = createClient();

    const { data, error } = await supabase.from(REPORT_TABLE)
        .select("*,cotizacion(*, proyectos(*))")
        .eq("id", id)
        .single()

    if (error) {
        throw new Error(`Error al obtener el reporte: ${error.message}`);
    }

    return mapSupabaseRowtoReport(data);
}

// actualizar
export async function updateReport(id: string, report: ReportFormData): Promise<Report> {
    const supabase = createClient();
    const baseRow = mapReportToSupabaseRow(report) as Record<string, unknown>;

    const { error } = await supabase.from(REPORT_TABLE)
    .update(baseRow)
    .eq("id", id)

    if (error) {
        throw new Error(`Error al actualizar el reporte: ${error.message}`);
    }

    return await getReportById(id);
}

// remover
export async function deleteReport(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from(REPORT_TABLE).delete().eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar el reporte: ${error.message}`);
    }
}