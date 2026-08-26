
// Añadir patrón de cantidad
export type QuantityPriceItem = {
    id: string;
    descripcion: string;
    cantidad: number;
    precio_unitario: number;
};
export const EMPTY_QUANTITY_PRICE_ITEM: Omit<QuantityPriceItem, "id"> = { 
    descripcion: "", cantidad: 0, precio_unitario: 0 };


// Añadir patrón de personal
export type PersonalItem = {
    id: string;
    nombre: string;
    puesto: string;
    dias: number;
    precio_dia: number;
};
export const EMPTY_PERSONAL_ITEM: Omit<PersonalItem, "id"> = { 
    nombre: "", puesto: "", dias: 0, precio_dia: 0 };



// Añadir patrón de montos
export type MontoItem = {
    monto: number;
    personas: number;
    dias: number;
};
export const EMPTY_MONTO_ITEM: MontoItem = {
    monto: 0,
    personas: 0,
    dias: 0,
};


// Añadir patrón de consumibles
export type ConsumeItem = {
    id: string;
    cod_producto: string;
    descripcion: string;
    tipo_de_producto: string;
    cantidad: number;
};
export const EMPTY_CONSUME_ITEM: Omit<ConsumeItem, "id"> = {
    cod_producto: "",
    descripcion: "",
    tipo_de_producto: "CONSUMIBLE",
    cantidad: 0,
};

// ---------------------------
// Asignación manual de costos
// ---------------------------
export type ManualCosts = {
    Recursos: {
        consumible: ConsumeItem[];
        epp: QuantityPriceItem[];
        tooling: QuantityPriceItem[];
        personal: PersonalItem[];
        sctr: QuantityPriceItem[];
        hotel: MontoItem;
        considerar_epp_reutilizable: boolean;
    };
    Viaticos: {
        eating: MontoItem;
        traveling: MontoItem;
        mobility: MontoItem;
        courier: QuantityPriceItem[];
    }
};
