import { CurrencyCode, FilterKey } from "@/lib/utils/options";

// Estado del formulario 
export type EquiposFormState = Omit<Equipos, "id">; // DB productos visto desde el componente ProductTable
export type EquiposFilterValues = Record<FilterKey, string>; // ProductTable con los filtros de búsqueda activados
export type EquiposFormData = Omit<Equipos, "id">; // usado para las mutaciones (update || remove)

// Filas correspondientes a la tabla de Supabase
export type SupabaseEquiposRow = {
    // propiedades generales
    id?: number | string;
    cod_prov?: string;
    proveedor?: string;
    cod_producto?: string;
    tipo_de_producto?: string;
    marca?: string;
    descripcion?: string;
    // propiedades eléctricas
    tipo_de_conexion?: string;
    tipo_conexion?: string;
    potencia_maxima?: number;
    mppt_dod?: number;
    potencia_ac?: number;
    voc_vmax?: number;
    vmpp_vmin?: number;
    isc_imax_in?: string;
    impp_imax_out?: number;
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

// Campos para la base de datos para de EquiposTable
export type Equipos = {
    // propiedades generales
    id: number | string;
    cod_prov: string;
    proveedor: string;
    cod_producto: string;
    tipo_de_producto: string;
    marca: string;
    descripcion: string;
    // propiedades eléctricas
    tipo_conexion: string;
    potencia_maxima: number;
    mppt_dod: number;
    potencia_ac: number;
    voc_vmax: number;
    vmpp_vmin: number;
    isc_imax_in: string;
    impp_imax_out: number;
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
export type UseEquiposResult = {
    equipos: Equipos[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Opciones para el filtrado
export type EquiposFilterOptions = {
    types: string[];
    brands: string[];
    suppliers: string[];
};

// Mostrar tabla modificadas
export type UseEquiposMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (product: EquiposFormData) => Promise<Equipos>;
    update: (id: string, product: EquiposFormData) => Promise<Equipos>;
    remove: (id: string) => Promise<void>;
}
