
// Añadir patrón de cantidad
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";

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
    id: string;
    descripcion: string;
    monto: number;
    personas: number;
    dias: number;
};
export const EMPTY_MONTO_ITEM: Omit<MontoItem, "id"> = {
    descripcion: "",
    monto: 0,
    personas: 0,
    dias: 0,
};

// Añadir patrón de comidas
export type EatingItem = {
    id: string;
    descripcion: string,
    monto: number,
    personas: number,
    dias: number,
}
export const EMPTY_EATING_ITEM: Omit<EatingItem, "id">  = {
    descripcion: "",
    monto: 0,
    personas: 0,
    dias: 0,
}

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
        considerar_epp_reutilizable: boolean;
        equipos_seleccionados?: Project_Equipos[];
        materiales_seleccionados?: Project_Materiales[];
    };
    Viaticos: {
        // eating: EatingItem[];
        // traveling: MontoItem;
        // mobility: MontoItem;
        // hotel: MontoItem;
        gastos_viaje: MontoItem[];
        courier: QuantityPriceItem[];
    }
};
