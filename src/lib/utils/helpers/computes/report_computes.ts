import { MOActivity } from "@/lib/types/components/sub_components/module_render";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { ReportPdfVisibility } from "@/lib/types/supabase/report-types";
import { MO_TEMPLATE_ROWS } from "@/lib/utils/consts/report";
import { normalizeMaterialTipo } from "../../normalization";

// Crear valores iniciales de Puesta en Marcha
export function createInitialMOActivities(): MOActivity[] {
    return MO_TEMPLATE_ROWS.map((item) => ({
        id: item.id,
        descripcion: item.descripcion,
        visible: true,
    }));
}

export function createInitialPdfVisibility(): ReportPdfVisibility {
    return {
        hiddenEquipoIds: [],
        hiddenMaterialIds: [],
        showEquipmentsInPdf: false,
        showElectricalMaterialsInPdf: false,
        showCanalizationMaterialsInPdf: false,
        showMOInPdf: false,
        moActivities: createInitialMOActivities(),
    };
}

// Identifica si es un material eléctrico
export function isElectricalMaterial(item: Project_Materiales) {
    const tipo = normalizeMaterialTipo(item.material_info?.tipo_de_producto);
    return tipo === "PROTECCION" || tipo === "CABLE";
}

// Identifica si es un material de canalización
export function isCanalizationMaterial(item: Project_Materiales) {
    return normalizeMaterialTipo(item.material_info?.tipo_de_producto) === "CANALIZACION";
}

// Calculo el subtotal del reporte considerando descuentos
export function computeReportSubtotal(
    precioFinal: number,
    opcionDscto: string | undefined,
    formatoDscto: string | undefined,
    tasaDscto: string | number | undefined,
): { subtotalSinDscto: number; precioDscto: number; subtotal: number } {
    
    const base = Number.isFinite(precioFinal) ? precioFinal : 0;
    const tasa = Number(tasaDscto);

    // NO DSCTO
    if (opcionDscto !== "CON DSCTO" || !Number.isFinite(tasa) || tasa <= 0) {
        return { 
            subtotalSinDscto: base, 
            precioDscto: 0, 
            subtotal: base 
        };
    }

    // DSCTO (USD)
    if (formatoDscto === "USD") {
        const precioDscto = Math.min(tasa, base);
        return {
            subtotalSinDscto: base,
            precioDscto,
            subtotal: base - precioDscto,
        };
    }

    // DSCTO (%)
    const factor = tasa / 100;
    const precioDscto = base * factor;
    return {
        subtotalSinDscto: base,
        precioDscto,
        subtotal: base * (1 - factor),
    };
}

// Cálculo automático del porcentaje de mano de obra
export function percentMO(porcentaje_eqmt: number){
    return 100 - porcentaje_eqmt
}