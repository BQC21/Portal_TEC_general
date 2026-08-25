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

    const associated = inCategory.filter((item) => {
        const linkedIds = new Set([
            ...(item.proveedor_ids ?? []),
            item.proveedor_id,
        ].map((id) => String(id ?? "").trim()).filter(Boolean));
        if (proveedorId && linkedIds.has(String(proveedorId))) return true;
        if (proveedorNombre && (
            item.proveedor_info?.nombre === proveedorNombre ||
            (item.proveedores_info ?? []).some((supplier) => supplier.nombre === proveedorNombre)
        )) return true;
        return false;
    });

    const result = associated.length > 0
        ? associated
        : inCategory.filter((item) => cascadeBrandNames.includes(item.nombre ?? ""));

    return withCurrentItem(result, inCategory, currentBrandName);
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

    const associated = inCategory.filter((item) => {
        const linkedIds = new Set([
            ...(item.marca_ids ?? []),
            item.marca_id,
        ].map((id) => String(id ?? "").trim()).filter(Boolean));
        if (marcaId && linkedIds.has(String(marcaId))) return true;
        if (marcaNombre && (
            item.marca_info?.nombre === marcaNombre ||
            (item.marcas_info ?? []).some((brand) => brand.nombre === marcaNombre)
        )) return true;
        return false;
    });

    const result = associated.length > 0
        ? associated
        : inCategory.filter((item) => cascadeTypeNames.includes(item.nombre ?? ""));

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
        .filter((item) => {
            const linkedIds = new Set([
                ...(item.proveedor_ids ?? []),
                item.proveedor_id,
            ].map((id) => String(id ?? "").trim()).filter(Boolean));
            return (proveedorId && linkedIds.has(String(proveedorId))) ||
                (proveedor && (
                    item.proveedor_info?.nombre === proveedor ||
                    (item.proveedores_info ?? []).some((supplier) => supplier.nombre === proveedor)
                ));
        })
        .map((item) => item.nombre ?? "")
        .filter(Boolean);
    const fromCatalogTypes = types
        .filter((item) => {
            const linkedIds = new Set([
                ...(item.marca_ids ?? []),
                item.marca_id,
            ].map((id) => String(id ?? "").trim()).filter(Boolean));
            return (marcaId && linkedIds.has(String(marcaId))) ||
                (marca && (
                    item.marca_info?.nombre === marca ||
                    (item.marcas_info ?? []).some((brand) => brand.nombre === marca)
                ));
        })
        .map((item) => item.nombre ?? "")
        .filter(Boolean);
    const fromData = getModalCascadeOptions(existingItems, proveedor, marca);

    return {
        suppliers: fromData.suppliers,
        brands: fromCatalogBrands.length > 0 ? fromCatalogBrands : fromData.brands,
        types: fromCatalogTypes.length > 0 ? fromCatalogTypes : fromData.types,
    };
}

