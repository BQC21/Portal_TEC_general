import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { SupabaseProjectRow } from "@/lib/types/supabase/project-types";
import { Quote, QuoteFormData, QuoteFormState, SupabaseQuoteRow } from "@/lib/types/supabase/quote-types";
import { parseNullableDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { normalizeManualCosts, parseNumber } from "@/lib/utils/normalization";
import { mapSupabaseRowToProject } from "./project_mapping";

// ---------------------------
// -- Mapeadores -------------
// ---------------------------

// Creador de valores por defecto asociado a costos manuales
export function createManualCostsFromQuote(quote: Quote): ManualCosts {
    return normalizeManualCosts(quote.costos_manuales);
}

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
        gm: quote.gm,
        nombre_cotizacion: quote.nombre_cotizacion,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        costos_manuales: normalizeManualCosts(quote.costos_manuales),
        depre_tool: quote.depre_tool,
        version: quote.version,
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
        gm: row.gm?.toString() || "",
        nombre_cotizacion: row.nombre_cotizacion?.toString() || "",
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        costos_manuales: normalizeManualCosts(row.costos_manuales as ManualCosts | null),
        depre_tool: row.depre_tool?.toString() || "",
        version: row.version?.toString() || "",
    }
}

// Escritura en el DB de Supabase
export function mapQuoteToSupabaseRow(quote: QuoteFormData): SupabaseQuoteRow {
    return{
        cod_cotizacion: quote.cod_cotizacion,
        proyecto_id: quote.proyecto_id?.toString().trim() ? quote.proyecto_id : null,
        igv: parseNumber(quote.igv),
        tasa_cambio: parseNumber(quote.tasa_cambio),
        precio_dolares: parseNumber(quote.precio_dolares),
        markup: parseNumber(quote.markup) ?? 0,
        gm_general: parseNumber(quote.gm_general) ?? 0,
        gm_viaticos: parseNumber(quote.gm_viaticos) ?? 0,
        gm: parseNumber(quote.gm) ?? 0,
        nombre_cotizacion: quote.nombre_cotizacion,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        costos_manuales: quote.costos_manuales
            ? JSON.parse(JSON.stringify(quote.costos_manuales))
            : quote.costos_manuales,
        depre_tool: parseNumber(quote.depre_tool) ?? 0,
        version: quote.version?.trim() ? quote.version.trim() : null,
    }
}
