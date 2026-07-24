import { Type, TypeFormstate } from "@/lib/types/supabase/type-types";
import { SetStateAction } from "react";
import { INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { MaterialesFormState } from "@/lib/types/supabase/materiales-types";

export function useTypeSelection(    
    value: string, type: Type[],
    setForm_type:  (value: SetStateAction<TypeFormstate>) => void,
    setForm: (value: SetStateAction<MaterialesFormState>) => void
) {
    function updateField<K extends keyof TypeFormstate>(field: K, value: TypeFormstate[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    if (value === "Seleccione marca") {
        setForm_type(INITIAL_TYPE_FORM);
        return;
    }

    const selected = type.find((type) => type.nombre === value);

    if (selected) {
        setForm_type({
            nombre: selected.nombre,
            categoria: selected.categoria,
            created_at: selected.created_at,
            updated_at: selected.updated_at,
        });
    }
}