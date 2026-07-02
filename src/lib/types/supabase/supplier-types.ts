
// Estado del formulario 
export type SupplierFormstate = Omit<Supplier, "id">; 
export type SupplierFormData = Omit<Supplier, "id">; 

// Filas correspondientes a la tabla de Supabase
export type SupabaseSupplierRow = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    ruc?: string;
    contacto?: string;
    telefono?: string;
    categoria?: string;
    codigo?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

// Campos para la base de datos
export type Supplier = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    ruc?: string;
    contacto?: string;
    telefono?: string;
    categoria?: string;
    codigo?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

// Estado de la visualización
export type UseSupplierResult = {
    supplier: Supplier[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mostrar tabla modificadas
export type UseSupplierMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (supplier: SupplierFormData) => Promise<Supplier>;
    update: (id: string, supplier: SupplierFormData) => Promise<Supplier>;
    remove: (id: string) => Promise<void>;
}
