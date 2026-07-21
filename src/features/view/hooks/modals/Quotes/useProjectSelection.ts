import { Project, ProjectFormState } from "@/lib/types/supabase/project-types";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_PROJECT_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function ProjectSelection(value: string, projects: Project[],
    setForm_project: (value: SetStateAction<ProjectFormState>) => void,
    setForm: (value: SetStateAction<QuoteFormState>) => void
) {
    // actualizador
    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]){
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        })
    }

    // condiciones nulas
    if (value === "Seleccione proyecto") {
        setForm_project(INITIAL_PROJECT_FORM);
        updateField("proyecto_id", "");
        updateField("proyecto_info", undefined);
        return;
    }

    // búsqueda del proyecto seleccionado
    const selected = projects.find((project) => project.nombre === value)

    if (selected) {
        setForm_project({
            ...INITIAL_PROJECT_FORM,
            ...selected,
        });
        updateField("proyecto_id", selected.id);
        updateField("proyecto_info", selected);
    }
}