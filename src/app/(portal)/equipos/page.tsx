"use client";

import { useMemo, useState } from "react";

import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";

import { EquiposFilters } from "@/features/view/components/Tables/Equipos/EquiposFilters";
import { EquiposTable } from "@/features/view/components/Tables/Equipos/EquiposTable";

import { useEquipoMutations, useEquipos } from "@/features/ViewModel/hooks/services/useRealtimeEquipos";
import { useTypes } from "@/features/ViewModel/hooks/services/useRealtimeTipos";

import type { Equipos, EquiposFormData } from "@/lib/types/supabase/equipos-types";

import type { FilterKey } from "@/lib/types/components/General/options"; // Tipados
import { CodeSortOrder, MetricSort } from "@/lib/types/components/Filter/filter_tables";
import { sortByNumericField, sortGroupedByCodeSupplier } from "@/lib/utils/helpers/sorting/sorting";
import { normalizeModuloFVUnidad } from "@/lib/utils/helpers/computes/PanelNumber";
import { useCatalogCascadeFilters } from "@/features/ViewModel/hooks/filters/useCatalogCascadeFilters";
import { useDateSorting } from "@/features/ViewModel/hooks/filters/useDateSorting";

import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { TableFilterSelect } from "@/features/view/components/Filters/TableFilterSelect";

