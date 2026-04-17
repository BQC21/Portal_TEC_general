import type { Product, ProductFormData } from "@/features/types/product-types";

export type SupabaseProductRow = {
  id?: number | string;
  cod_prov?: string;
  proveedor?: string;
  codigo?: string;
  tipo?: string;
  marca?: string;
  unidad?: string;
  descripcion?: string;
  tipo_conexion?: string;
  pot_maxima?: number;
  mppt?: number;
  dod?: number;
  array_mppt?: number;
  voc?: number;
  vmpp?: number;
  isc?: number;
  impp?: number;
  precio_soles?: number;
  precio_dolares?: number;
  precio_soles_igv?: number;
  precio_dolares_igv?: number;
  igv?: number;
  fuente_electrica?: string;
  power_source?: string;
  beta_percent?: number;
};

/**
 * Map Supabase row format to Product type for frontend consumption
 */
export function mapSupabaseRowToProduct(
  row: SupabaseProductRow
): Product {
  return {
    id: row.id?.toString() || "",
    supplierCode: row.cod_prov || "",
    supplier: row.proveedor || "",
    code: row.codigo || "",
    type: row.tipo || "",
    brand: row.marca || "",
    unit: row.unidad || "",
    description: row.descripcion || "",
    connectionType: row.tipo_conexion || "",
    maxPower: row.pot_maxima?.toString() || "",
    mpptNumber: row.mppt?.toString() || "",
    dod: row.dod?.toString() || "",
    arraysPerMppt: row.array_mppt?.toString() || "",
    voc: row.voc?.toString() || "",
    vmpp: row.vmpp?.toString() || "",
    isc: row.isc?.toString() || "",
    impp: row.impp?.toString() || "",
    priceInputCurrency: "PEN",
    pricePen: row.precio_soles || 0,
    priceUsd: row.precio_dolares || 0,
    igv: row.igv ? row.igv * 100 : 0,
    powerSource: row.fuente_electrica || row.power_source || "",
    precio_soles_igv: row.precio_soles_igv || 0,
    precio_dolares_igv: row.precio_dolares_igv || 0,
    beta_percent: row.beta_percent || 0,
  };
}

/**
 * Map Product form data to Supabase row format for database operations
 */
export function mapProductToSupabaseRow(
  product: ProductFormData
): SupabaseProductRow {
  return {
    cod_prov: product.supplierCode,
    proveedor: product.supplier,
    codigo: product.code,
    tipo: product.type,
    marca: product.brand,
    unidad: product.unit,
    descripcion: product.description,
    tipo_conexion: product.connectionType,
    pot_maxima: Number(product.maxPower) || undefined,
    mppt: Number(product.mpptNumber) || undefined,
    dod: Number(product.dod) || undefined,
    array_mppt: Number(product.arraysPerMppt) || undefined,
    voc: Number(product.voc) || undefined,
    vmpp: Number(product.vmpp) || undefined,
    isc: Number(product.isc) || undefined,
    impp: Number(product.impp) || undefined,
    precio_soles: product.pricePen,
    precio_dolares: product.priceUsd,
    igv: product.igv / 100,
    fuente_electrica: product.powerSource,
    beta_percent: Number(product.beta_percent) || undefined,
  };
}