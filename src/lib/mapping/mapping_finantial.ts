import { Finantial, FinantialFormData, FinantialFormState, SupabaseFinantialRow } from "../types/supabase/finantial-types"
import { SupabaseQuoteRow } from "../types/supabase/quote-types"
import { Report, ReportFormData, ReportFormState, SupabaseReportRow } from "../types/supabase/report-types"
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage"
import { parseNumber } from "../utils/normalization"
import { mapSupabaseRowtoQuote } from "./mapping_quotes"

// Creador de valores por defecto a partir del formulario
export function createFinantialFormStateFromFinantial(finantial: Finantial): FinantialFormState{
    return {
        cotizacion_id: finantial.cotizacion_id,
        cotizacion_info: finantial.cotizacion_info,
        // datos 
        planta: finantial.planta,
        generacion: finantial.generacion,
        tarifa_red: finantial.tarifa_red,
        degra_1er: finantial.degra_1er,
        degra_2do: finantial.degra_2do,
        tasa_crecimiento: finantial.tasa_crecimiento,
        tasa_descuento: finantial.tasa_descuento,
        lcoe: finantial.lcoe,
        tiempo_retorno: finantial.tiempo_retorno,
        // fechas
        created_at:finantial.created_at,
        updated_at: finantial.updated_at
    }
}

// Lectura del DB de Supabase
export function mapSupabaseRowtoFinantial(row: SupabaseFinantialRow): Finantial{
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
        // datos
        planta: row.planta?.toString() || "",
        generacion: row.generacion?.toString() || "",
        tarifa_red: row.tarifa_red?.toString() || "",
        degra_1er: row.degra_1er?.toString() || "",
        degra_2do: row.degra_2do?.toString() || "",
        tasa_crecimiento: row.tasa_crecimiento?.toString() || "",
        tasa_descuento: row.tasa_descuento?.toString() || "",
        lcoe: row.lcoe?.toString() || "",
        tiempo_retorno: row.tiempo_retorno?.toString() || "",
        // fechas
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
    }
}

// Escritura en el DB de Supabase
export function mapFinantialToSupabaseRow(finantial: FinantialFormData): SupabaseFinantialRow {
    return{
        cotizacion_id: finantial.cotizacion_id,
        // datos 
        planta: parseNumber(finantial.planta),
        generacion: parseNumber(finantial.generacion),
        tarifa_red: parseNumber(finantial.tarifa_red),
        degra_1er: parseNumber(finantial.degra_1er),
        degra_2do: parseNumber(finantial.degra_2do),
        tasa_crecimiento: parseNumber(finantial.tasa_crecimiento),
        tasa_descuento: parseNumber(finantial.tasa_descuento),
        lcoe: parseNumber(finantial.lcoe),
        tiempo_retorno: parseNumber(finantial.tiempo_retorno),
        // fechas
        created_at:finantial.created_at,
        updated_at: finantial.updated_at
    }
}
