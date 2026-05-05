// Codigos de definición 
export type CurrencyCode = "PEN" | "USD"; // tipo de cambio
export type ProductSortingOrder = "asc" | "desc" | null; // tipo de ordenamiento
export type FilterKey = "type" | "brand" | "supplier"; // forma de filtrado

// Estado del formulario de productos
export type ProductFormState = Omit<Product, "id">; // DB productos visto desde el componente ProductTable
export type ProductFilterValues = Record<FilterKey, string>; // ProductTable con los filtros de búsqueda activados
export type ProductFormData = Omit<Product, "id">; // usado para las mutaciones (update || remove)

// Filas correspondientes a la tabla de productos de Supabase
export type SupabaseProductRow = {
    // propiedades generales
    id?: number | string;
    ruc?: string;
    cod_prov?: string;
    proveedor?: string;
    codigo?: string;
    tipo?: string;
    marca?: string;
    unidad?: string;
    descripcion?: string;
    // propiedades bateria
    tipo_conexion_bateria?: string;
    dod?: number;
    amperaje_bateria?: number;
    voltaje_bateria?: number;
    // propiedades estructura
    panel_array?: number;
    // propiedades inversor
    tipo_conexion_inversor?: string;
    potencia_dc_inversor?: number;
    potencia_ac_inversor?: number;
    mppt?: number;
    i_entrada_inversor?: number;
    i_salida_inversor?: number;
    voltaje_maximo_inversor?: number;
    // propiedades modulo
    potencia_modulo?: number;
    voc?: number;
    vmpp?: number;
    isc?: number;
    impp?: number;
    panel_area?: number;
    // propiedades smart meter
    tipo_conexion_smartmeter?: string;
    // propiedades cableado
    fuente_electrica?: string;
    // ṕrecios
    precio_soles?: number;
    precio_dolares?: number;
    precio_soles_igv?: number;
    precio_dolares_igv?: number;
    igv?: number;
    priceInputCurrency?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // estado
    estado_equipo?: string;
    fecha_estimada_importacion?: Date | string | null;
};

// Campos para la base de datos para los productos de ProductTable
export type Product = {
    // propiedades generales
    id: string;
    ruc: string;
    proveedor: string;
    cod_prov: string;
    codigo: string;
    tipo: string;
    marca: string;
    unidad: string;
    descripcion: string;
    // propiedades bateria
    tipo_conexion_bateria: string;
    dod: string;
    amperaje_bateria: string;
    voltaje_bateria: string;
    // propiedades estructura
    panel_array: string;
    // propiedades inversor
    tipo_conexion_inversor: string;
    potencia_dc_inversor: string;
    potencia_ac_inversor: string;
    mppt: string;
    i_entrada_inversor: string;
    i_salida_inversor: string;
    voltaje_maximo_inversor: string;
    // propiedades modulo
    potencia_modulo: string;
    voc: string;
    vmpp: string;
    isc: string;
    impp: string;
    panel_area: string;
    // propiedades smart meter
    tipo_conexion_smartmeter: string;
    // propiedades cableado
    fuente_electrica: string;
    // precios
    priceInputCurrency: CurrencyCode;
    precio_soles: number;
    precio_dolares: number;
    igv: number;
    precio_soles_igv: number;
    precio_dolares_igv: number;
    // fechas
    created_at: Date;
    updated_at: Date;
    // estado
    estado_equipo: string;
    fecha_estimada_importacion: Date | null;
};

// Estado de la visualización de productos
export type UseProductsResult = {
    products: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Opciones para el filtrado de productos
export type ProductFilterOptions = {
    types: string[];
    brands: string[];
    suppliers: string[];
};

// export type MassiveCreateResult = {
//     inserted: number;
//     failed: number;
//     products: Product[];
// };

// Mostrar tabla de productos modificadas
export type UseProductMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (product: ProductFormData) => Promise<Product>;
    // createBulk: (products: ProductFormData[]) => Promise<MassiveCreateResult>;
    update: (id: string, product: ProductFormData) => Promise<Product>;
    remove: (id: string) => Promise<void>;
}

// tipado para la tasa de cambio emitida por la SUNAT
export type SunatRate = {
    buy_price: string;
    sell_price: string;
    date: string;
};
