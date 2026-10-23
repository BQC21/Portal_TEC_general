import { createClient } from "@/features/model/supabase/client";
import { TypeProperty, columnAlreadyExists, tablesForCategory } from "@/lib/utils/consts/typeProperties";

export async function ensureTypePropertyColumns(
    categoria: string | undefined,
    properties: TypeProperty[],
): Promise<void> {
    const tables = tablesForCategory(categoria);
    const supabase = await createClient();

    for (const property of properties) {
        for (const table of tables) {
            if (columnAlreadyExists(table, property.columna)) continue;
            const { error } = await supabase.rpc("add_nullable_catalog_column", {
                target_table: table,
                column_name: property.columna,
            });
            if (error) {
                throw new Error(
                    `No se pudo crear la columna ${property.columna} en ${table}. ${error.message}`,
                );
            }
        }
    }
}
