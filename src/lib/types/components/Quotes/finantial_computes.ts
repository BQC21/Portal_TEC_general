export type recursos = {
    equiposPrincipales: {
        total: number;
        igv: number;
    };
    estructuras: {
        total: number;
        igv: number;
    };
    consumibles: {
        total: number;
        igv: number;
    };
    epp: {
        total: number;
        igv: number;
    };
    tooling: {
        total: number;
        igv: number;
    };
    personal: {
        total: number;
        igv: number;
    };
    sctr: {
        total: number;
        igv: number;
    };
    resumen: {
        subtotal: {
            soles: number;
            igv: number;
        };
        margenRiesgo: {
            soles: number;
            igv: number;
        };
        subtotalConMargenRiesgo: {
            soles: number;
            igv: number;
        };
        markUp: {
            soles: number;
            igv: number;
        };
        ventaSoles: {
            ventaSoles: number;
            ventaSolesIgv: number;
            ventaDolares: number;
            ventaDolaresIgv: number;
        };
    };
}

export type viaticos = {
    eating: {
        total: number;
    };
    mobility: {
        total: number;
    };
    hotel: {
        total: number;
    };
    courier: {
        total: number;
    };
    resumen: {
        subtotal: {
            soles: number;
            igv: number;
        };
        margenRiesgo: {
            soles: number;
            igv: number;
        };
        ventaSoles: {
            ventaSoles: number;
            ventaSolesIgv: number;
            ventaDolares: number;
            ventaDolaresIgv: number;
        };
    };
}

export type precioFinal = {
    soles: number;
    solesIgv: number;
    dolares: number;
    dolaresIgv: number;
}

export type grossMargin = {
    gm: number;
}

export type recursosItems = Omit<recursos, 'resumen'>;
export type viaticosItems = Omit<viaticos, 'resumen'>;