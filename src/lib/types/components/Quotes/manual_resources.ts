
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
}



// ---------------------------
// Asignación manual de costos
// ---------------------------
export type ManualCosts = {
    Recursos: {
        epp: QuantityPriceItem[];
        tooling: QuantityPriceItem[];
        personal: PersonalItem[];
        sctr: QuantityPriceItem[];
        hotel: MontoItem;
    };
    Viaticos: {
        eating: MontoItem;
        traveling: MontoItem;
        courier: QuantityPriceItem[];
    }
};
