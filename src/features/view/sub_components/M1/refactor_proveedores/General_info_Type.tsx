import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { TABLE_HEADERS_TYPE } from "@/lib/utils/headers";
import { Category } from "@/lib/utils/options";
import { General_info_TypeProps } from "@/lib/types/components/sub_components/module_render";

export function General_info_Type({ form, updateField }: General_info_TypeProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <AddProductTextField
                    label={TABLE_HEADERS_TYPE[0]}
                    required
                    placeholder=" "
                    value={form.nombre || ""}
                    onChange={(value) => updateField("nombre", value)}
                />
                <AddProductSelectField
                    label={TABLE_HEADERS_TYPE[1]}
                    required
                    options={Category}
                    value={form.categoria || ""}
                    onChange={(value) => updateField("categoria", value)}
                />
            </section>
        </div>
    );
}
