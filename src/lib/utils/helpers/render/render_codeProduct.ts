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
// construye el código del producto a partir del tipo de producto, proveedor y número de fila
export function buildProductCode(type: string, supplier: string, rowNumber: number) {
    const productCode = getProductTypeCode(type);
    const { supplierCode } = getSupplierInfo(supplier);

    if (!productCode || !supplierCode || rowNumber < 1) {
        return "";
    }

    return `${productCode}${supplierCode}${String(rowNumber).padStart(5, "0")}`;
}