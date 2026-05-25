import { SupabaseZoneRow, Zone } from './zone-types';

// Estado del formulario de proyectos
export type ProjectFormState = Omit<Project, "id">; // visto desde el componente ProjectTable
export type ProjectFormData = Omit<Project, "id">; // usado para las mutaciones (update || remove)

// Filas correspondientes a la tabla de proyectos de Supabase
export type SupabaseProjectRow = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    descripcion?: string;
    zona_id?: number | string;             // FK a zonas.id
    zona_info?: SupabaseZoneRow;           // datos embebidos de la zona 
    zonas?: SupabaseZoneRow;               // alternative embedded relation key returned by Supabase
    // cálculos de radiación
    hsp?: number;
    ghi?: number;
    // inputs generales
    demanda_electrica?: number;
    tipo_conexion?: string;
    cobertura_porcentaje?: number;
    rendimiento_modulo_porcentaje?: number;
    relacion_DC_AC?: number;
    // cálculos de requerimientos
    energia_requerida?: number;
    potencia_DC_requerida?: number;
    potencia_AC_requerida?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // estado
    estado_proyecto?: string;
};

// Campos para la base de datos a visualizarse en el frontend
export type Project = {
    // propiedades generales
    id: string;
    nombre: string;
    descripcion: string;
    zona_id: string;   // id de la zona (1 zona por proyecto)
    zona_info?: Zone;  // datos completos de la zona 
    // cálculos de radiación
    hsp: string;
    ghi: string;
    // inputs generales
    demanda_electrica: string;
    tipo_conexion: string;
    cobertura_porcentaje: string;
    rendimiento_modulo_porcentaje: string;
    relacion_DC_AC: string;
    // cálculos de requerimientos
    energia_requerida: string;
    potencia_DC_requerida: string;
    potencia_AC_requerida: string;
    // fechas
    created_at: Date;
    updated_at: Date;
    // estado
    estado_proyecto: string;
};


// Estado de la visualización de proyecos
export type UseProjectResult = {
    projects: Project[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mostrar tabla de proyectos modificadas
export type UseProjectMutationsResult = {
    loading: boolean;
    error: string | null;
    create: (project: ProjectFormData) => Promise<Project>;
    update: (id: string, project: ProjectFormData) => Promise<Project>;
    remove: (id: string) => Promise<void>;
}