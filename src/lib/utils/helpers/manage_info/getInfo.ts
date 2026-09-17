import { SupplierCodeInfo, SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { EMPTY_SUPPLIER_INFO, LEGACY_SUPPLIER_MAP } from "@/lib/utils/consts/supplierInfo";

export function normalizeSupplierCode(value: string) {
    return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

export function suggestSupplierCode(nombre: string) {
    return normalizeSupplierCode(nombre);
}

export function isValidSupplierCode(value: string) {
    return normalizeSupplierCode(value).length === 4;
}

export function getSupplierInfo(proveedor: SupplierFormstate): SupplierCodeInfo {
    const supplierCode = normalizeSupplierCode(proveedor.codigo ?? "");
    if (supplierCode) {
        return { RUC: proveedor.ruc ?? "", supplierCode };
    }

    return (
        LEGACY_SUPPLIER_MAP[proveedor.nombre ?? ""] ||
        LEGACY_SUPPLIER_MAP[proveedor.ruc ?? ""] ||
        EMPTY_SUPPLIER_INFO
    );
}
