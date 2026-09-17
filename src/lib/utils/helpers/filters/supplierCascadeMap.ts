import { MATERIAL_SUPPLIER_CASCADE_MAP } from "@/lib/utils/consts/supplierCascade";

export function getMaterialSupplierCascade(proveedor: string) {
    return MATERIAL_SUPPLIER_CASCADE_MAP[proveedor] ?? null;
}
