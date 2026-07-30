import { getSupplierInfo } from "../manage_info/getInfo";
import { getProductTypeCode } from "../manage_info/getCode";

// -----------------------------
// renderizar el código del producto
// -----------------------------

export type codeRender = {
    type: string,
    supplier: string,
    getProductType: (type: string)=> string,
    getSupplierInfo: (supplier: string)=>{
        [key: string]: {
            RUC: string;
            supplierCode: string;
        };
    }
}

// Confirma si se necesita la asignacion automatica del codigo del producto
export function shouldRender_CodeProduct({type, supplier, getProductType, getSupplierInfo}: codeRender) {
    const productCode = getProductType(type);
    const { supplierCode } = getSupplierInfo(supplier);

    return Boolean(productCode && supplierCode);
}
function getProductCodePrefix(type: string, supplier: string) {
    const productCode = getProductTypeCode(type); // "E" o "M"
    const { supplierCode } = getSupplierInfo(supplier); // "ANDE", "SIGE", etc.

    if (!productCode || !supplierCode) return "";

    return `${productCode}${supplierCode}`;
}

// Siguiente correlativo: max(número en códigos del prefijo) + 1 (evita colisiones por huecos/borrados)
export function getNextProductRowNumber(
    products: { cod_producto: string }[],
    type: string,
    supplier: string,
) {
    const prefix = getProductCodePrefix(type, supplier);
    if (!prefix) return 1;

    const max = products.reduce((acc, item) => {
        const code = item.cod_producto ?? "";
        if (!code.startsWith(prefix)) return acc;

        const n = Number(code.slice(prefix.length));
        return Number.isFinite(n) ? Math.max(acc, n) : acc;
    }, 0);

    return max + 1;
}

// construye el código del producto a partir del tipo de producto, proveedor y número de fila
export function buildProductCode(type: string, supplier: string, rowNumber: number) {
    const prefix = getProductCodePrefix(type, supplier);

    if (!prefix || rowNumber < 1) {
        return "";
    }

    return `${prefix}${String(rowNumber).padStart(5, "0")}`; // "EANDE00001"
}

export function buildNextProductCode(
    products: { cod_producto: string }[],
    type: string,
    supplier: string,
) {
    return buildProductCode(type, supplier, getNextProductRowNumber(products, type, supplier));
}