import { mapSupabaseRowToSupplier, mapSupplierToSupabaseRow } from "@/lib/mapping/mapping_proveedores";
import { createClient } from "@/lib/supabase/client";
import { Supplier, SupplierFormData } from "@/lib/types/supabase/supplier-types";
import { SUPPLIER_TABLE } from "@/lib/utils/namingTolerance";

function proveedorMutationError(action: string, message: string): Error {
	if (message.includes("proveedores_ruc_key")) {
		return new Error("Ya existe un proveedor con ese RUC.");
	}
	if (message.includes("proveedores_codigo_key")) {
		return new Error("Ya existe un proveedor con ese código.");
	}
	if (message.includes("proveedores_nombre_key")) {
		return new Error("Ya existe un proveedor con ese nombre.");
	}
	return new Error(`Error al ${action} el proveedor: ${message}`);
}

export async function createProveedor(supplier: SupplierFormData): Promise<Supplier> {
	const supabase = await createClient();
	const supabaseRow = mapSupplierToSupabaseRow(supplier) as Record<string, unknown>;

	const { data, error } = await supabase
		.from(SUPPLIER_TABLE)
		.insert(supabaseRow)
		.select()
		.single();

	if (error) {
		throw proveedorMutationError("crear", error.message);
	}

	return mapSupabaseRowToSupplier(data);
}

export async function getProveedor(): Promise<Supplier[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(SUPPLIER_TABLE)
		.select("*");

	if (error) {
		throw new Error(`Error al obtener los proveedores: ${error.message}`);
	}

	return data.map(mapSupabaseRowToSupplier);
}

export async function getProveedorById(id: string): Promise<Supplier> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from(SUPPLIER_TABLE)
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(`Error al obtener el proveedor: ${error.message}`);
	}

	return mapSupabaseRowToSupplier(data);
}

export async function updateProveedor(id: string, supplier: SupplierFormData): Promise<Supplier> {
	const supabase = await createClient();
	const supabaseRow = mapSupplierToSupabaseRow(supplier) as Record<string, unknown>;


	const { data, error } = await supabase
		.from(SUPPLIER_TABLE)
		.update(supabaseRow)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw proveedorMutationError("actualizar", error.message);
	}

	return mapSupabaseRowToSupplier(data);
}

export async function deleteProveedor(id: string): Promise<void> {
	const supabase = await createClient();

	const { error } = await supabase
		.from(SUPPLIER_TABLE)
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Error al eliminar el proveedor: ${error.message}`);
	}
}