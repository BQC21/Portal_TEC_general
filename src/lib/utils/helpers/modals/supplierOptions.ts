import { SelectOption } from "@/lib/types/components/General/form_fields";
import { Brand, BrandFormstate } from "@/lib/types/supabase/brand.types";
import { SelectedSupplierlItem } from "@/lib/types/supabase/product-types";
import { Supplier } from "@/lib/types/supabase/supplier-types";
import { defaultSelectOption } from "@/lib/utils/helpers/project_modals/productOptions";

export const SUPPLIER_ROW_LABEL = "PROVEEDOR";
export const SUPPLIER_ROW_KEY = `${SUPPLIER_ROW_LABEL}-0`;

export function matchesBrandCategory(brandCategoria?: string, supplierCategoria?: string) {
    if (!brandCategoria || brandCategoria === "Ambas") return true;
    return supplierCategoria === brandCategoria || supplierCategoria === "Ambas";
}

export function toSupplierSelectOption(item: Supplier): SelectOption {
    return {
        value: String(item.id ?? ""),
        label: item.codigo
            ? `(${item.codigo}) - ${item.nombre ?? ""}`
            : (item.nombre ?? ""),
    };
}

export function toSelectedSupplierItem(item: Supplier): SelectedSupplierlItem {
    return {
        row: SUPPLIER_ROW_LABEL,
        id: String(item.id ?? ""),
        nombre: item.nombre ?? "",
        ruc: item.ruc ?? "",
        contacto: item.contacto ?? "",
        telefono: item.telefono ?? "",
        categoria: item.categoria ?? "",
        codigo: item.codigo ?? "",
    };
}

export function getSupplierSelectOptions(
    suppliers: Supplier[],
    selectedSupplierTable: SelectedSupplierlItem[],
    brandCategoria?: string,
): SelectOption[] {
    return [
        defaultSelectOption(SUPPLIER_ROW_LABEL),
        ...suppliers
            .filter((item) => {
                if (!matchesBrandCategory(brandCategoria, item.categoria)) return false;
                return !selectedSupplierTable.some((selected) => selected.id === String(item.id));
            })
            .map(toSupplierSelectOption),
    ];
}

export function selectedSuppliersFromBrand(
    brand: Pick<Brand, "proveedor_id" | "proveedor_info">,
    suppliers: Supplier[] = [],
): SelectedSupplierlItem[] {
    const info = brand.proveedor_info;
    const id = info?.id != null ? String(info.id) : brand.proveedor_id;

    if (!id) return [];

    const found = suppliers.find((item) => String(item.id) === String(id));
    if (found) return [toSelectedSupplierItem(found)];

    return [{
        row: SUPPLIER_ROW_LABEL,
        id: String(id),
        nombre: info?.nombre ?? "",
        ruc: info?.ruc ?? "",
        contacto: info?.contacto ?? "",
        telefono: info?.telefono ?? "",
        categoria: info?.categoria ?? "",
        codigo: info?.codigo ?? "",
    }];
}

export function applySelectedSuppliersToBrand(
    form: BrandFormstate,
    selectedSupplierTable: SelectedSupplierlItem[],
): BrandFormstate {
    const firstSupplier = selectedSupplierTable[0];

    return {
        ...form,
        proveedor_id: firstSupplier?.id ?? form.proveedor_id,
        proveedor_info: firstSupplier
            ? {
                id: firstSupplier.id,
                nombre: firstSupplier.nombre,
                ruc: firstSupplier.ruc,
                contacto: firstSupplier.contacto,
                telefono: firstSupplier.telefono,
                categoria: firstSupplier.categoria,
                codigo: firstSupplier.codigo,
            }
            : form.proveedor_info,
    };
}
