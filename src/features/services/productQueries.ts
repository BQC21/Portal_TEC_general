import { createClient } from "@/lib/supabase/client";
import { MassiveCreateResult, Product, ProductFormData } from "@/lib/types/product-types";
import { mapSupabaseRowToProduct, mapProductToSupabaseRow } from "../mapping/mapping";
import { addCurrencyToRow } from "@/lib/utils/namingTolerance";
import { PRODUCTS_TABLE } from "@/lib/utils/namingTolerance";

// --------------------------
// ---- Operaciones CRUD ----
// --------------------------

// crear producto
export async function createProduct(product: ProductFormData): Promise<Product> {
  const supabase = createClient();
  const baseRow = mapProductToSupabaseRow(product) as Record<string, unknown>;
  const supabaseRow = await addCurrencyToRow(supabase, baseRow, product.priceInputCurrency);

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(supabaseRow)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear el producto: ${error.message}`);
  }

  return mapSupabaseRowToProduct(data);
}

// subida masiva de productos
export async function createProductsBulk(products: ProductFormData[]): Promise<MassiveCreateResult> {
  if (products.length === 0) {
    return {
      inserted: 0,
      failed: 0,
      products: [],
    };
  }

  const results = await Promise.allSettled(products.map((product) => createProduct(product)));
  const createdProducts = results
    .filter((result): result is PromiseFulfilledResult<Product> => result.status === "fulfilled")
    .map((result) => result.value);

  return {
    inserted: createdProducts.length,
    failed: results.length - createdProducts.length,
    products: createdProducts,
  };
}

// obtener productos
export async function getProducts(): Promise<Product[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select("*");

  if (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }

  return data.map(mapSupabaseRowToProduct);
}

// obtener producto por id
export async function getProductById(id: string): Promise<Product> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error al obtener el producto: ${error.message}`);
  }

  return mapSupabaseRowToProduct(data);
}

// actualizar producto
export async function updateProduct(id: string, product: ProductFormData): Promise<Product> {
  const supabase = createClient();
  const baseRow = mapProductToSupabaseRow(product) as Record<string, unknown>;
  const supabaseRow = await addCurrencyToRow(supabase, baseRow, product.priceInputCurrency);

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .update(supabaseRow)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }

  return mapSupabaseRowToProduct(data);
}

// borarr producto
export async function deleteProduct(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from(PRODUCTS_TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error al eliminar el producto: ${error.message}`);
  }
}

export async function getProductFilterOptions(): Promise<{
  types: string[];
  brands: string[];
  suppliers: string[];
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select("tipo, marca, proveedor");

  if (error) {
    throw new Error(`Error al obtener las opciones de filtrado: ${error.message}`);
  }

  const types = Array.from(new Set(data.map((item) => item.tipo).filter(Boolean)));
  const brands = Array.from(new Set(data.map((item) => item.marca).filter(Boolean)));
  const suppliers = Array.from(new Set(data.map((item) => item.proveedor).filter(Boolean)));

  return { types, brands, suppliers };
}
