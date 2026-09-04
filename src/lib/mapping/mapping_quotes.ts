import { EatingItem, ManualCosts, MontoItem } from "../types/components/Quotes/manual_resources";
import { SupabaseProjectRow } from "../types/supabase/project-types";
import { Quote, QuoteFormData, QuoteFormState, SupabaseQuoteRow } from "../types/supabase/quote-types";
import { parseNullableDate } from "../utils/helpers/manage_info/date_manage";
import { INITIAL_MANUAL_RESOURCE_COSTS } from "../utils/initialValues";
import { parseNumber } from "../utils/normalization";
import { mapSupabaseRowToProject } from "./project_mapping";

function normalizeEatingItems(saved: unknown, defaults: EatingItem[]): EatingItem[] {
    if (Array.isArray(saved)) {
        return saved.length > 0 ? saved : defaults;
    }

    if (saved && typeof saved === "object" && "monto" in saved) {
        const legacy = saved as MontoItem;
        return [{
            id: crypto.randomUUID(),
            descripcion: "Alimentación",
            monto: legacy.monto ?? 0,
            personas: legacy.personas ?? 0,
            dias: legacy.dias ?? 0,
        }];
    }

    return defaults;
}

function normalizeManualCosts(costs?: ManualCosts | null): ManualCosts {
    const defaults = INITIAL_MANUAL_RESOURCE_COSTS;
    const saved = costs ?? defaults;

    return {
        Recursos: {
            ...defaults.Recursos,
            ...saved.Recursos,
            consumible: Array.isArray(saved.Recursos?.consumible)
                ? saved.Recursos.consumible
                : defaults.Recursos.consumible,
            epp: Array.isArray(saved.Recursos?.epp) ? saved.Recursos.epp : defaults.Recursos.epp,
            tooling: Array.isArray(saved.Recursos?.tooling) ? saved.Recursos.tooling : defaults.Recursos.tooling,
            personal: Array.isArray(saved.Recursos?.personal) ? saved.Recursos.personal : defaults.Recursos.personal,
            sctr: Array.isArray(saved.Recursos?.sctr) ? saved.Recursos.sctr : defaults.Recursos.sctr,
            considerar_epp_reutilizable:
                saved.Recursos?.considerar_epp_reutilizable ??
                defaults.Recursos.considerar_epp_reutilizable,
            equipos_seleccionados: saved.Recursos?.equipos_seleccionados,
            materiales_seleccionados: saved.Recursos?.materiales_seleccionados,
        },
        Viaticos: {
            ...defaults.Viaticos,
            ...saved.Viaticos,
            // eating: normalizeEatingItems(saved.Viaticos?.eating, defaults.Viaticos.eating),
            // traveling: {
            //     ...defaults.Viaticos.traveling,
            //     ...saved.Viaticos?.traveling,
            // },
            // mobility: {
            //     ...defaults.Viaticos.mobility,
            //     ...saved.Viaticos?.mobility,
            // },
            // hotel: {
            //     ...defaults.Viaticos.hotel,
            //     ...saved.Viaticos?.hotel,
            // },
            gastos_viaje:{
                ...defaults.Viaticos.gastos_viaje,
                ...saved.Viaticos?.gastos_viaje,
            },
            courier: saved.Viaticos?.courier?.length
                ? saved.Viaticos.courier
                : defaults.Viaticos.courier,
        },
    };
}

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
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        costos_manuales: normalizeManualCosts(quote.costos_manuales),
        depre_tool: quote.depre_tool,
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
        created_at: parseNullableDate(row.created_at) ?? new Date(),
        updated_at: parseNullableDate(row.updated_at) ?? new Date(),
        costos_manuales: normalizeManualCosts(row.costos_manuales as ManualCosts | null),
        depre_tool: row.depre_tool?.toString() || "",
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
        gm: parseNumber(quote.gm) ?? 0,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        costos_manuales: quote.costos_manuales
            ? JSON.parse(JSON.stringify(quote.costos_manuales))
            : quote.costos_manuales,
        depre_tool: parseNumber(quote.depre_tool) ?? 0,
    }
}
