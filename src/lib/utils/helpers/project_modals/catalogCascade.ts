import { ProductCategoryFilter } from "@/lib/types/components/sub_components/module_render";
import { Brand } from "@/lib/types/supabase/brand.types";
import { Type } from "@/lib/types/supabase/type-types";
import { getModalCascadeOptions } from "@/lib/utils/helpers/filters/cascadeFilterOptions";

export function matchesProductCategory(
    categoria: string | undefined,
    productCategory: ProductCategoryFilter,
) {
    return categoria === productCategory || categoria === "Ambas";
}

function withCurrentItem<T extends { nombre?: string }>(
    items: T[],
    catalog: T[],
    currentName?: string,
): T[] {
    if (!currentName || items.some((item) => item.nombre === currentName)) {
        return items;
    }

    const current = catalog.find((item) => item.nombre === currentName);
    return current ? [...items, current] : items;
}

function linkedIds(ids: Array<number | string | null | undefined>, fallbackId?: number | string | null) {
    return new Set(
        [...ids, fallbackId]
            .map((id) => String(id ?? "").trim())
            .filter(Boolean),
    );
}

function isBrandLinkedToSupplier(
    brand: Brand,
    proveedorId?: string,
    proveedorNombre?: string,
): boolean {
    const ids = linkedIds(brand.proveedor_ids ?? [], brand.proveedor_id);
    if (proveedorId && ids.has(String(proveedorId))) return true;
    if (proveedorNombre && (
        brand.proveedor_info?.nombre === proveedorNombre ||
        (brand.proveedores_info ?? []).some((supplier) => supplier.nombre === proveedorNombre)
    )) return true;
    return false;
}

function isTypeLinkedToBrand(
    type: Type,
    marcaId?: string,
    marcaNombre?: string,
): boolean {
    const ids = linkedIds(type.marca_ids ?? [], type.marca_id);
    if (marcaId && ids.has(String(marcaId))) return true;
    if (marcaNombre && (
        type.marca_info?.nombre === marcaNombre ||
        (type.marcas_info ?? []).some((brand) => brand.nombre === marcaNombre)
    )) return true;
    return false;
}

export function filterBrandsForSupplier(
    brands: Brand[],
    productCategory: ProductCategoryFilter,
    proveedorId?: string,
    proveedorNombre?: string,
    cascadeBrandNames: string[] = [],
    currentBrandName?: string,
): Brand[] {
    const inCategory = brands.filter((item) =>
        matchesProductCategory(item.categoria, productCategory),
    );
    const associated = brands.filter((item) =>
        isBrandLinkedToSupplier(item, proveedorId, proveedorNombre),
    );

    const result = associated.length > 0
        ? associated
        : inCategory.filter((item) => cascadeBrandNames.includes(item.nombre ?? ""));

    return withCurrentItem(result, brands, currentBrandName);
}

export function filterTypesForBrand(
    types: Type[],
    productCategory: ProductCategoryFilter,
    marcaId?: string,
    marcaNombre?: string,
    cascadeTypeNames: string[] = [],
    currentTypeName?: string,
): Type[] {
    const inCategory = types.filter((item) =>
        matchesProductCategory(item.categoria, productCategory),
    );
    const brandSelected = Boolean(marcaId || marcaNombre);
    const associated = inCategory.filter((item) =>
        isTypeLinkedToBrand(item, marcaId, marcaNombre),
    );
    const fromCascade = inCategory.filter((item) =>
        cascadeTypeNames.includes(item.nombre ?? ""),
    );

    const result = associated.length > 0
        ? associated
        : fromCascade.length > 0
            ? fromCascade
            : brandSelected
                ? inCategory
                : [];

    return withCurrentItem(result, inCategory, currentTypeName);
}

export function getCatalogCascadeOptions<T extends { proveedor: string; marca: string; tipo_de_producto: string }>(
    brands: Brand[],
    types: Type[],
    existingItems: T[],
    proveedor: string,
    proveedorId: string,
    marca: string,
    marcaId: string,
) {
    const fromCatalogBrands = brands
        .filter((item) => isBrandLinkedToSupplier(item, proveedorId, proveedor))
        .map((item) => item.nombre ?? "")
        .filter(Boolean);
    const fromCatalogTypes = types
        .filter((item) => isTypeLinkedToBrand(item, marcaId, marca))
        .map((item) => item.nombre ?? "")
        .filter(Boolean);
    const fromData = getModalCascadeOptions(existingItems, proveedor, marca);

    return {
        suppliers: fromData.suppliers,
        brands: fromCatalogBrands.length > 0 ? fromCatalogBrands : fromData.brands,
        types: fromCatalogTypes.length > 0 ? fromCatalogTypes : fromData.types,
    };
}

