import { Brand, SupabaseBrandRow } from "./brand.types";

// Estado del formulario 
export type TypeFormstate = Omit<Type, "id">; 
export type TypeFormData = Omit<Type, "id">; 

// Filas correspondientes a la tabla de Supabase
export type SupabaseTypeRow = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    categoria?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // marca asociada
    marca_id?: number | string;          
    marca_info?: SupabaseBrandRow;         
    marcas?: SupabaseBrandRow;               
};

// Campos para la base de datos
export type Type = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    categoria?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // marca asociada
    marca_id: string; 
    marca_info?: Brand;  
};

// Estado de la visualización
export type UseTypeResult = {
    type: Type[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mostrar tabla modificadas
export type UseTypeMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (type: TypeFormData) => Promise<Type>;
    update: (id: string, type: TypeFormData) => Promise<Type>;
    remove: (id: string) => Promise<void>;
}
