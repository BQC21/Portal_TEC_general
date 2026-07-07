// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

import { mapQuoteToSupabaseRow, mapSupabaseRowtoQuote } from "@/lib/mapping/mapping_quotes";
import { createClient } from "@/lib/supabase/client";
import { Quote, QuoteFormData } from "@/lib/types/supabase/quote-types";
import { QUOTE_TABLE } from "@/lib/utils/namingTolerance";

// crear
export async function createQuote(quote: QuoteFormData): Promise<Quote> {
    const supabase = createClient();
    const baseRow = mapQuoteToSupabaseRow(quote) as Record<string, unknown>;

    if (Object.prototype.hasOwnProperty.call(baseRow, "id")){
        delete (baseRow).id;
    }

    console.debug("[debug] createQuote payload:", baseRow);

    const insertQuote = async (row: Record<string, unknown>) => {
        return supabase
            .from(QUOTE_TABLE)
            .insert(row)
            .select("*,proyectos(*)");
    };

    let { data, error } = await insertQuote(baseRow);

    if (error && (error.code === "23505" || error.message.includes("cotizaciones_pkey"))) {
        const { data: lastRows, error: lastError } = await supabase
            .from(QUOTE_TABLE)
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

        if (lastError) {
            throw new Error(
                `Error al crear la cotización: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const lastIdRaw = Array.isArray(lastRows) && lastRows.length > 0 ? lastRows[0]?.id : null;
        const lastId = Number(lastIdRaw);

        if (!Number.isFinite(lastId)) {
            throw new Error(
                `Error al crear la cotización: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const retryRow = { ...baseRow, id: lastId + 1 };
        console.warn("[debug] Retrying createQuote with explicit id:", retryRow.id);
        ({ data, error } = await insertQuote(retryRow));
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