import { Quote, SupabaseQuoteRow } from "./quote-types";

// estado del formulario
export type ReportFormState = Omit<Report, "id">;
export type ReportFormData = Omit<Report, "id">

// correspondencia con Supabase
export type SupabaseReportRow = {
    id?: number | string;
    cotizacion_id?: number | string;
    cotizacion_info?: SupabaseQuoteRow;
    cotizaciones?: SupabaseQuoteRow;
    // datos del cliente
    cliente?: string;
    ruc_dni?: string;
    fecha?: Date | string | null;
    lugar?: string;
    atencion?: string;
    // porcentajes
    porcentaje_eqmt?: number;
    porcentaje_inst?: number;
    precio_cotizacion?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
}

// visualización de la tabla
export type Report = {
    id: string;
    cotizacion_id?: string;
    cotizacion_info?: Quote | undefined;
    // datos del cliente
    cliente?: string;
    ruc_dni?: string;
    fecha?: Date;
    lugar?: string;
    atencion?: string;
    // porcentajes
    porcentaje_eqmt?: string;
    porcentaje_inst?: string;
    precio_cotizacion?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
}

// manejo de la visualización
export type useReportResult = {
    reports: Report[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// manejo de la visualización modificada
export type useReportMutationResult = {
    loading: boolean;
    error: string | null;
    create: (report: ReportFormData) => Promise<Report>;
    update: (id: string, report: ReportFormData) => Promise<Report>;
    remove: (id: string) => Promise<void>;
}