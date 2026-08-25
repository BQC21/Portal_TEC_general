import { computedRequirements } from "@/lib/types/components/Sizing/computes";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { cantidadModuloFVEnTabla, normalizeModuloFVUnidad } from "@/lib/utils/helpers/computes/PanelNumber";
import { SetStateAction, useEffect } from "react";

export function useSyncQuantities(form: ProjectFormState, computedRequirements: computedRequirements,
    selectedEquipmentTable: SelectedEquipmentItem[],
    setSelectedEquipmentTable: (value: SetStateAction<SelectedEquipmentItem[]>) => void, 
    setSelectedMaterialTable: (value: SetStateAction<SelectedMaterialItem[]>) => void){
    const moduloFvSelectionKey = selectedEquipmentTable
        .filter((item) => item.row === "MÓDULO FV")
        .map((item) => `${item.id}:${normalizeModuloFVUnidad(item.unidad) ?? ""}`)
        .join("|");

   // número de strings (módulos FV)
    useEffect(() => {
        const stringsVal = Number(form.strings) || 0;
        setSelectedEquipmentTable((curr) => {
            const modules = curr.filter((item) => item.row === "MÓDULO FV");
            let changed = false;
            const next = curr.map((item) => {
                if (item.row !== "MÓDULO FV") return item;
                const cantidad = cantidadModuloFVEnTabla(stringsVal, item.unidad, modules);
                if (item.cantidad === cantidad) return item;
                changed = true;
                return { ...item, cantidad };
            });
            return changed ? next : curr;
        });
    }, [form.strings, moduloFvSelectionKey, setSelectedEquipmentTable]);
    
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