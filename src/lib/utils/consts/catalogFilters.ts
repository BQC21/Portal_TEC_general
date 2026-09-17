import { CatalogFilterConfig } from "@/lib/types/components/Filter/filter_tables";

export const CATALOG_FILTERS: CatalogFilterConfig[] = [
	{
		id: "supplier",
		label: "Filtrar por Proveedor",
		placeholder: "Todos los Proveedores",
		optionsKey: "suppliers",
	},
	{
		id: "brand",
		label: "Filtrar por Marca",
		placeholder: "Todas las Marcas",
		optionsKey: "brands",
	},
	{
		id: "type",
		label: "Filtrar por Tipo",
		placeholder: "Todos los Tipos",
		optionsKey: "types",
	},
];
