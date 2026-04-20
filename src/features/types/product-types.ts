// Codigos de definición para tipo de cambio
export type CurrencyCode = "PEN" | "USD";

// Campos para la base de datos para los productos
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
    powerSource: string;
    beta_percent: string;
    precio_soles_igv: number;
    precio_dolares_igv: number;
    fecha_creada: Date;
    fecha_actualizada: Date;
    estado_equipo: string;
    fecha_estimada_importacion: Date | null;
};

// Estado del formulario para agregar o editar productos
export type ProductFormData = Omit<Product, "id">;

// Estado de la visualización de productos
export interface UseProductsResult {
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

// Mostrar tabla de productos modificadas
export interface UseProductMutationsResult {
    loading: boolean;
    error: string | null;
    create: (product: ProductFormData) => Promise<Product>;
    update: (id: string, product: ProductFormData) => Promise<Product>;
    remove: (id: string) => Promise<void>;
}