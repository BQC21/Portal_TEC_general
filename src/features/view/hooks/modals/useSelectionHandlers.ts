// /home/brakine/Desktop/Portal_TEC/Portal_TEC_general/src/features/view/hooks/modals/useSelectionHandlers.ts

import { useCallback } from "react";
import { computedRequirements } from "@/lib/types/components/computes";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

// INPUTS
interface UseSelectionHandlersParams {
    equipos: Equipos[];
    materiales: Materiales[];
    form: ProjectFormState;
    computedRequirements: computedRequirements;
    selectedEquipmentByRow: Record<string, { equipoId: string; description: string }>;
    selectedMaterialByRow: Record<string, { materialId: string; description: string }>;
    selectedEquipmentTable: SelectedEquipmentItem[];
    selectedMaterialTable: SelectedMaterialItem[];
    setSelectedEquipmentByRow: (value: Record<string, { equipoId: string; description: string }> 
        | ((prev: Record<string, { equipoId: string; description: string }>) => 
            Record<string, { equipoId: string; description: string }>)) => void;
    setSelectedMaterialByRow: (value: Record<string, { materialId: string; description: string }> 
        | ((prev: Record<string, { materialId: string; description: string }>) => 
            Record<string, { materialId: string; description: string }>)) => void;
    setSelectedEquipmentTable: (value: SelectedEquipmentItem[] 
        | ((prev: SelectedEquipmentItem[]) => SelectedEquipmentItem[])) => void;
    setSelectedMaterialTable: (value: SelectedMaterialItem[] 
        | ((prev: SelectedMaterialItem[]) => SelectedMaterialItem[])) => void;
}

//OUTPUTS
interface SelectionHandlers {
    handle_onChange: (value: string, label: string, index: string | number, product_type: string) => void;
    handle_click: (label: string, index: string | number, product_type: string) => void;
}

