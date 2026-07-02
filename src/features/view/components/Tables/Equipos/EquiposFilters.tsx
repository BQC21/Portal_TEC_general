import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { 
    BRAND_OPTIONS_EQUIPOS,
    EQUIPOS_TYPE_OPTIONS, 
    FilterKey,
    SUPPLIER_OPTIONS_EQUIPOS
} from "@/lib/utils/options"
import { useMemo } from "react";
import { SelectorIcon } from "../../Icons/SelectorIcon";
import { shouldRender_EquipoInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";
import { EquiposFiltersProps } from "@/lib/types/components/filter_tables";

const FILTERS = [
    {
        id: "type",
        label: "Filtrar por Tipo",
        placeholder: "Todos los Tipos",
        content: EQUIPOS_TYPE_OPTIONS,
    },
    {
        id: "brand",
        label: "Filtrar por Marca",
        placeholder: "Todas las Marcas",
        content: BRAND_OPTIONS_EQUIPOS,
    },
    {
        id: "supplier",
        label: "Filtrar por Proveedor",
        placeholder: "Todos los Proveedores",
        content: SUPPLIER_OPTIONS_EQUIPOS,
    },
];

export function EquiposFilters({ values, onFilterChange }: EquiposFiltersProps) {

    const brandFilterOptions = useMemo(() => {
        if (!values.type) {
            return BRAND_OPTIONS_EQUIPOS;
        }

        const { brand_options } = shouldRender_EquipoInfoSelection(values.type);
        return brand_options.length > 0 ? brand_options : BRAND_OPTIONS_EQUIPOS;
    }, [values.type]);
    

    return (
        <div className="grid gap-4 lg:grid-cols-3">
        {FILTERS.map((filter) => (
            <label key={filter.id} className="space-y-2">
                {/* Texto de encabezado */}
                <span className="block text-center text-lg font-semibold text-slate-600">{filter.label}</span>
                <div className="relative">
                    {/* Ícono inicial */}
                    <FilterIcon />
                    {/* Selector */}
                    <select
                        className="filter-control h-12 w-full appearance-none pl-11 pr-10"
                        value={values[filter.id as FilterKey] ?? ""}
                        onChange={(event) => {
                            const nextValue = event.target.value;

                            if (filter.id === "type") {
                                onFilterChange("type", nextValue);

                                const { brand_options } = shouldRender_EquipoInfoSelection(nextValue);
                                if (values.brand && brand_options.length > 0 && !brand_options.includes(values.brand)) {
                                    onFilterChange("brand", "");
                                }
                                return;
                            }

                            onFilterChange(filter.id as FilterKey, nextValue);
                        }}
                    >
                        {/* Mostrar opciones */}
                        <option value="">{filter.placeholder}</option>
                        {(filter.id === "brand" ? brandFilterOptions : filter.content).map((item: string) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                    </select>
                    {/* Ícono final */}
                    <SelectorIcon/>
                </div>
            </label>
        ))}
        </div>
    );
}