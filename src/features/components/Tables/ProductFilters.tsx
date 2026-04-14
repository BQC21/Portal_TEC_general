import { FilterIcon } from "@/features/components/Icons/FilterIcon";

type FilterKey = "type" | "brand" | "supplier";

export type ProductFilterValues = Record<FilterKey, string>;

const FILTERS = [
    {
        id: "type",
        label: "Filtrar por Tipo",
        placeholder: "Todos los Tipos",
        content: ["Accesorio", "Batería", "Controlador", "Convertidor", "Datalogger", "Estructura",
                "Inversor", "Módulo", "Monitor", "Smart Meter", "Cable", "Protección", "MC4"],
    },
    {
        id: "brand",
        label: "Filtrar por Marca",
        placeholder: "Todas las Marcas",
        content: ["LIVOLTEK", "GOODWE", "JA SOLAR", "INVT", "PYLONTECH", "VICTRON", "TELPERION",
                "JINKO", "SOLIS", "SOLUNA", "TRINA", "FELICITY", "SUNTREE", "TIBOX",
                "CHINT", "INDECO", "SCHNEIDER", "ABB"],
    },
    {
        id: "supplier",
        label: "Filtrar por Proveedor",
        placeholder: "Todos los Proveedores",
        content: ["Andet SAC", "Sigelet SAC", "AutoSolar SAC", "Novum Solar SAC",
                "Caral Energía SAC", "Felicity SAC", "RE&GE Import", "Grupo Coinp", "Proyect and Quality"],
    },
];

type ProductFiltersProps = {
    values: ProductFilterValues;
    onFilterChange: (key: FilterKey, value: string) => void;
};

export function ProductFilters({ values, onFilterChange }: ProductFiltersProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
        {FILTERS.map((filter) => (
            <label key={filter.id} className="space-y-2">
            <span className="block text-lg font-semibold text-slate-600">{filter.label}</span>
            <div className="relative">
                <FilterIcon />
                <select
                className="filter-control h-12 w-full appearance-none pl-11 pr-10"
                value={values[filter.id as FilterKey]}
                onChange={(event) => onFilterChange(filter.id as FilterKey, event.target.value)}
                >
                <option value="">{filter.placeholder}</option>
                {filter.content.map((item) => (
                    <option key={item} value={item}>
                    {item}
                    </option>
                ))}
                </select>
                <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
            </div>
            </label>
        ))}
        </div>
    );
}