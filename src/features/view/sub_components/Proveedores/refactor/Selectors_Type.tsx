import { SelectionRow } from "../../../components/Form_fields/AddSelectionRow";
import { TABLE_HEADERS_TYPE } from "@/lib/utils/headers";
import { Selectors_TypeProps } from "@/lib/types/components/sub_components/module_render";
import { BRAND_ROW_KEY } from "@/lib/utils/helpers/modals/brandOptions";

export function Selectors_Type({
    selectedBrandByRow,
    brandOptions,
    handleBrandChange,
    handleAddBrand,
}: Selectors_TypeProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Selección de marcas</h2>
                <SelectionRow
                    label={TABLE_HEADERS_TYPE[2]}
                    buttonLabel="Agregar"
                    value={selectedBrandByRow[BRAND_ROW_KEY]?.brandId || ""}
                    options={brandOptions}
                    onChange={handleBrandChange}
                    onClick={handleAddBrand}
                />
            </section>
        </div>
    );
}