import Button2Add from "@/features/view/components/Buttons/shared/button2Add";
import Button2MassiveClean from "@/features/view/components/Buttons/shared/button2MassiveClean";
import Button2MassiveDownload from "@/features/view/components/Buttons/shared/button2MassiveDownload";
import Button2MassiveUpload from "@/features/view/components/Buttons/shared/button2MassiveUpload";
import { AddEquipoModal } from "@/features/view/components/Modals/Equipos/AddEquipoModal";
import { transformEquiposRows } from "@/lib/utils/helpers/massive/massiveUpload";
import { EQUIPOS_EXPORT_COLUMNS } from "@/lib/utils/consts/massiveDownload";
import {
	EQUIPOS_UPLOAD_COLUMNS,
	EQUIPOS_UPLOAD_HEADERS,
} from "@/lib/utils/consts/massiveUpload";
import { EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";
import { defaultPropertiesForType } from "@/lib/utils/helpers/render/EP_MAT_tables";

export default function EquiposPage() {
	const { equipos, refetch } = useEquipos();
	const { type: productTypes } = useTypes();
	const { create: create, update: update, remove: remove} = useEquipoMutations();

    // ---------------------------------
    // ---- Filtrado y sorting ---------
    // ---------------------------------
	const [searchDescription, setSearchDescription] = useState<string>("");
	const [connectionType, setConnectionType] = useState("");
	const [moduleUnit, setModuleUnit] = useState("");
	const [codeOrder, setCodeOrder] = useState<CodeSortOrder>("asc");
	const [priceOrder, setPriceOrder] = useState<CodeSortOrder | "">("");
	const [metricSort, setMetricSort] = useState<MetricSort | null>(null);
	const { filters, filterOptions, handleFilterChange } = useCatalogCascadeFilters(
		equipos,
		"Equipos",
	);

	function handleCatalogFilterChange(key: FilterKey, value: string) {
		handleFilterChange(key, value);
		if (key === "type") {
			setConnectionType("");
			setModuleUnit("");
		}
	}

	const catalogEquipos = equipos.filter((equipo) => {
		const matchesType = !filters.type || equipo.tipo_de_producto === filters.type;
		const matchesBrand = !filters.brand || equipo.marca === filters.brand;
		const matchesSupplier = !filters.supplier || equipo.proveedor === filters.supplier;
		const matchesDescription = !searchDescription || equipo.descripcion.toLowerCase()
									.includes(searchDescription.toLowerCase());
		return matchesType && matchesBrand && matchesSupplier && matchesDescription;
	});
	const specificEquipos = catalogEquipos.filter((equipo) => {
		const matchesConnection = filters.type !== "INVERSOR"
			|| !connectionType
			|| equipo.tipo_conexion === connectionType;
		const matchesUnit = filters.type !== "MÓDULO FV"
			|| !moduleUnit
			|| normalizeModuloFVUnidad(equipo.unidad) === normalizeModuloFVUnidad(moduleUnit);
		return matchesConnection && matchesUnit;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const generalesByCode = useMemo(
        () => sortGroupedByCodeSupplier(catalogEquipos, "cod_prov", codeOrder),
        [catalogEquipos, codeOrder],
    );
    const especificasSorted = useMemo(() => {
        if (metricSort) {
            return sortByNumericField(
                specificEquipos,
                metricSort.field as keyof (typeof specificEquipos)[number],
                metricSort.order,
            );
        }
        return sortGroupedByCodeSupplier(specificEquipos, "cod_prov", codeOrder);
    }, [specificEquipos, metricSort, codeOrder]);
    const preciosSorted = useMemo(() => {
        if (priceOrder) return sortByNumericField(catalogEquipos, "precio_dolares", priceOrder);
        return sortGroupedByCodeSupplier(catalogEquipos, "cod_prov", codeOrder);
    }, [catalogEquipos, priceOrder, codeOrder]);

    const {
        sortedRows: datedEquipos,
        createdOrder,
        updatedOrder,
        setCreatedOrder,
        setUpdatedOrder,
    } = useDateSorting(generalesByCode);

	// Persistir las propiedades específicas
	const specificProperties = useMemo(() => {
		if (!filters.type) return [];
		const selected = productTypes.find((item) => item.nombre === filters.type);
		const properties = selected?.propiedades
			?? defaultPropertiesForType(filters.type, selected?.categoria ?? "Equipos");
		return properties.filter((property) => property.columna !== "unidad");
	}, [filters.type, productTypes]);

    // ---------------------------------
    // ---- Lista de eventos -----------
    // ---------------------------------
	async function handleAddEquipos(equipo: EquiposFormData) {
		await create(equipo);
		await refetch();
	} // añadir equipo
	async function handleUpdateEquipos(updatedEquipo: Equipos) {
		const { id, ...equipotData } = updatedEquipo;
		await update(String(id), equipotData);
		await refetch();
	} // actualizar equipo
	async function handleDeleteEquipos(equipoId: string) {
		await remove(equipoId);
		await refetch();
	} // remover equipo

	return (
		<PortalShell
			title="Equipos principales"
			subtitle="Gestión de equipos principales"
			activePath="/equipos"
		>
			<main className="min-h-screen bg-background text-foreground">
				<div className="flex w-full min-w-0 flex-col gap-6 py-5">
                <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                        <div className="min-w-0 flex-1">
                            <SearchBar
                                value={searchDescription}
                                onChange={setSearchDescription}
                                placeholder="Buscar por descripción del equipo..."
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
							{/* <Button2MassiveUpload
								title="Subida masiva de equipos"
								description="Selecciona un archivo XLSX con la estructura de la hoja de equipos principales."
								tableName={EQUIPOS_TABLE}
								expectedHeaders={EQUIPOS_UPLOAD_HEADERS}
								columns={EQUIPOS_UPLOAD_COLUMNS}
								transformRows={transformEquiposRows}
								onSuccess={refetch}
							/> */}
							<Button2MassiveDownload
								title="Descarga masiva de equipos"
								description="Exporta el catálogo de equipos principales en XLSX o CSV."
								items={equipos}
								columns={EQUIPOS_EXPORT_COLUMNS}
								defaultFileName="equipos"
							/>
							<Button2MassiveClean
								currentCount={equipos.length}
								onSuccess={refetch}
								tableName={EQUIPOS_TABLE}
								title="Limpieza masiva de equipos"
								description="Esta acción elimina todas las filas de equipos principales."
								entityLabel="equipos principales"
							/>
							<Button2Add label="Añadir Equipo">
								{(close) => (
									<AddEquipoModal
										existingEquipos={equipos}
										onAddEquipos={async (equipo) => {
											await handleAddEquipos(equipo);
											close();
										}}
										onClose={close}
									/>
								)}
							</Button2Add>
                        </div>
                    </div>
                </section>

					<ExcelWorkbook
						defaultSheetId="generales"
						sheets={[
							{
								id: "generales",
								label: "Prop.generales",
								content: (
									<>
										<section className="panel mb-6 p-4">
											<EquiposFilters
												values={filters}
												filterOptions={filterOptions}
												onFilterChange={handleCatalogFilterChange}
												connectionType={connectionType}
												moduleUnit={moduleUnit}
												onConnectionTypeChange={setConnectionType}
												onModuleUnitChange={setModuleUnit}
												createdOrder={createdOrder}
												updatedOrder={updatedOrder}
												onCreatedOrderChange={setCreatedOrder}
												onUpdatedOrderChange={setUpdatedOrder}
												sheet="generales"
												codeOrder={codeOrder}
												onCodeOrderChange={setCodeOrder}
												metricSort={metricSort}
												onMetricSortChange={setMetricSort}
											/>
										</section>
										<EquiposTable
											equipos={datedEquipos}
											totalEquipos={equipos.length}
											onUpdateEquipos={handleUpdateEquipos}
											onDeleteEquipos={handleDeleteEquipos}
											sheet="generales"
											specificProperties={specificProperties}
										/>
									</>
								),
							},
							{
								id: "especificas",
								label: "Prop.específicas",
								content: (
									<>
										<section className="panel mb-6 p-4">
											<EquiposFilters
												values={filters}
												filterOptions={filterOptions}
												onFilterChange={handleCatalogFilterChange}
												connectionType={connectionType}
												moduleUnit={moduleUnit}
												onConnectionTypeChange={setConnectionType}
												onModuleUnitChange={setModuleUnit}
												createdOrder={createdOrder}
												updatedOrder={updatedOrder}
												onCreatedOrderChange={setCreatedOrder}
												onUpdatedOrderChange={setUpdatedOrder}
												sheet="especificas"
												codeOrder={codeOrder}
												onCodeOrderChange={setCodeOrder}
												metricSort={metricSort}
												onMetricSortChange={setMetricSort}
											/>
										</section>
										<EquiposTable
											equipos={especificasSorted}
											totalEquipos={equipos.length}
											onUpdateEquipos={handleUpdateEquipos}
											onDeleteEquipos={handleDeleteEquipos}
											sheet="especificas"
											specificProperties={specificProperties}
										/>
									</>
								),
							},
							{
								id: "precios",
								label: "Precios",
								content: (
									<>
										<section className="panel mb-6 p-4">
											<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
												<TableFilterSelect
													label="Ordenar por precio ($)"
													placeholder="Sin orden"
													value={priceOrder}
													options={[
														{ value: "asc", label: "Ascendente" },
														{ value: "desc", label: "Descendente" },
													]}
													icon="sort"
													onChange={(value) => setPriceOrder((value || "") as CodeSortOrder | "")}
												/>
											</div>
										</section>
										<EquiposTable
											equipos={preciosSorted}
											totalEquipos={equipos.length}
											onUpdateEquipos={handleUpdateEquipos}
											onDeleteEquipos={handleDeleteEquipos}
											sheet="precios"
											specificProperties={specificProperties}
										/>
									</>
								),
							},
						]}
					/>
				</div>
			</main>
		</PortalShell>
	);
}