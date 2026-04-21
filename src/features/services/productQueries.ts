import { createClient } from "@/lib/supabase/client";
import type { Product, ProductFormData } from "@/features/types/product-types";
import { mapSupabaseRowToProduct, mapProductToSupabaseRow } from "./mapping";

const PRODUCTS_TABLE = "productos";

const CURRENCY_COLUMN_CANDIDATES = [
  "priceInputCurrency",
  "price_input_currency",
  "fuente_divisas",
  "fuente_divisa",
  "currency_source",
  "moneda",
] as const;

let cachedCurrencyColumnName: string | null | undefined;

async function resolveCurrencyColumnName(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  if (cachedCurrencyColumnName !== undefined) {
    return cachedCurrencyColumnName;
  }

  for (const columnName of CURRENCY_COLUMN_CANDIDATES) {
    const { error } = await supabase
      .from(PRODUCTS_TABLE)
      .select(columnName)
      .limit(1);

    if (!error) {
      cachedCurrencyColumnName = columnName;
      return columnName;
    }
  }

  cachedCurrencyColumnName = null;
  return null;
}

async function addCurrencyToRow(
  supabase: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  currency: ProductFormData["priceInputCurrency"]
): Promise<Record<string, unknown>> {
  const currencyColumnName = await resolveCurrencyColumnName(supabase);

  if (!currencyColumnName) {
    return row;
  }

  return {
    ...row,
    [currencyColumnName]: currency,
  };
}

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