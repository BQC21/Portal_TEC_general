import { SupabaseZoneRow, Zone } from "@/lib/types/supabase/zone-types";

// Estado del formulario de proyectos
export type ProjectFormState = Omit<Project, "id">; // visto desde el componente ProjectTable
export type ProjectFormData = Omit<Project, "id">; // usado para las mutaciones (update || remove)

// Proyecto seleccionado
export type SelectedProjectItem = {
    row: string;
    // propiedades generales
    id: string;
    nombre: string;
};

// Columnas correspondientes a la tabla de proyectos de Supabase
export type SupabaseProjectRow = {
    // propiedades generales
    id?: number | string;
    nombre?: string;
    descripcion?: string;
    zona_id?: number | string;             // FK a zonas.id
    zona_info?: SupabaseZoneRow;           // datos embebidos de la zona 
    zonas?: SupabaseZoneRow;               // alternative embedded relation key returned by Supabase
    angulo?: string;
    tipo_instalacion?: string;
    // cálculos de radiación
    hsp?: number;
    ghi?: number;
    // datos del sistema
    demanda_electrica?: number;
    configuracion?: string;
    cobertura_porcentaje?: number;
    rendimiento_modulo_porcentaje?: number;
    // requerimientos energéticos
    energia_requerida?: number;
    potencia_dc_requerida?: number;
    potencia_ac_requerida?: number;
    // campo fotovoltaico
    strings_min?: number;
    strings_max?: number;
    strings?: number;
    // protecciones eléctricas
    itm_dc_min?: number;
    itm_ac_min?: number;
    spd_voltage?: number;
    mppt_number?: number;
    // almacenamiento energético
    autonomia?: number;
    ah_sistema?: number;
    num_baterias?: number;
    // fechas
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    // estado
    estado_proyecto?: string;
    // enlace
    enlace?: string;
    // llenado
    opcion_llenado?: string;
    // demandas mensuales
    demanda_mensual?: number[];
};

// Campos para la base de datos a visualizarse en el frontend
export type Project = {
    // propiedades generales
    id: string;
    nombre: string;
    descripcion: string;
    zona_id: string;   // id de la zona (1 zona por proyecto)
    zona_info?: Zone;  // datos completos de la zona 
    angulo?: string;
    tipo_instalacion: string;
    // cálculos de radiación
    hsp: string;
    ghi: string;
    // datos del sistema
    demanda_electrica: string;
    configuracion: string;
    cobertura_porcentaje: string;
    rendimiento_modulo_porcentaje: string;
    // requerimientos energéticos
    energia_requerida: string;
    potencia_dc_requerida: string;
    potencia_ac_requerida: string;
    // campo fotovoltaico
    strings_min: string;
    strings_max: string;
    strings: string;
    // protecciones eléctricas
    itm_dc_min: string;
    itm_ac_min: string;
    spd_voltage: string;
    mppt_number: string;
    // almacenamiento energético
    autonomia: string;
    ah_sistema: string;
    num_baterias: string;
    // fechas
    created_at: Date;
    updated_at: Date;
    // estado
    estado_proyecto: string;
    // enlace
    enlace: string;
    // llenado
    opcion_llenado: string;
    // demandas mensuales
    demanda_mensual: number[];
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