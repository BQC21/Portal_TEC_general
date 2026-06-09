import { createClient } from "@/lib/supabase/client";

type RowWithId = { id: string | number };

// dividir un array en partes más pequeñas
function chunkArray<T>(values: T[], chunkSize: number) {
	const chunks: T[][] = [];

	for (let index = 0; index < values.length; index += chunkSize) {
		chunks.push(values.slice(index, index + chunkSize));
	}

	return chunks;
}

// limpieza masiva
export async function bulkDeleteAllRows(tableName: string): Promise<number> {
	const supabase = createClient();
	const { data, error } = await supabase.from(tableName).select("id");

	if (error) {
		throw new Error(`No se pudo obtener el listado para limpieza masiva: ${error.message}`);
	}

	const rows = (data ?? []) as RowWithId[];

	if (rows.length === 0) {
		return 0;
	}

	for (const chunk of chunkArray(rows.map((row) => row.id), 500)) {
		const { error: deleteError } = await supabase.from(tableName).delete().in("id", chunk);

		if (deleteError) {
			throw new Error(`No se pudo completar la limpieza masiva: ${deleteError.message}`);
		}
	}

	return rows.length;
}
