import { grossMargin as GrossMarginShape,
    precioFinal, recursos, viaticos } from "../types/components/Quotes/finantial_computes";

export const EMPTY_VENTA = {
    ventaSoles: 0,
    ventaSolesIgv: 0,
    ventaDolares: 0,
    ventaDolaresIgv: 0,
};

export const EMPTY_SOLES = { soles: 0, igv: 0 };

export const EMPTY_RECURSOS: recursos = {
    equiposPrincipales: { total: 0, igv: 0 },
    estructuras: { total: 0, igv: 0 },
    consumibles: { total: 0, igv: 0 },
    epp: { total: 0, igv: 0 },
    tooling: { total: 0, igv: 0 },
    personal: { total: 0, igv: 0 },
    sctr: { total: 0, igv: 0 },
    resumen: {
        subtotal: EMPTY_SOLES,
        margenRiesgo: EMPTY_SOLES,
        subtotalConMargenRiesgo: EMPTY_SOLES,
        markUp: EMPTY_SOLES,
        ventaSoles: EMPTY_VENTA,
    },
};

export const EMPTY_VIATICOS: viaticos = {
    gastos_viaje: { total: 0 },
    courier: { total: 0 },
    resumen: {
        subtotal: EMPTY_SOLES,
        margenRiesgo: EMPTY_SOLES,
        ventaSoles: EMPTY_VENTA,
    },
};

export const EMPTY_PRECIO_FINAL: precioFinal = {
    soles: 0,
    solesIgv: 0,
    dolares: 0,
    dolaresIgv: 0,
};

export const EMPTY_GROSS_MARGIN = { gm: { gm: 0 } as GrossMarginShape };
