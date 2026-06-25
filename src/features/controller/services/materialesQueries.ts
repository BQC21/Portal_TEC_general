import { createClient } from "@/lib/supabase/client";
import { Materiales, MaterialesFormData } from "@/lib/types/supabase/materiales-types";
import { mapSupabaseRowToMateriales } from "../../../lib/mapping/mapping_materiales";
import { MATERIALES_TABLE } from "@/lib/utils/namingTolerance";

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

export async function createMaterial(material: MaterialesFormData): Promise<Materiales> {
	const supabase = await createClient();
	const supabaseRow = {
		cod_prov: material.cod_prov,
		proveedor: material.proveedor,
		cod_producto: material.cod_producto,
		tipo_de_producto: material.tipo_de_producto,
		marca: material.marca,
		descripcion: material.descripcion,
		parte_electrica: material.parte_electrica,
		unidad: material.unidad,
		precio_soles: material.precio_soles,
		precio_dolares: material.precio_dolares,
		igv: material.igv / 100,
		precio_soles_igv: material.precio_soles_igv,
		precio_dolares_igv: material.precio_dolares_igv,
		created_at: material.created_at ? new Date(material.created_at) : new Date(),
		updated_at: material.updated_at ? new Date(material.updated_at) : new Date(),
	};

	const { data, error } = await supabase
		.from(MATERIALES_TABLE)
		.insert(supabaseRow)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al crear el material: ${error.message}`);
	}

	return mapSupabaseRowToMateriales(data);
}

export async function getMateriales(): Promise<Materiales[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(MATERIALES_TABLE)
		.select("*");

	if (error) {
		throw new Error(`Error al obtener los materiales: ${error.message}`);
	}

	return data.map(mapSupabaseRowToMateriales);
}

export async function getMaterialById(id: string): Promise<Materiales> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(MATERIALES_TABLE)
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`Error al obtener el material: ${error.message}`);
	}

	return mapSupabaseRowToMateriales(data);
}

export async function updateMaterial(id: string, material: MaterialesFormData): Promise<Materiales> {
	const supabase = await createClient();
	const supabaseRow = {
		cod_prov: material.cod_prov,
		proveedor: material.proveedor,
		cod_producto: material.cod_producto,
		tipo_de_producto: material.tipo_de_producto,
		marca: material.marca,
		descripcion: material.descripcion,
		parte_electrica: material.parte_electrica,
		unidad: material.unidad,
		precio_soles: material.precio_soles,
		precio_dolares: material.precio_dolares,
		igv: material.igv / 100,
		precio_soles_igv: material.precio_soles_igv,
		precio_dolares_igv: material.precio_dolares_igv,
		created_at: material.created_at ? new Date(material.created_at) : new Date(),
		updated_at: material.updated_at ? new Date(material.updated_at) : new Date(),
	};

	const { data, error } = await supabase
		.from(MATERIALES_TABLE)
		.update(supabaseRow)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`Error al actualizar el material: ${error.message}`);
	}

	return mapSupabaseRowToMateriales(data);
}

export async function deleteMaterial(id: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from(MATERIALES_TABLE)
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Error al eliminar el material: ${error.message}`);
	}
}

export async function getMaterialFilterOptions(): Promise<{
	types: string[];
	brands: string[];
	suppliers: string[];
}> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(MATERIALES_TABLE)
		.select("tipo_de_producto, marca, proveedor");

	if (error) {
		throw new Error(`Error al obtener las opciones de filtrado: ${error.message}`);
	}

	const types = Array.from(new Set(data.map((item) => item.tipo_de_producto).filter(Boolean)));
	const brands = Array.from(new Set(data.map((item) => item.marca).filter(Boolean)));
	const suppliers = Array.from(new Set(data.map((item) => item.proveedor).filter(Boolean)));

	return { types, brands, suppliers };
}
