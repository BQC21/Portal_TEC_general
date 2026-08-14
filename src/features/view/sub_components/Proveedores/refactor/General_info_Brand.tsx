import { AddProductSelectField } from "../../../components/Form_fields/AddSelectField";
import { AddProductTextField } from "../../../components/Form_fields/AddTextField";
import { TABLE_HEADERS_BRAND } from "@/lib/utils/headers";
import { Category } from "@/lib/utils/options";
import { General_info_BrandProps } from "@/lib/types/components/sub_components/module_render";

export function General_info_Brand({ form, updateField }: General_info_BrandProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <AddProductTextField
                    label={TABLE_HEADERS_BRAND[0]}
                    required
                    placeholder=" "
                    value={form.nombre || ""}
                    onChange={(value) => updateField("nombre", value)}
                />
                <AddProductSelectField
                    label={TABLE_HEADERS_BRAND[1]}
                    required
                    options={Category}
                    value={form.categoria || ""}
                    onChange={(value) => updateField("categoria", value)}
                />
            </section>
        </div>
    );
}
