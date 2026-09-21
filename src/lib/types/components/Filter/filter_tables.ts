import { DateSortOrder, FilterKey } from "../General/options";
import { MaterialesFilterValues } from "../../supabase/materiales-types";
import { EquiposFilterValues } from "../../supabase/equipos-types";
import { Project } from "../../supabase/project-types";
import { Quote } from "../../supabase/quote-types";
import { Report } from "../../supabase/report-types";

export type CascadeFilterOptions = {
	suppliers: string[];
	brands: string[];
	types: string[];
};

export type CatalogFilterConfig = {
	id: FilterKey;
	label: string;
	placeholder: string;
	optionsKey: keyof CascadeFilterOptions;
};

export type DateSortingFilterProps = {
    createdOrder: DateSortOrder;
    updatedOrder: DateSortOrder;
    onCreatedOrderChange: (value: DateSortOrder) => void;
    onUpdatedOrderChange: (value: DateSortOrder) => void;
};

// Filtrado de materiales
export type MaterialesFiltersProps = {
    values: MaterialesFilterValues;
    filterOptions: CascadeFilterOptions;
    onFilterChange: (key: FilterKey, value: string) => void;
} & DateSortingFilterProps;

// Filtrado de equipos
export type EquiposFiltersProps = {
    values: EquiposFilterValues;
    filterOptions: CascadeFilterOptions;
    onFilterChange: (key: FilterKey, value: string) => void;
} & DateSortingFilterProps;

export type ProjectFilterValues = {
    angulo: string;
    tipo_instalacion: string;
    estado_proyecto: string;
    configuracion: string;
};

export type ProjectFiltersProps = {
    projects: Project[];
    values: ProjectFilterValues;
    onFilterChange: (key: keyof ProjectFilterValues, value: string) => void;
} & DateSortingFilterProps;

export type ZoneFiltersProps = DateSortingFilterProps;

export type QuoteFilterValues = {
    precio_dolares: string;
};

export type QuoteFiltersProps = {
    quotes: Quote[];
    values: QuoteFilterValues;
    onFilterChange: (key: keyof QuoteFilterValues, value: string) => void;
} & DateSortingFilterProps;

export type ReportFilterValues = {
    precio_cotizacion: string;
};

export type ReportFiltersProps = {
    reports: Report[];
    values: ReportFilterValues;
    onFilterChange: (key: keyof ReportFilterValues, value: string) => void;
} & DateSortingFilterProps;

export type FinantialFiltersProps = DateSortingFilterProps;