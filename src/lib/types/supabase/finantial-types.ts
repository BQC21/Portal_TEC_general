import { Quote, SupabaseQuoteRow } from "./quote-types";

// estado del formulario
export type FinantialFormState = Omit<Finantial, "id">;
export type FinantialFormData = Omit<Finantial, "id">

// correspondencia con Supabase
export type SupabaseFinantialRow = {
    id?: number | string;
    cotizacion_id?: number | string;
    cotizacion_info?: SupabaseQuoteRow;
    cotizaciones?: SupabaseQuoteRow;
    cotizacion?: SupabaseQuoteRow; // nombre de la tabla real
    // datos 
    planta?: number;
    generacion?: number;
    tarifa_red?: number;
    degra_1er?: number;
    degra_2do?: number;
    tarifa_crecimiento?: number;
    tasa_descuento?: number;
    lcoe?: number;
    tiempo_retorno?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
}

// visualización de la tabla
export type Finantial = {
    id: string;
    cotizacion_id?: string;
    cotizacion_info?: Quote | undefined;
    // datos
    planta?: string;
    generacion?: string;
    tarifa_red?: string;
    degra_1er?: string;
    degra_2do?: string;
    tarifa_crecimiento?: string;
    tasa_descuento?: string;
    lcoe?: string;
    tiempo_retorno?: string;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
}

// manejo de la visualización
export type useFinantialResult = {
    finantials: Finantial[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// manejo de la visualización modificada
export type useFinantialMutationResult = {
    loading: boolean;
    error: string | null;
    create: (report: FinantialFormData) => Promise<Finantial>;
    update: (id: string, report: FinantialFormData) => Promise<Finantial>;
    remove: (id: string) => Promise<void>;
}