import { createClient } from "@/lib/supabase/client";
import { Zone,  ZoneFormData } from "@/lib/types/supabase/zone-types";
import { mapSupabaseRowToZone, mapZoneToSupabaseRow } from "../../../lib/mapping/zone_mapping";
import { ZONE_TABLE } from "@/lib/utils/namingTolerance";

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

// crear zona
export async function createZone(zone: ZoneFormData): Promise<Zone> {
    const supabase = createClient();
    const baseRow = mapZoneToSupabaseRow(zone) as Record<string, unknown>;

    const { data, error } = await supabase
    .from(ZONE_TABLE)
    .insert(baseRow)
    .select()
    .single();

    if (error) {
        throw new Error(`Error al crear la zona: ${error.message}`);
    }

    return mapSupabaseRowToZone(data);
}

// obtener zonas
export async function getZones(): Promise<Zone[]> {
    const supabase = createClient();

    const { data, error } = await supabase
    .from(ZONE_TABLE)
    .select("*");

    if (error) {
        throw new Error(`Error al obtener las zonas: ${error.message}`);
    }

    return data.map(mapSupabaseRowToZone);
}

// obtener zona por id
export async function getZoneById(id: string): Promise<Zone> {
    const supabase = createClient();

    const { data, error } = await supabase
    .from(ZONE_TABLE)
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
        throw new Error(`Error al obtener las zonas: ${error.message}`);
    }

    return mapSupabaseRowToZone(data);
}

// actualizar zona
export async function updateZone(id: string, zone: ZoneFormData): Promise<Zone> {
    const supabase = createClient();
    const baseRow = mapZoneToSupabaseRow(zone) as Record<string, unknown>;

    const { data, error } = await supabase
    .from(ZONE_TABLE)
    .update(baseRow)
    .eq("id", id)
    .select()
    .single();

    if (error) {
        throw new Error(`Error al actualizar las zonas: ${error.message}`);
    }

    return mapSupabaseRowToZone(data);
}

// borrar zona
export async function deleteZone(id: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
    .from(ZONE_TABLE)
    .delete()
    .eq("id", id);

    if (error) {
        throw new Error(`Error al eliminar las zonas: ${error.message}`);
    }
}