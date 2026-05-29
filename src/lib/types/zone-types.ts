// Estado del formulario de proyectos
export type ZoneFormState = Omit<Zone, "id">; // visto desde el componente ProjectTable
export type ZoneFormData = Omit<Zone, "id">; // usado para las mutaciones (update || remove)

// Filas correspondientes a la tabla de proyectos de Supabase
export type SupabaseZoneRow = {
    // propiedades generales
    id?: number | string;
    zona?: string;
    // cálculos de radiación
    latitude?: number;
    longitude?: number;
    ghi_respaldo?: number;
    ghi_respaldo_diario?: number;
    gti_respaldo?: number;
    gti_respaldo_diario?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
};

// Campos para la base de datos para la visualización de la tabla
export type Zone = {
    // propiedades generales
    id: string;
    zona: string;
    // cálculos de radiación
    latitude: string;
    longitude: string;
    ghi_respaldo: string;
    ghi_respaldo_diario: string;
    gti_respaldo: string;
    gti_respaldo_diario: string;
    // fechas
    created_at: Date;
    updated_at: Date;
};

// Estado de la visualización de proyecos
export type UseZoneResult = {
    zones: Zone[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mostrar tabla de proyectos modificadas
export type UseZoneMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (project: ZoneFormData) => Promise<Zone>;
    update: (id: string, project: ZoneFormData) => Promise<Zone>;
    remove: (id: string) => Promise<void>;
}