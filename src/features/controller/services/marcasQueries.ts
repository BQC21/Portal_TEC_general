import { hydrateBrandSuppliers, mapBrandToSupabaseRow, mapSupabaseRowToBrand } from "@/lib/mapping/mapping_marcas";
import { mapSupabaseRowToSupplier } from "@/lib/mapping/mapping_proveedores";
import { createClient } from "@/lib/supabase/client";
import { Brand, BrandFormData } from "@/lib/types/supabase/brand.types";
import { BRAND_TABLE, SUPPLIER_TABLE } from "@/lib/utils/namingTolerance";

async function hydrateBrands(supabase: Awaited<ReturnType<typeof createClient>>, brands: Brand[]): Promise<Brand[]> {
	const { data, error } = await supabase.from(SUPPLIER_TABLE).select("*");
	if (error) {
		throw new Error(`Error al obtener los proveedores: ${error.message}`);
	}
	const suppliers = (data ?? []).map(mapSupabaseRowToSupplier);
	return brands.map((brand) => hydrateBrandSuppliers(brand, suppliers));
}

export async function createMarca(marca: BrandFormData): Promise<Brand> {
	const supabase = await createClient();
	const supabaseRow = mapBrandToSupabaseRow(marca) as Record<string, unknown>;

	const { data, error } = await supabase
		.from(BRAND_TABLE)
		.insert(supabaseRow)
		.select("*,proveedores(*)")
		.single();

	if (error) {
		throw new Error(`Error al crear la marca: ${error.message}`);
	}

	const [brand] = await hydrateBrands(supabase, [mapSupabaseRowToBrand(data)]);
	return brand;
}

export async function getMarcas(): Promise<Brand[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(BRAND_TABLE)
		.select("*,proveedores(*)");

	if (error) {
		throw new Error(`Error al obtener las marcas: ${error.message}`);
	}

	return hydrateBrands(supabase, data.map(mapSupabaseRowToBrand));
}

export async function getMarcasbyId(id: string): Promise<Brand> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(BRAND_TABLE)
		.select("*,proveedores(*)")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`Error al obtener la marca: ${error.message}`);
	}

    const [brand] = await hydrateBrands(supabase, [mapSupabaseRowToBrand(data)]);
    return brand;
}

export async function updateMarca(id: string, marca: BrandFormData): Promise<Brand> {
	const supabase = await createClient();
	const supabaseRow = mapBrandToSupabaseRow(marca) as Record<string, unknown>;

	const { data, error } = await supabase
		.from(BRAND_TABLE)
		.update(supabaseRow)
		.eq("id", id)
		.select("*,proveedores(*)")
		.single();

	if (error) {
		throw new Error(`Error al actualizar la marca: ${error.message}`);
	}

	const [brand] = await hydrateBrands(supabase, [mapSupabaseRowToBrand(data)]);
	return brand;
}

export async function deleteMarca(id: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from(BRAND_TABLE)
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Error al eliminar la marca: ${error.message}`);
	}
}