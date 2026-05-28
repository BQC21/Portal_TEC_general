import { CurrencyCode, FilterKey } from "@/lib/utils/options";

// Estado del formulario 
export type MaterialesFormState = Omit<Materiales, "id">; // DB productos visto desde el componente ProductTable
export type MaterialesFilterValues = Record<FilterKey, string>; // ProductTable con los filtros de búsqueda activados
export type MaterialesFormData = Omit<Materiales, "id">; // usado para las mutaciones (update || remove)

// Filas correspondientes a la tabla de Supabase
export type SupabaseMaterialesRow = {
    // propiedades generales
    id?: number | string;
    cod_prov?: string;
    proveedor?: string;
    cod_producto?: string;
    tipo_de_producto?: string;
    marca?: string;
    descripcion?: string;
    // propiedades eléctricas
    parte_electrica?: string;
    // ṕrecios
    unidad?: string;
    precio_soles?: number;
    precio_dolares?: number;
    igv?: number;
    precio_soles_igv?: number;
    precio_dolares_igv?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

// Campos para la base de datos para de MaterialesTable
export type Materiales = {
    // propiedades generales
    id: number | string;
    cod_prov: string;
    proveedor: string;
    cod_producto: string;
    tipo_de_producto: string;
    marca: string;
    descripcion: string;
    // propiedades eléctricas
    parte_electrica: string;
    // ṕrecios
    unidad: string;
    precio_soles: number;
    precio_dolares: number;
    igv: number;
    precio_soles_igv: number;
    precio_dolares_igv: number;
    // fechas
    created_at: Date | string | null;
    updated_at: Date | string | null;
};

// Estado de la visualización
export type UseMaterialesResult = {
    materiales: Materiales[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Opciones para el filtrado
export type MaterialesFilterOptions = {
    types: string[];
    brands: string[];
    suppliers: string[];
};

// Mostrar tabla modificadas
export type UseMaterialesMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (product: MaterialesFormData) => Promise<Materiales>;
    update: (id: string, product: MaterialesFormData) => Promise<Materiales>;
    remove: (id: string) => Promise<void>;
}
