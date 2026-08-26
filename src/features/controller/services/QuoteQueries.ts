// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

import { mapQuoteToSupabaseRow, mapSupabaseRowtoQuote } from "@/lib/mapping/mapping_quotes";
import { createClient } from "@/lib/supabase/client";
import { Quote, QuoteFormData } from "@/lib/types/supabase/quote-types";
import { getQuoteCode } from "@/lib/utils/helpers/manage_info/getQuoteCode";
import { QUOTE_TABLE } from "@/lib/utils/namingTolerance";

type PostgrestErrorLike = {
    code?: string;
    message?: string;
} | null;

function isUniqueViolation(error: PostgrestErrorLike) {
    return error?.code === "23505" || Boolean(error?.message?.includes("duplicate key"));
}

function isQuoteCodeUniqueViolation(error: PostgrestErrorLike) {
    const message = error?.message ?? "";
    return isUniqueViolation(error) && message.includes("cod_cotizacion");
}

function isQuotePkeyViolation(error: PostgrestErrorLike) {
    const message = error?.message ?? "";
    return isUniqueViolation(error) && (
        message.includes("cotizaciones_pkey") ||
        message.includes("cotizacion_pkey")
    );
}

async function fetchQuoteCodes(supabase: ReturnType<typeof createClient>) {
    const { data, error } = await supabase
        .from(QUOTE_TABLE)
        .select("cod_cotizacion");

    if (error) {
        throw new Error(`Error al leer códigos de cotización: ${error.message}`);
    }

    return (data ?? [])
        .map((row) => String(row.cod_cotizacion ?? ""))
        .filter(Boolean);
}

async function fetchLastQuoteId(supabase: ReturnType<typeof createClient>) {
    const { data, error } = await supabase
        .from(QUOTE_TABLE)
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

    if (error) return null;

    const lastIdRaw = Array.isArray(data) && data.length > 0 ? data[0]?.id : null;
    const lastId = Number(lastIdRaw);
    return Number.isFinite(lastId) ? lastId : null;
}

// crear
export async function createQuote(quote: QuoteFormData): Promise<Quote> {
    const supabase = createClient();
    const baseRow = mapQuoteToSupabaseRow(quote) as Record<string, unknown>;

    if (Object.prototype.hasOwnProperty.call(baseRow, "id")){
        delete (baseRow).id;
    }

    const existingCodes = await fetchQuoteCodes(supabase);
    baseRow.cod_cotizacion = getQuoteCode(existingCodes);

    console.debug("[debug] createQuote payload:", baseRow);

    const insertQuote = async (row: Record<string, unknown>) => {
        return supabase
            .from(QUOTE_TABLE)
            .insert(row)
            .select("*,proyectos(*)");
    };

    let { data, error } = await insertQuote(baseRow);
    let attempts = 0;

    while (error && isUniqueViolation(error) && attempts < 5) {
        attempts += 1;

        if (isQuoteCodeUniqueViolation(error)) {
            const codes = await fetchQuoteCodes(supabase);
            baseRow.cod_cotizacion = getQuoteCode(codes);
            console.warn("[debug] Retrying createQuote with next code:", baseRow.cod_cotizacion);
            ({ data, error } = await insertQuote(baseRow));
            continue;
        }

        if (isQuotePkeyViolation(error) || isUniqueViolation(error)) {
            const lastId = await fetchLastQuoteId(supabase);
            if (lastId == null) break;

            const retryRow = { ...baseRow, id: lastId + 1 };
            console.warn("[debug] Retrying createQuote with explicit id:", retryRow.id);
            ({ data, error } = await insertQuote(retryRow));
            continue;
        }

        break;
    }

    if (error) {
        throw new Error(`Error al crear la cotización: ${error.message} - ${JSON.stringify(error)}`)
    }

    const created = Array.isArray(data) ? data[0] : data;

    if (!created){
        throw new Error("La inserción no devolvió ningún registro.");
    }
    return mapSupabaseRowtoQuote(created);
}

// obtener
export async function getQuotes(): Promise<Quote[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from(QUOTE_TABLE)
        .select("*,proyectos(*)");

    if (error) {
        throw new Error(`Error al obtener las cotizaciones: ${error.message}`);
    }

    return data.map(mapSupabaseRowtoQuote);
}

// obtener por id
export async function getQuoteById(id: string): Promise<Quote> {
    const supabase = createClient();

    const { data, error } = await supabase.from(QUOTE_TABLE)
        .select("*,proyectos(*)")
        .eq("id", id)
        .single()

    if (error) {
        throw new Error(`Error al obtener la cotización: ${error.message}`);
    }

    return mapSupabaseRowtoQuote(data);
}

// actualizar
export async function updateQuote(id: string, quote: QuoteFormData): Promise<Quote> {
    const supabase = createClient();
    const baseRow = mapQuoteToSupabaseRow(quote) as Record<string, unknown>;

    const { error } = await supabase.from(QUOTE_TABLE)
    .update(baseRow)
    .eq("id", id)

    if (error) {
        throw new Error(`Error al actualizar la cotización: ${error.message}`);
    }

    return await getQuoteById(id);
}

// remover
export async function deleteQuote(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from(QUOTE_TABLE).delete().eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar la cotización: ${error.message}`);
    }
}