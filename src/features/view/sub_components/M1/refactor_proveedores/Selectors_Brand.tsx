import { SelectionRow } from "@/features/view/components/Form_fields/AddSelectionRow";
import { TABLE_HEADERS_BRAND } from "@/lib/utils/headers";
import { Selectors_BrandProps } from "@/lib/types/components/sub_components/module_render";
import { SUPPLIER_ROW_KEY } from "@/lib/utils/helpers/project_modals/supplierOptions";

export function Selectors_Brand({
    selectedSupplierByRow,
    supplierOptions,
    handleSupplierChange,
    handleAddSupplier,
}: Selectors_BrandProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Selección de proveedores</h2>
                <SelectionRow
                    label={TABLE_HEADERS_BRAND[2]}
                    buttonLabel="Agregar"
                    value={selectedSupplierByRow[SUPPLIER_ROW_KEY]?.supplierId || ""}
                    options={supplierOptions}
                    onChange={handleSupplierChange}
                    onClick={handleAddSupplier}
                />
            </section>
        </div>
    );
}
