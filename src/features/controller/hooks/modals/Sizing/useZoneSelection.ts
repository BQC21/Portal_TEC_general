import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { Zone, ZoneFormState } from "@/lib/types/supabase/zone-types";
import { INITIAL_ZONE_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function ZoneSelection(value: string, zones: Zone[],
    setForm_zone:  (value: SetStateAction<ZoneFormState>) => void,
    setForm: (value: SetStateAction<ProjectFormState>) => void
){
    function updateField<K extends keyof ProjectFormState>(field: K, value: ProjectFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    if (value === "Seleccione zona") {
        setForm_zone(INITIAL_ZONE_FORM);
        updateField("zona_id", "");
        updateField("zona_info", undefined);
        updateField("hsp", "");
        updateField("ghi", "");
        return;
    }

    const selected = zones.find((zone) => zone.zona === value);

    if (selected) {
        setForm_zone({
            zona: selected.zona,
            latitude: selected.latitude,
            longitude: selected.longitude,
            ghi_respaldo: selected.ghi_respaldo,
            ghi_respaldo_diario: selected.ghi_respaldo_diario,
            gti_respaldo: selected.gti_respaldo,
            gti_respaldo_diario: selected.gti_respaldo_diario,
            hsp_peor_mes: selected.hsp_peor_mes,
            created_at: selected.created_at,
            updated_at: selected.updated_at,
        });
        updateField("zona_id", selected.id);
        updateField("zona_info", selected);
    }
}