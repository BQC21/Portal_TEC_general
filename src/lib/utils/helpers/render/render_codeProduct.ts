import type { ProductCategoryFilter } from "@/lib/types/components/sub_components/module_render";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { getSupplierInfo } from "../manage_info/getInfo";
import { getProductTypeCode } from "../manage_info/getCode";

export function shouldRender_CodeProduct(
    tipo: TypeFormstate,
    proveedor: SupplierFormstate,
    productCategory?: ProductCategoryFilter,
) {
    return Boolean(getProductCodePrefix(tipo, proveedor, productCategory));
}

function getProductCodePrefix(
    tipo: TypeFormstate,
    proveedor: SupplierFormstate,
    productCategory?: ProductCategoryFilter,
) {
    const productCode = getProductTypeCode(tipo, productCategory);
    const { supplierCode } = getSupplierInfo(proveedor);

    if (!productCode || !supplierCode) return "";

    return `${productCode}${supplierCode}`;
}

export function getNextProductRowNumber(
    products: { cod_producto: string }[],
    tipo: TypeFormstate,
    proveedor: SupplierFormstate,
    productCategory?: ProductCategoryFilter,
) {
    const prefix = getProductCodePrefix(tipo, proveedor, productCategory);
    if (!prefix) return 1;

    const max = products.reduce((acc, item) => {
        const code = item.cod_producto ?? "";
        if (!code.startsWith(prefix)) return acc;

        const n = Number(code.slice(prefix.length));
        return Number.isFinite(n) ? Math.max(acc, n) : acc;
    }, 0);

    return max + 1;
}

export function buildProductCode(
    tipo: TypeFormstate,
    proveedor: SupplierFormstate,
    rowNumber: number,
    productCategory?: ProductCategoryFilter,
) {
    const prefix = getProductCodePrefix(tipo, proveedor, productCategory);

    if (!prefix || rowNumber < 1) {
        return "";
    }

    return `${prefix}${String(rowNumber).padStart(5, "0")}`;
}

export function buildNextProductCode(
    products: { cod_producto: string }[],
    tipo: TypeFormstate,
    proveedor: SupplierFormstate,
    productCategory?: ProductCategoryFilter,
) {
    return buildProductCode(
        tipo,
        proveedor,
        getNextProductRowNumber(products, tipo, proveedor, productCategory),
        productCategory,
    );
}
