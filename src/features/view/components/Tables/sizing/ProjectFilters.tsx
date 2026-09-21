import { useMemo } from "react";
import { ProjectFiltersProps } from "@/lib/types/components/Filter/filter_tables";
import { TableFilterSelect } from "../../Filters/TableFilterSelect";
import { uniqueNonEmptyValues } from "@/lib/utils/helpers/filters/tableFilterOptions";
import { DATE_SORT_PLACEHOLDER, DATE_SORT_SELECT_OPTIONS } from "@/lib/utils/options";
import { DateSortOrder } from "@/lib/types/components/General/options";

export function ProjectFilters({
    projects,
    values,
    onFilterChange,
    createdOrder,
    updatedOrder,
    onCreatedOrderChange,
    onUpdatedOrderChange,
}: ProjectFiltersProps) {
    const orientationOptions = useMemo(
        () => uniqueNonEmptyValues(projects.map((project) => project.angulo)),
        [projects],
    );
    const installTypeOptions = useMemo(
        () => uniqueNonEmptyValues(projects.map((project) => project.tipo_instalacion)),
        [projects],
    );
    const projectStatusOptions = useMemo(
        () => uniqueNonEmptyValues(projects.map((project) => project.estado_proyecto)),
        [projects],
    );
    const configurationOptions = useMemo(
        () => uniqueNonEmptyValues(projects.map((project) => project.configuracion)),
        [projects],
    );

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <TableFilterSelect
                label="Filtrar por Orientación"
                placeholder="Todos los ordenamientos"
                value={values.angulo}
                options={orientationOptions}
                onChange={(value) => onFilterChange("angulo", value)}
            />
            <TableFilterSelect
                label="Filtrar por Tipo de instalación"
                placeholder="Todos los"
                value={values.tipo_instalacion}
                options={installTypeOptions}
                onChange={(value) => onFilterChange("tipo_instalacion", value)}
            />
            <TableFilterSelect
                label="Filtrar por Estado del proyecto"
                placeholder="Todos los"
                value={values.estado_proyecto}
                options={projectStatusOptions}
                onChange={(value) => onFilterChange("estado_proyecto", value)}
            />
            <TableFilterSelect
                label="Filtrar por Configuración eléctrica"
                placeholder="Todos los"
                value={values.configuracion}
                options={configurationOptions}
                onChange={(value) => onFilterChange("configuracion", value)}
            />
            <TableFilterSelect
                label="Ordenar por Fecha creada"
                placeholder={DATE_SORT_PLACEHOLDER}
                value={createdOrder}
                options={[...DATE_SORT_SELECT_OPTIONS]}
                icon="sort"
                onChange={(value) => onCreatedOrderChange(value as DateSortOrder)}
            />
            <TableFilterSelect
                label="Ordenar por Fecha actualizada"
                placeholder={DATE_SORT_PLACEHOLDER}
                value={updatedOrder}
                options={[...DATE_SORT_SELECT_OPTIONS]}
                icon="sort"
                onChange={(value) => onUpdatedOrderChange(value as DateSortOrder)}
            />
        </div>
    );
}
