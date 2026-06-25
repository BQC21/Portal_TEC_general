import { SelectedEquipmentItem } from "./supabase/product-types";

export type computedRequirements = {
    energia: string;
    potenciaDC: string;
    potenciaAC: string;
    strings_minimos: string;
    strings_maximos: string;
    itm_ac_min: string;
    itm_dc_min: string;
    spd_min: string;
    ah_sistema: string;
    num_baterias: string;
    selectedEquipment: SelectedEquipmentItem | undefined;
    selectedInverter: SelectedEquipmentItem | undefined;
    selectedBattery: SelectedEquipmentItem | undefined;
}