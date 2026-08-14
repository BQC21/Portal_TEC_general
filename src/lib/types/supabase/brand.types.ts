import { SupabaseSupplierRow, Supplier } from "./supplier-types";

// Estado del formulario 
export type BrandFormstate = Omit<Brand, "id">; 
export type BrandFormData = Omit<Brand, "id">; 

// Filas correspondientes a la tabla de Supabase
export type SupabaseBrandRow = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    categoria?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // proveedor asociada
    proveedor_id?: number | string;          
    proveedor_info?: SupabaseSupplierRow;         
    proveedores?: SupabaseSupplierRow;              
};

// Campos para la base de datos
export type Brand = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    categoria?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // proveedor asociada
    proveedor_id: string;          
    proveedor_info?: Supplier;  
};

// Estado de la visualización
export type UseBrandResult = {
    brand: Brand[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mostrar tabla modificadas
export type UseBrandMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (brand: BrandFormData) => Promise<Brand>;
    update: (id: string, brand: BrandFormData) => Promise<Brand>;
    remove: (id: string) => Promise<void>;
}
