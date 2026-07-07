import { Project, SupabaseProjectRow } from "./project-types";

// estado del formulario
export type QuoteFormState = Omit<Quote, "id">;
export type QuoteFormData = Omit<Quote, "id">

// correspondencia con Supabase
export type SupabaseQuoteRow = {
    id?: number | string;
    cod_cotizacion?: string;
    proyecto_id?: number | string;
    proyecto_info?: SupabaseProjectRow;
    proyectos?: SupabaseProjectRow;
    igv?: number;
    tasa_cambio?: number;
    precio_dolares?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
}

// visualización de la tabla
export type Quote = {
    id: string;
    cod_cotizacion: string;
    proyecto_id: string;
    proyecto_info: Project;
    igv: string;
    tasa_cambio: string;
    precio_dolares: string;
    // fechas
    created_at: Date;
    updated_at: Date;
}

// manejo de la visualización
export type useQuoteResult = {
    quotes: Quote[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// manejo de la visualización modificada
export type useQuoteMutationResult = {
    loading: boolean;
    error: string | null;
    create: (quote: QuoteFormData) => Promise<Quote>;
    update: (id: string, quote: QuoteFormData) => Promise<Quote>;
    remove: (id: string) => Promise<Quote>;
}