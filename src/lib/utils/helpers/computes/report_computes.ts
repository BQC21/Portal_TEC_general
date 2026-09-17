import { MOActivity } from "@/lib/types/components/sub_components/module_render";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";

/** Subtotal del reporte a partir de precioFinal y el formato de descuento. */

export const GERENTE_FIRMA_PASSWORD = "2409Adry$Tere";

export const MO_TEMPLATE_ROWS: Array<Pick<MOActivity, "id" | "descripcion">> = [
    {id: "1", descripcion: "Acarreo de materiales para instalación"},
    {id: "2", descripcion: "Realizar trazos y medidas"},
    {id: "3", descripcion: "Montaje de estructura metálica"},
    {id: "4", descripcion: "Instalación de paneles (Estructura)"},
    {id: "5", descripcion: "Instalación de paneles (Conexionado)"},
    {id: "6", descripcion: "Armado de tablero DC / AC"},
    {id: "7", descripcion: "Instalación de tablero FV"},
    {id: "8", descripcion: "Instalación de inversor"},
    {id: "9", descripcion: "Canalización de acometida DC"},
    {id: "10", descripcion: "Canalización de acometida AC"},
    {id: "11", descripcion: "Mediciones, pruebas eléctricas, ajustes y optimización"},
    {id: "12", descripcion: "Conexión, programación, control y puesta en marcha"},
    {id: "13", descripcion: "Viáticos"},
];

export function createInitialMOActivities(): MOActivity[] {
    return MO_TEMPLATE_ROWS.map((item) => ({
        id: item.id,
        descripcion: item.descripcion,
        visible: true,
    }));
}

export function normalizeMaterialTipo(tipo?: string | null) {
    return (tipo ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function isElectricalMaterial(item: Project_Materiales) {
    const tipo = normalizeMaterialTipo(item.material_info?.tipo_de_producto);
    return tipo === "PROTECCION" || tipo === "CABLE";
}

export function isCanalizationMaterial(item: Project_Materiales) {
    return normalizeMaterialTipo(item.material_info?.tipo_de_producto) === "CANALIZACION";
}

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

export function percentMO(porcentaje_eqmt: number){
    return 100 - porcentaje_eqmt
}