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
    id?: number | string;
    cod_prov?: string;
    proveedor?: string;
    codigo?: string;
    tipo?: string;
    marca?: string;
    unidad?: string;
    descripcion?: string;
    tipo_conexion?: string;
    pot_maxima?: number;
    mppt?: number;
    dod?: number;
    array_mppt?: number;
    voc?: number;
    vmpp?: number;
    isc?: number;
    impp?: number;
    precio_soles?: number;
    precio_dolares?: number;
    precio_soles_igv?: number;
    precio_dolares_igv?: number;
    igv?: number;
    panel_array?: number;
    panel_area?: number;
    fuente_electrica?: string;
    power_source?: string;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    beta_percent?: number;
    potencia_ac?: number;
    potenciaAC?: number;
    ruc?: string;
    estado_equipo?: string;
    fecha_estimada_importacion?: Date | string | null;
    priceInputCurrency?: string;
    price_input_currency?: string;
    fuente_divisas?: string;
    fuente_divisa?: string;
    moneda?: string;
    currency_source?: string;
};

// Campos para la base de datos para los productos de ProductTable
export type Product = {
    id: string;
    ruc: string;
    supplier: string;
    supplierCode: string;
    code: string;
    type: string;
    brand: string;
    unit: string;
    description: string;
    connectionType: string;
    maxPower: string;
    mpptNumber: string;
    dod: string;
    arraysPerMppt: string;
    voc: string;
    vmpp: string;
    isc: string;
    impp: string;
    priceInputCurrency: CurrencyCode;
    pricePen: number;
    priceUsd: number;
    igv: number;
    panel_array: string;
    panel_area: string;
    powerSource: string;
    beta_percent: string;
    precio_soles_igv: number;
    precio_dolares_igv: number;
    fecha_creada: Date;
    fecha_actualizada: Date;
    estado_equipo: string;
    fecha_estimada_importacion: Date | null;
    potenciaAC: string; 
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

export type MassiveCreateResult = {
    inserted: number;
    failed: number;
    products: Product[];
};

// Mostrar tabla de productos modificadas
export type UseProductMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (product: ProductFormData) => Promise<Product>;
    createBulk: (products: ProductFormData[]) => Promise<MassiveCreateResult>;
    update: (id: string, product: ProductFormData) => Promise<Product>;
    remove: (id: string) => Promise<void>;
}

// tipado para la tasa de cambio emitida por la SUNAT
export type SunatRate = {
    buy_price: string;
    sell_price: string;
    date: string;
};
