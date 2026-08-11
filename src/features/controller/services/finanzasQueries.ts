import { mapFinantialToSupabaseRow, mapSupabaseRowtoFinantial } from "@/lib/mapping/mapping_finantial";
import { createClient } from "@/lib/supabase/client";
import { Finantial, FinantialFormData } from "@/lib/types/supabase/finantial-types";
import { FINANTIAL_TABLE } from "@/lib/utils/namingTolerance";

// crear
export async function createFinantial(finantial: FinantialFormData): Promise<Finantial> {
    const supabase = createClient();
    const baseRow = mapFinantialToSupabaseRow(finantial) as Record<string, unknown>;

    if (Object.prototype.hasOwnProperty.call(baseRow, "id")){
        delete (baseRow).id;
    }

    console.debug("[debug] createReport payload:", baseRow);

    const insertFinantial = async (row: Record<string, unknown>) => {
        return supabase
            .from(FINANTIAL_TABLE)
            .insert(row)
            .select("*,cotizacion(*, proyectos(*))");
    };

    let { data, error } = await insertFinantial(baseRow);

    if (error && (error.code === "23505" || error.message.includes("finantial_pkey"))) {
        const { data: lastRows, error: lastError } = await supabase
            .from(FINANTIAL_TABLE)
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

        if (lastError) {
            throw new Error(
                `Error al crear el análisis financiero: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const lastIdRaw = Array.isArray(lastRows) && lastRows.length > 0 ? lastRows[0]?.id : null;
        const lastId = Number(lastIdRaw);

        if (!Number.isFinite(lastId)) {
            throw new Error(
                `Error al crear el análisis financiero: ${error.message} - ${JSON.stringify(error)}`
            );
        }

        const retryRow = { ...baseRow, id: lastId + 1 };
        console.warn("[debug] Retrying createReport with explicit id:", retryRow.id);
        ({ data, error } = await insertFinantial(retryRow));
    }

    if (error) {
        throw new Error(`Error al crear el análisis financiero: ${error.message} - ${JSON.stringify(error)}`)
    }

    const created = Array.isArray(data) ? data[0] : data;

    if (!created){
        throw new Error("La inserción no devolvió ningún registro.");
    }
    return mapSupabaseRowtoFinantial(created);
}

// obtener
export async function getFinantial(): Promise<Finantial[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from(FINANTIAL_TABLE)
        .select("*,cotizacion(*, proyectos(*))");

    if (error) {
        throw new Error(`Error al obtener los análisis financieros: ${error.message}`);
    }

    return data.map(mapSupabaseRowtoFinantial);
}

// obtener por id
export async function getFinantialById(id: string): Promise<Finantial> {
    const supabase = createClient();

    const { data, error } = await supabase.from(FINANTIAL_TABLE)
        .select("*,cotizacion(*, proyectos(*))")
        .eq("id", id)
        .single()

    if (error) {
        throw new Error(`Error al obtener el análisis financiero: ${error.message}`);
    }

    return mapSupabaseRowtoFinantial(data);
}

// actualizar
export async function updateFinantial(id: string, finantial: FinantialFormData): Promise<Finantial> {
    const supabase = createClient();
    const baseRow = mapFinantialToSupabaseRow(finantial) as Record<string, unknown>;

    const { error } = await supabase.from(FINANTIAL_TABLE)
    .update(baseRow)
    .eq("id", id)

    if (error) {
        throw new Error(`Error al actualizar el análisis financiero: ${error.message}`);
    }

    return await getFinantialById(id);
}

// remover
export async function deleteFinantial(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.from(FINANTIAL_TABLE).delete().eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar el análisis financiero: ${error.message}`);
    }
}