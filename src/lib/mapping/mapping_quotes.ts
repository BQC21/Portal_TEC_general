import { SupabaseProjectRow } from "../types/supabase/project-types";
import { Quote, QuoteFormData, QuoteFormState, SupabaseQuoteRow } from "../types/supabase/quote-types";
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage";
import { parseNumber } from "../utils/normalization";
import { mapSupabaseRowToProject } from "./project_mapping";

// Creador de valores por defecto a partir del formulario
export function createQuoteFormStateFromQuote(quote: Quote): QuoteFormState{
    return {
        cod_cotizacion: quote.cod_cotizacion,
        proyecto_id: quote.proyecto_id,
        proyecto_info: quote.proyecto_info,
        igv: quote.igv,
        tasa_cambio: quote.tasa_cambio,
        precio_dolares: quote.precio_dolares,
        markup: quote.markup,
        gm_general: quote.gm_general,
        gm_viaticos: quote.gm_viaticos,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
    }
}

// Lectura del DB de Supabase
export function mapSupabaseRowtoQuote(row: SupabaseQuoteRow): Quote{
    return {
        id: row.id?.toString() || "",
        cod_cotizacion: row.cod_cotizacion?.toString() || "",
        proyecto_id: row.proyecto_id?.toString() || "",
        proyecto_info: row.proyecto_info ?
            mapSupabaseRowToProject(row.proyecto_info as SupabaseProjectRow)
            : row.proyectos
                ? mapSupabaseRowToProject(row.proyectos as SupabaseProjectRow)
                : undefined,
        igv: row.igv?.toString() || "",
        tasa_cambio: row.tasa_cambio?.toString() || "",
        precio_dolares: row.precio_dolares?.toString() || "",
        markup: row.markup?.toString() || "",
        gm_general: row.gm_general?.toString() || "",
        gm_viaticos: row.gm_viaticos?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
    }
}

// Escritura en el DB de Supabase
export function mapQuoteToSupabaseRow(quote: QuoteFormData): SupabaseQuoteRow {
    return{
        cod_cotizacion: quote.cod_cotizacion,
        proyecto_id: quote.proyecto_id,
        igv: parseNumber(quote.igv),
        tasa_cambio: parseNumber(quote.tasa_cambio),
        precio_dolares: parseNumber(quote.precio_dolares),
        markup: parseNumber(quote.markup) ?? 0,
        gm_general: parseNumber(quote.gm_general) ?? 0,
        gm_viaticos: parseNumber(quote.gm_viaticos) ?? 0,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
    }
}