export function useSelectionHandlers({
    equipos,
    materiales,
    form,
    computedRequirements,
    selectedEquipmentByRow,
    selectedMaterialByRow,
    selectedEquipmentTable,
    selectedMaterialTable,
    setSelectedEquipmentByRow,
    setSelectedMaterialByRow,
    setSelectedEquipmentTable,
    setSelectedMaterialTable,
}: UseSelectionHandlersParams): SelectionHandlers {
    /**
     * Maneja los cambios en los selectores de equipos y materiales.
     * Busca el equipo/material seleccionado y lo almacena temporalmente.
     */
    const handle_onChange = useCallback(
        (value: string, label: string, index: string | number, product_type: string) => {
            if (product_type === "EQUIPO") {
                if (!value) {
                    setSelectedEquipmentByRow((prev) => {
                        const newState = { ...prev };
                        delete newState[`${label}-${index}`];
                        return newState;
                    });
                    return;
                }

                const selected = equipos.find(
                    (equipo) => equipo.tipo_de_producto === label && String(equipo.id) === value
                );

                if (selected) {
                    setSelectedEquipmentByRow((prev: Record<string, { equipoId: string; description: string }>) => ({
                        ...prev,
                        [`${label}-${index}`]: {
                            equipoId: String(selected.id),
                            description: selected.descripcion,
                        },
                    }));
                }
            } else if (product_type === "MATERIAL") {
                if (!value) {
                    setSelectedMaterialByRow((prev) => {
                        const newState = { ...prev };
                        delete newState[`${label}-${index}`];
                        return newState;
                    });
                    return;
                }

                const selected = materiales.find(
                    (material) => material.tipo_de_producto === label && String(material.id) === value
                );

                if (selected) {
                    setSelectedMaterialByRow((prev: Record<string, { materialId: string; description: string }>) => ({
                    ...prev,
                    [`${label}-${index}`]: {
                        materialId: String(selected.id),
                        description: selected.descripcion,
                    },
                    }));
                }
            }
        },[equipos, materiales, 
        setSelectedEquipmentByRow, setSelectedMaterialByRow]);

    /**
     * Agrega el equipo/material seleccionado a la tabla.
     * Calcula la cantidad inicial según reglas específicas de cada tipo.
     */
    const handle_click = useCallback(
        (label: string, index: string | number, product_type: string) => {
            if (product_type === "EQUIPO") {
                const selectedEquipo = selectedEquipmentByRow[`${label}-${index}`];

                if (!selectedEquipo?.equipoId) {
                    return;
                }

                // Revisar si el tipo de equipo ya existe (excepto para ACCESORIO y ESTRUCTURA)
                let isAlreadyAdded = false;
                if (label !== "ACCESORIO" && label !== "ESTRUCTURA") {
                    isAlreadyAdded = selectedEquipmentTable.some((item) => item.row === label);
                }

                // Buscar los detalles del equipo
                const equipoDetails = equipos.find(
                    (equipo) => String(equipo.id) === selectedEquipo.equipoId
                );

                if (!isAlreadyAdded && equipoDetails) {
                    // Determinar cantidad inicial según reglas por tipo de equipo
                    const cantidadInit =
                    label === "INVERSOR"
                        ? 1
                        : label === "MÓDULO FV"
                        ? Number(form.strings) || 0
                        : label === "BATERÍA"
                        ? Number(computedRequirements.num_baterias) || 0
                        : label === "ESTRUCTURA" && equipoDetails.descripcion?.includes("baterías")
                        ? Math.floor(
                            Number(computedRequirements.num_baterias) /
                            parseInt(equipoDetails.descripcion.match(/\d+/)?.[0] || "0" || "")
                        )
                        : label === "ESTRUCTURA" && equipoDetails.descripcion?.includes("módulos")
                        ? Math.floor(
                            Number(form.strings) /
                            parseInt(equipoDetails.descripcion.match(/\d+/)?.[0] || "0" || "")
                        )
                        : 1;

                setSelectedEquipmentTable((prev: SelectedEquipmentItem[]) => [
                    ...prev,
                    {
                        row: label,
                        id: selectedEquipo.equipoId,
                        description: selectedEquipo.description,
                        marca: equipoDetails.marca,
                        codigo: equipoDetails.cod_producto,
                        potencia_maxima: equipoDetails.potencia_maxima,
                        mppt: equipoDetails.mppt,
                        dod: equipoDetails.dod,
                        potencia_ac: equipoDetails.potencia_ac,
                        voc_vmax: equipoDetails.voc_vmax,
                        vmpp_vmin: equipoDetails.vmpp_vmin,
                        isc_i_out: equipoDetails.isc_i_out,
                        impp_i_in: equipoDetails.impp_i_in,
                        cantidad: cantidadInit,
                        unidad: equipoDetails.unidad,
                        precio_soles: equipoDetails.precio_soles,
                        precio_dolares: equipoDetails.precio_dolares,
                        precio_soles_igv: equipoDetails.precio_soles_igv,
                        precio_dolares_igv: equipoDetails.precio_dolares_igv,
                    },
                    ]);
                }

                // Limpiar el selector temporal
                setSelectedEquipmentByRow((prev) => {
                    const newState = { ...prev };
                    delete newState[`${label}-${index}`];
                    return newState;
                });
            } else if (product_type === "MATERIAL") {
                const selectedMaterial = selectedMaterialByRow[`${label}-${index}`];

                if (!selectedMaterial?.materialId) {
                    return;
                }

                // Revisar si el material ya existe
                const isAlreadyAdded = selectedMaterialTable.some(
                    (item) => item.id === selectedMaterial.materialId
                );

                const materialDetails = materiales.find(
                    (material) => String(material.id) === selectedMaterial.materialId
                );

                if (!materialDetails) {
                    return;
                }

                if (!isAlreadyAdded) {
                    // Determinar cantidad inicial según reglas por tipo de material
                    const cantidadInit = label === "MC4" ? 6 * Number(form.mppt_number) || 0 : 1;

                setSelectedMaterialTable((prev: SelectedMaterialItem[]) => [
                    ...prev,
                    {
                        row: label,
                        id: selectedMaterial.materialId,
                        description: selectedMaterial.description,
                        codigo: materialDetails.cod_producto,
                        cantidad: cantidadInit,
                        unidad: materialDetails.unidad,
                        precio_soles: materialDetails.precio_soles,
                        precio_dolares: materialDetails.precio_dolares,
                        precio_soles_igv: materialDetails.precio_soles_igv,
                        precio_dolares_igv: materialDetails.precio_dolares_igv,
                    },
                    ]);
                }

                // Limpiar el selector temporal
                setSelectedMaterialByRow((prev) => {
                    const newState = { ...prev };
                    delete newState[`${label}-${index}`];
                    return newState;
                });
            }
        },[form,
        computedRequirements,
        equipos,
        selectedEquipmentByRow,
        selectedMaterialByRow,
        selectedEquipmentTable,
        selectedMaterialTable,
        setSelectedEquipmentByRow,
        setSelectedMaterialByRow,
        setSelectedEquipmentTable,
        setSelectedMaterialTable]
    );

    return {
        handle_onChange,
        handle_click,
    };
}