/** Payload alineado a python/app/schemas/report.py → ReportFormPayload */
export type ReportPdfPayload = {

    tipo: "report";

    // reporte
    cliente?: string;
    ruc_dni?: string;
    fecha?: string;
    lugar?: string;
    atencion?: string;
    porcentaje_eqmt?: string | number;
    porcentaje_inst?: string | number;
    precio_cotizacion?: string | number;
    validez_oferta?: string;
    plazo_entrega?: string;
    tasa_dscto?: string | number;
    opcion_dscto?: string;
    formato_dscto?: string;
    payFormat?: string;
    
    // cotizacion
    cotizacion_id?: string;
    cotizacion_info?: {
        cod_cotizacion?: string;
        precio_dolares?: string | number;
        igv?: string | number;
        tasa_cambio?: string | number;
        proyecto_info?: { nombre?: string };
    };

    // equipos principales
    equipos?: Array<{
        cantidad?: string | number;
        visible?: boolean;
        equipo_info?: {
            cod_producto?: string;
            descripcion?: string;
            unidad?: string;
            tipo_de_producto?: string;
            marca?: string;
        };
    }>;

    // materiales eléctricas
    materiales?: Array<{
        cantidad?: string | number;
        material_info?: {
            cod_producto?: string;
            descripcion?: string;
            unidad?: string;
            tipo_de_producto?: string;
        };
    }>;
};