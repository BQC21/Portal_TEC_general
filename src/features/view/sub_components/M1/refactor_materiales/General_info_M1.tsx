import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { General_info_M1_props_MAT } from "@/lib/types/components/module_render";
import { POWER_SOURCE_OPTIONS } from "@/lib/utils/options";

export function General_info_M1_MAT({
    form,
    updateField,
}: General_info_M1_props_MAT){
    return(
        <>
            {/* Info técnica */}
            <section className="space-y-5">
                <AddProductSectionTitle title="Propiedades Técnicas" />
                <div className="grid gap-5 md:grid-cols-2">
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.parte_electrica || POWER_SOURCE_OPTIONS[0]}
                        options={POWER_SOURCE_OPTIONS}
                        onChange={(value) =>
                            updateField("parte_electrica", value === POWER_SOURCE_OPTIONS[0] ? "" : value)
                        }
                    />
                </div>
            </section>
        </>
    )
}