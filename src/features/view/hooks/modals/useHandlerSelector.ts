import { computedRequirements } from "@/lib/types/components/computes";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { SelectedEquipmentItem, SelectedMaterialItem } from "@/lib/types/supabase/product-types";
import { ProjectFormState } from "@/lib/types/supabase/project-types";

export function handlerSelector(label:string, product_type: "EQUIPO" | "MATERIAL",
    selectedEquipmentTable: SelectedEquipmentItem[], selectedMaterialTable: SelectedMaterialItem[], 
    form: ProjectFormState, computedRequirements: computedRequirements, 
    equipos: Equipos[], materiales: Materiales[]
): string[]{
        let filteredOptions: string[] = [`Seleccionar - ${label}`];

        if (product_type === "EQUIPO") {
            // EL BLOQUEADOR
            const isTypeAlreadySelected = selectedEquipmentTable.some(
                    (item) => item.row === label
            );

            if (label === "INVERSOR") {
                if (isTypeAlreadySelected) {
                    filteredOptions = [`Seleccionar - ${label}`];
                } else {
                    const requiredPowerAC = form.opcion_llenado == "AUTOMÁTICO"
                                            ? parseFloat(computedRequirements.potenciaAC):
                                            form.potencia_ac_requerida;
                    filteredOptions = [
                        `Seleccionar - ${label}`,
                        ...equipos
                            .filter((equipo) => {
                                if (equipo.tipo_de_producto !== label) return false;
                                
                                // según valor de potencia AC requerida
                                const inverterPowerAC = parseFloat(equipo.potencia_ac?.toString() || "0");
                                if (inverterPowerAC < Number(requiredPowerAC)) return false;
                                // según configuración de fase
                                if (form.tipo_instalacion !== "conexión OFF-GRID" && 
                                    equipo.tipo_conexion !== form.configuracion) return false;
                                // según tipo de instalación
                                if (equipo.descripcion.includes("On-Grid") && 
                                    form.tipo_instalacion !== "conexión ON-GRID") return false;                                
                                if (equipo.descripcion.includes("Off-Grid") && 
                                    form.tipo_instalacion !== "conexión OFF-GRID") return false;   
                                if (equipo.descripcion.includes("Híbrido") && 
                                    form.tipo_instalacion !== "conexión HÍBRIDA") return false;                                 
                                return true;
                            })
                            .map((equipo) => equipo.descripcion)
                    ];
                }
            } else if (label === "BATERÍA") {
                if (form.tipo_instalacion === "conexión ON-GRID" || isTypeAlreadySelected) {
                    filteredOptions = [`Seleccionar - ${label}`];
                } else {
                        filteredOptions = [
                            `Seleccionar - ${label}`,
                            ...equipos
                                .filter((equipo) => {
                                    return equipo.tipo_de_producto === label;
                                })
                                .map((equipo) => equipo.descripcion)
                        ];
                }
            } else if (label === "MÓDULO FV") {                                        
                if (isTypeAlreadySelected) {
                    filteredOptions = [`Seleccionar - ${label}`];
                } else {
                    filteredOptions = [
                        `Seleccionar - ${label}`,
                        ...equipos
                            .filter((equipo) => {
                                if (equipo.tipo_de_producto !== label) return false;
                                return true;
                            })
                            .map((equipo) => equipo.descripcion)
                    ];
                }
            } else if (label === "ESTRUCTURA") {                                        
                filteredOptions = [
                    `Seleccionar - ${label}`,
                    ...equipos
                        .filter((equipo) => {
                            if (equipo.tipo_de_producto !== label) return false;
                            // según baterías
                            if (equipo.descripcion.includes("baterías") &&
                                ((Number(computedRequirements.num_baterias) <= 
                                parseInt(equipo.descripcion.match(/\d+/)?.[0] || "0" || "")) ||
                                isNaN(Number(computedRequirements.num_baterias)))) return false;
                            // según strings
                            if (equipo.descripcion.includes("módulos") && 
                                (Number(form.strings) <= 
                                parseInt(equipo.descripcion.match(/\d+/)?.[0] || "0" || "") ||
                                isNaN(Number(form.strings)))) return false;
                            // según orientación de la radiación
                            if (equipo.descripcion.includes("coplanar") &&
                                form.angulo !== "Coplanar") return false;
                            if (equipo.descripcion.includes("regulable") &&
                                form.angulo !== "Inclinado") return false;
                            // evitar duplicados en la lista de estructuras ya agregadas
                            const isAlreadySelected = selectedEquipmentTable.some(
                                (item) => item.id === String(equipo.id)
                            );
                            return !isAlreadySelected;
                        })
                        .map((equipo) => equipo.descripcion)
                ];
            } else if (label === "ACCESORIO") {
                filteredOptions = [
                    `Seleccionar - ${label}`,
                    ...equipos
                        .filter((equipo) => {
                            if (equipo.tipo_de_producto !== label) return false;
                            const isAlreadySelected = selectedEquipmentTable.some(
                                (item) => item.id === String(equipo.id)
                            );
                            return !isAlreadySelected;
                        })
                        .map((equipo) => equipo.descripcion)
                ];

                return filteredOptions;
            } 

            return filteredOptions;
        } else if (product_type === "MATERIAL") {
            filteredOptions = [
                `Seleccionar - ${label}`,
                ...materiales
                    .filter((material) => {
                        if (material.tipo_de_producto !== label) return false;
                        // según SPD
                        if (material.descripcion.includes("SPD") && 
                            (Number(computedRequirements.spd_min) >= 
                            parseInt(material.descripcion.match(/\d+/g)?.[1] || "0" || "") ||
                            isNaN(Number(computedRequirements.spd_min)))) return false;
                        // según ITM_DC
                        if (material.descripcion.includes("ITM") && 
                            material.descripcion.includes("VDC") && 
                            (Number(computedRequirements.spd_min) >= 
                            parseInt(material.descripcion.match(/\d+/g)?.[2] || "0" || "") ||
                            isNaN(Number(computedRequirements.spd_min)))) return false;
                        // según ITM_AC
                        if (material.descripcion.includes("ITM") &&
                            (Number(computedRequirements.itm_ac_min) >= 
                            parseInt(material.descripcion.match(/\d+/g)?.[1] || "0" || "") ||
                            isNaN(Number(computedRequirements.itm_ac_min)))) return false;
                        const isAlreadySelected = selectedMaterialTable.some(
                            (item) => item.id === String(material.id)
                        );
                        return !isAlreadySelected; // retiene en el selector los no seleccionados
                    })
                    .map((material) => material.descripcion),
            ]
            return filteredOptions;
        }

        return filteredOptions;
    } 