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

    // 
    if (selected) {
        setForm_project({
            nombre: selected.nombre,
            descripcion: selected.descripcion,
            zona_id: selected.zona_id,   // id de la zona (1 zona por proyecto)
            zona_info: selected.zona_info,  // datos completos de la zona 
            angulo: selected.angulo,
            tipo_instalacion: selected.tipo_instalacion,
            // cálculos de radiación
            hsp: selected.hsp,
            ghi: selected.ghi,
            // datos del sistema
            demanda_electrica: selected.demanda_electrica,
            configuracion: selected.configuracion,
            cobertura_porcentaje: selected.cobertura_porcentaje,
            rendimiento_modulo_porcentaje: selected.rendimiento_modulo_porcentaje,
            // requerimientos energéticos
            energia_requerida: selected.energia_requerida,
            potencia_dc_requerida: selected.potencia_dc_requerida,
            potencia_ac_requerida: selected.potencia_ac_requerida,
            // campo fotovoltaico
            strings_min: selected.strings_min,
            strings_max: selected.strings_max,
            strings: selected.strings,
            // protecciones eléctricas
            itm_dc_min: selected.itm_dc_min,
            itm_ac_min: selected.itm_ac_min,
            spd_voltage: selected.spd_voltage,
            mppt_number: selected.mppt_number,
            // almacenamiento energético
            autonomia: selected.autonomia,
            ah_sistema: selected.ah_sistema,
            num_baterias: selected.num_baterias,
            // fechas
            created_at: selected.created_at,
            updated_at: selected.updated_at,
            // estado
            estado_proyecto: selected.estado_proyecto,
            // enlace
            enlace: selected.enlace,
            // llenado
            opcion_llenado: selected.opcion_llenado,
        });
        updateField("proyecto_id", selected.id);
        updateField("proyecto_info", selected);
    }
}