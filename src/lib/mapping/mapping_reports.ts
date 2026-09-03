import { SupabaseQuoteRow } from "../types/supabase/quote-types"
import { Report, ReportFormData, ReportFormState, SupabaseReportRow } from "../types/supabase/report-types"
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage"
import { parseNumber } from "../utils/normalization"
import { mapSupabaseRowtoQuote } from "./mapping_quotes"

// Creador de valores por defecto a partir del formulario
export function createReportFormStateFromReport(report: Report): ReportFormState{
    return {
        cotizacion_id: report.cotizacion_id,
        cotizacion_info: report.cotizacion_info,
        // datos del cliente
        cliente: report.cliente,
        ruc_dni: report.ruc_dni,
        fecha: report.fecha,
        lugar: report.lugar,
        atencion: report.atencion,
        // porcentajes
        porcentaje_eqmt: report.porcentaje_eqmt,
        porcentaje_inst: report.porcentaje_inst,
        precio_cotizacion: report.precio_cotizacion,
        // adicionales
        validez_oferta: report.validez_oferta,
        plazo_entrega: report.plazo_entrega,
        tasa_dscto: report.tasa_dscto,
        opcion_dscto: report.opcion_dscto,
        formato_dscto: report.formato_dscto,
        payFormat: report.payFormat,
        // fechas
        created_at:report.created_at,
        updated_at: report.updated_at
    }
}

// Lectura del DB de Supabase
export function mapSupabaseRowtoReport(row: SupabaseReportRow): Report{
    return {
        id: row.id?.toString() || "",
        cotizacion_id: row.cotizacion_id?.toString() || "",
        cotizacion_info: row.cotizacion_info ?
            mapSupabaseRowtoQuote(row.cotizacion_info as SupabaseQuoteRow)
            : row.cotizacion
                ? mapSupabaseRowtoQuote(row.cotizacion as SupabaseQuoteRow)
                : row.cotizaciones
                    ? mapSupabaseRowtoQuote(row.cotizaciones as SupabaseQuoteRow)
                    : undefined,
        // datos del cliente
        cliente: row.cliente?.toString() || "",
        ruc_dni: row.ruc_dni?.toString() || "",
        fecha:  parseNullableDate(row.fecha) ?? new Date(),
        lugar: row.lugar?.toString() || "",
        atencion: row.atencion?.toString() || "",
        // porcentajes
        porcentaje_eqmt: row.porcentaje_eqmt?.toString() || "",
        porcentaje_inst: row.porcentaje_inst?.toString() || "",
        precio_cotizacion: row.precio_cotizacion?.toString() || "",
        // adicionales
        validez_oferta: row.validez_oferta?.toString() || "",
        plazo_entrega: row.plazo_entrega?.toString() || "",
        tasa_dscto: row.tasa_dscto?.toString() || "",
        opcion_dscto: row.opcion_dscto?.toString() || "",
        formato_dscto: row.formato_dscto?.toString() || "",
        payFormat: row.payFormat?.toString() || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
    }
}

// Escritura en el DB de Supabase
export function mapReportToSupabaseRow(report: ReportFormData): SupabaseReportRow {
    return{
        cotizacion_id: report.cotizacion_id,
        // datos del cliente
        cliente: report.cliente,
        ruc_dni: report.ruc_dni,
        fecha: report.fecha,
        lugar: report.lugar,
        atencion: report.atencion,
        // porcentajes
        porcentaje_eqmt: parseNumber(report.porcentaje_eqmt),
        porcentaje_inst: parseNumber(report.porcentaje_inst),
        precio_cotizacion: parseNumber(report.precio_cotizacion),
        // adicionales
        validez_oferta: report.validez_oferta,
        plazo_entrega: report.plazo_entrega,
        tasa_dscto: parseNumber(report.tasa_dscto),
        opcion_dscto: report.opcion_dscto,
        formato_dscto: report.formato_dscto,
        payFormat: report.payFormat,
        // fechas
        created_at:report.created_at,
        updated_at: report.updated_at
    }
}
