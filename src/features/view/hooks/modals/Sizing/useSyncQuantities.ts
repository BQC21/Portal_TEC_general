import { computedRequirements } from "@/lib/types/components/Sizing/computes";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { cantidadModuloFVTabla } from "@/lib/utils/helpers/computes/PanelNumber";
import { SetStateAction, useEffect } from "react";

export function useSyncQuantities(form: ProjectFormState, computedRequirements: computedRequirements,
    setSelectedEquipmentTable: (value: SetStateAction<SelectedEquipmentItem[]>) => void, 
    setSelectedMaterialTable: (value: SetStateAction<SelectedMaterialItem[]>) => void){
   // número de strings (módulos FV)
    useEffect(() => {
        const stringsVal = Number(form.strings) || 0;
        const cantidadModulo = cantidadModuloFVTabla(
            stringsVal,
            computedRequirements.selectedEquipment?.unidad,
        );
        setSelectedEquipmentTable((curr) => curr.map((r) => (r.row === "MÓDULO FV" ? 
            { ...r, cantidad: cantidadModulo } : r)));
    }, [form.strings, computedRequirements.selectedEquipment?.unidad, setSelectedEquipmentTable]);
    
    // número de baterías
    useEffect(() => {
        const numB = Number(computedRequirements.num_baterias) || 0;
        setSelectedEquipmentTable((curr) => curr.map((r) => (r.row === "BATERÍA" ? 
            { ...r, cantidad: Number(numB.toFixed(0)) } : r)));
    }, [computedRequirements.num_baterias, setSelectedEquipmentTable]);

    // número de MC4
    useEffect(() => {
        const MC4_val = 6 * Number(form.cadena_number) || 0;
        setSelectedMaterialTable((curr) => curr.map((r) => (r.row === "MC4" 
            && r.description.includes("MC4") ? 
            { ...r, cantidad: Number(MC4_val.toFixed(0))} : r)))
    }, [form.cadena_number, setSelectedMaterialTable])
}