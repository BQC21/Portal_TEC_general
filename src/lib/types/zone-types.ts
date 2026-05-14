// Filas correspondientes a la tabla de proyectos de Supabase
export type SupabaseZoneRow = {
    // propiedades generales
    id?: number | string;
    zona?: string;
    // cálculos de radiación
    latitude?: number;
    longitude?: number;
    ghi_respaldo?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

// Campos para la base de datos para los proyectos de ProductTable
export type Zone = {
    // propiedades generales
    id: string;
    zona: string;
    // cálculos de radiación
    latitude: string;
    longitude: string;
    ghi_respaldo: string;
    // fechas
    created_at: Date;
    updated_at: Date;
};