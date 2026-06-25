import { SelectedEquipmentItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { ZoneFormState } from "@/lib/types/supabase/zone-types";

import { AH_sistema, compute_AC_Power, compute_DC_Power, computeEnergy, 
    ITM_AC_MIN, ITM_DC_MIN, max_strings,
    min_strings, N_baterias, SPD_MIN } from "@/lib/utils/helpers/computes/energy_requirements";

import { useMemo } from "react";

export function useComputedRequirements(form: ProjectFormState, formZone: ZoneFormState, 
    selectedEquipmentTable: SelectedEquipmentItem[], angle: string | undefined){

    const computedRequirements = useMemo(() => {
        // dentro del hook calcular valores de requerimientos de materiales y equipos 
        // a emplearse en los modales de dimensionamiento 
        const ghi = formZone.ghi_respaldo ? Number(formZone.ghi_respaldo) : null;
        const gti = formZone.gti_respaldo ? Number(formZone.gti_respaldo) : null;
                
        const selectedEquipment = selectedEquipmentTable.find((item) => item.row === "MÓDULO FV");
        const selectedInverter = selectedEquipmentTable.find((item) => item.row === "INVERSOR");
        const selectedBattery = selectedEquipmentTable.findLast((item) => item.row === "BATERÍA");

        const energia = String(computeEnergy(Number(form.demanda_electrica), Number(form.cobertura_porcentaje)));
        const potenciaDC = angle === "Coplanar" ? String(compute_DC_Power(Number(energia), Number(ghi), 80)) : 
                            String(compute_DC_Power(Number(energia), Number(gti), 80))
        const potenciaAC = String(compute_AC_Power(Number(potenciaDC)));
        // calcular strings mínimo a partir de potencia DC requerida y potencia de módulo seleccionado 
        const strings_minimos = String(min_strings(Number(potenciaDC), 
                                    Number(selectedEquipment?.potencia_maxima ?? 0)));
        const strings_maximos = String(max_strings(Number(selectedInverter?.potencia_maxima ?? 0), 
                                    Number(selectedEquipment?.potencia_maxima ?? 0)));
        // calcular protecciones
        const itm_ac_min = String(ITM_AC_MIN(Number(selectedInverter?.isc_i_out ?? 0)));
        const itm_dc_min = String(ITM_DC_MIN(Number(selectedEquipment?.isc_i_out ?? 0)));
        const spd_min = String(SPD_MIN(Number(form.strings), Number(selectedEquipment?.voc_vmax ?? 0), Number(form.mppt_number)));
        // calcular propiedades de la batería
        const ah_sistema = String(AH_sistema(Number(form.demanda_electrica), Number(form.autonomia), 
                        Number(selectedBattery?.dod), Number(selectedBattery?.vmpp_vmin)));
        const num_baterias =String(N_baterias(Number(ah_sistema), Number(selectedBattery?.impp_i_in ?? 0)));

        return { 
                energia, 
                potenciaDC, 
                potenciaAC, 
                strings_minimos, 
                strings_maximos, 
                itm_ac_min, 
                itm_dc_min, 
                spd_min,
                ah_sistema,
                num_baterias,
                selectedEquipment,
                selectedInverter,
                selectedBattery
        };
    }, [form.demanda_electrica, 
        form.cobertura_porcentaje, 
        form.mppt_number,
        form.strings,
        formZone.ghi_respaldo,
        formZone.gti_respaldo,
        angle,
        form.autonomia,
        selectedEquipmentTable,
    ]);
    
    return{computedRequirements}
}