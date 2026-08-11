/** Payload alineado a python/app/schemas/report.py → ReportFormPayload */
export type FinantialPdfPayload = {

    tipo: "finantial"

    // ---- Parámetros de entrada (finantial_data) ----
    planta?: string | number;
    generacion?: string | number;
    tarifa_red?: string | number;
    degra_1er?: string | number;
    degra_2do?: string | number;
    tarifa_crecimiento?: string | number;
    tasa_descuento?: string | number;
    
     // ---- Métricas calculadas (page 1 + conclusiones page 2) ----
    capex?: string | number;
    opex?: string | number;
    tiempo_retorno?: string | number; // "Tiempo de recuperación" en el PDF
    lcoe?: string | number;
    van?: string | number;
    capex_total?: string | number;
    om_total?: string | number;
    energia_total?: string | number;
    /** Último flujo acumulado → conclusión "beneficio económico" */
    beneficio_acumulado?: string | number;

    // ---- Cotización / proyecto (encabezado) ----
    cotizacion_id?: string;
    cotizacion_info?: {
        cod_cotizacion?: string;
        precio_dolares?: string | number;
        proyecto_info?: { nombre?: string };
    };

    // ---- Tabla "Flujo de caja" (page 1) + datos de Fig. 1 y Fig. 2 (page 2) ----
    flow_rows?: Array<{
        year: number;
        equipamiento?: number | null;
        tarifa_cliente?: number | null;
        om?: number | null;
        energy_mwh?: number | null;
        ahorro?: number | null;
        flujo_total: number;
        flujo_acumulado: number;
    }>;

    // ---- Opcional: variación de energía (si luego se metes al PDF) ----
    energy_rows?: Array<{
        year: number;
        energy_mwh: number;
        degradation_pct: number;
    }>;
};