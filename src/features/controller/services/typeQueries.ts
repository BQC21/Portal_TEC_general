import { mapSupabaseRowToType, mapTypeToSupabaseRow } from "@/lib/mapping/mapping_type";
import { createClient } from "@/lib/supabase/client";
import { Type, TypeFormData } from "@/lib/types/supabase/type-types";
import { TYPE_TABLE } from "@/lib/utils/namingTolerance";

export async function createType(type: TypeFormData): Promise<Type> {
	const supabase = await createClient();
	const supabaseRow = mapTypeToSupabaseRow(type) as Record<string, unknown>;

	const { data, error } = await supabase
		.from(TYPE_TABLE)
		.insert(supabaseRow)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al crear el tipo: ${error.message}`);
	}

	return mapSupabaseRowToType(data);
}

export async function getTypes(): Promise<Type[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(TYPE_TABLE)
		.select("*");
    
        if (error) {
            throw new Error(`Error al obtener los tipos: ${error.message}`);
        }

        return data.map(mapSupabaseRowToType);
}

export async function getTypeById(id: string): Promise<Type> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(TYPE_TABLE)
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(`Error al obtener el tipo: ${error.message}`);
    }

    return mapSupabaseRowToType(data);
}

export async function updateType(id: string, type: TypeFormData): Promise<Type> {
	const supabase = await createClient();
	const supabaseRow = mapTypeToSupabaseRow(type) as Record<string, unknown>;

	const { data, error } = await supabase
		.from(TYPE_TABLE)
		.update(supabaseRow)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al actualizar el tipo: ${error.message}`);
    }

    return mapSupabaseRowToType(data);
}

export async function deleteType(id: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from(TYPE_TABLE)
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Error al eliminar el tipo: ${error.message}`);
	}
}