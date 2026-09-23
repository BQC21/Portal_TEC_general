import { SelectOption } from "@/lib/types/components/General/form_fields"
import { Materiales } from "@/lib/types/supabase/materiales-types"
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join"
import { defaultSelectOption, toProductSelectOption } from "@/lib/utils/helpers/project_modals/productOptions"

export function ConsumeSelector(
    label: string,
    selected_materiales: Project_Materiales[],
    materiales: Materiales[],
): SelectOption[] {
    const selectedIds = new Set(
        selected_materiales.map((item) => String(item.material_id)),
    )

    return [
        defaultSelectOption(label),
        ...materiales
            .filter((material) =>
                material.tipo_de_producto === label
                && !selectedIds.has(String(material.id)),
            )
            .map(toProductSelectOption),
    ]
}
