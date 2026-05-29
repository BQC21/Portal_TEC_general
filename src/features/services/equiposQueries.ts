import { createClient } from "@/lib/supabase/client";
import { Equipos, EquiposFormData } from "@/lib/types/equipos-types";
import { mapSupabaseRowToEquipos } from "../../lib/mapping/mapping_equipos";
import { EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

export async function createEquipo(equipo: EquiposFormData): Promise<Equipos> {
	const supabase = await createClient();
	const supabaseRow = {
		cod_prov: equipo.cod_prov,
		proveedor: equipo.proveedor,
		cod_producto: equipo.cod_producto,
		tipo_de_producto: equipo.tipo_de_producto,
		marca: equipo.marca,
		descripcion: equipo.descripcion,
		tipo_de_conexion: equipo.tipo_conexion,
		potencia_maxima: equipo.potencia_maxima,
		mppt_dod: equipo.mppt_dod,
		potencia_ac: equipo.potencia_ac,
		voc_vmax: equipo.voc_vmax,
		vmpp_vmin: equipo.vmpp_vmin,
		isc_imax_in: equipo.isc_imax_in,
		impp_imax_out: equipo.impp_imax_out,
		unidad: equipo.unidad,
		precio_soles: equipo.precio_soles,
		precio_dolares: equipo.precio_dolares,
		igv: equipo.igv / 100,
		precio_soles_igv: equipo.precio_soles_igv,
		precio_dolares_igv: equipo.precio_dolares_igv,
		created_at: equipo.created_at ? new Date(equipo.created_at) : new Date(),
		updated_at: equipo.updated_at ? new Date(equipo.updated_at) : new Date(),
	};

	const { data, error } = await supabase
		.from(EQUIPOS_TABLE)
		.insert(supabaseRow)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al crear el equipo: ${error.message}`);
	}

	return mapSupabaseRowToEquipos(data);
}

export async function getEquipos(): Promise<Equipos[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(EQUIPOS_TABLE)
		.select("*");

	if (error) {
		throw new Error(`Error al obtener los equipos: ${error.message}`);
	}

	return data.map(mapSupabaseRowToEquipos);
}

export async function getEquipoById(id: string): Promise<Equipos> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(EQUIPOS_TABLE)
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`Error al obtener el equipo: ${error.message}`);
	}

	return mapSupabaseRowToEquipos(data);
}

export async function updateEquipo(id: string, equipo: EquiposFormData): Promise<Equipos> {
	const supabase = await createClient();
	const supabaseRow = {
		cod_prov: equipo.cod_prov,
		proveedor: equipo.proveedor,
		cod_producto: equipo.cod_producto,
		tipo_de_producto: equipo.tipo_de_producto,
		marca: equipo.marca,
		descripcion: equipo.descripcion,
		tipo_de_conexion: equipo.tipo_conexion,
		potencia_maxima: equipo.potencia_maxima,
		mppt_dod: equipo.mppt_dod,
		potencia_ac: equipo.potencia_ac,
		voc_vmax: equipo.voc_vmax,
		vmpp_vmin: equipo.vmpp_vmin,
		isc_imax_in: equipo.isc_imax_in,
		impp_imax_out: equipo.impp_imax_out,
		unidad: equipo.unidad,
		precio_soles: equipo.precio_soles,
		precio_dolares: equipo.precio_dolares,
		igv: equipo.igv / 100,
		precio_soles_igv: equipo.precio_soles_igv,
		precio_dolares_igv: equipo.precio_dolares_igv,
		created_at: equipo.created_at ? new Date(equipo.created_at) : new Date(),
		updated_at: equipo.updated_at ? new Date(equipo.updated_at) : new Date(),
	};

	const { data, error } = await supabase
		.from(EQUIPOS_TABLE)
		.update(supabaseRow)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al actualizar el equipo: ${error.message}`);
	}

	return mapSupabaseRowToEquipos(data);
}

export async function deleteEquipo(id: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from(EQUIPOS_TABLE)
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Error al eliminar el equipo: ${error.message}`);
	}
}

export async function getEquipoFilterOptions(): Promise<{
	types: string[];
	brands: string[];
	suppliers: string[];
}> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(EQUIPOS_TABLE)
		.select("tipo_de_producto, marca, proveedor");

	if (error) {
		throw new Error(`Error al obtener las opciones de filtrado: ${error.message}`);
	}

	const types = Array.from(new Set(data.map((item) => item.tipo_de_producto).filter(Boolean)));
	const brands = Array.from(new Set(data.map((item) => item.marca).filter(Boolean)));
	const suppliers = Array.from(new Set(data.map((item) => item.proveedor).filter(Boolean)));

	return { types, brands, suppliers };
}
