"use client";

import { useMemo, useState } from "react";

import { PortalShell } from "@/features/view/components/Shells/PortalShell";

import { EquiposFilters } from "@/features/view/components/Tables/Equipos/EquiposFilters";
import { EquiposTable } from "@/features/view/components/Tables/Equipos/EquiposTable";

import { useEquipoMutations, useEquipos } from "@/features/ViewModel/hooks/services/useRealtimeEquipos";

import type { Equipos, EquiposFormData } from "@/lib/types/supabase/equipos-types";

import type { FilterKey } from "@/lib/types/components/General/options"; // Tipados
import { CatalogSheet, CodeSortOrder, MetricSort } from "@/lib/types/components/Filter/filter_tables";
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

export default function EquiposPage() {
	const { equipos, refetch } = useEquipos();
	const { create: create, update: update, remove: remove} = useEquipoMutations();

    // ---------------------------------
    // ---- Filtrado y sorting ---------
    // ---------------------------------
	const [searchDescription, setSearchDescription] = useState<string>("");
	const [connectionType, setConnectionType] = useState("");
	const [moduleUnit, setModuleUnit] = useState("");
	const [sheet, setSheet] = useState<CatalogSheet>("generales");
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

	const filteredEquipos = equipos.filter((equipo) => {
		const matchesType = !filters.type || equipo.tipo_de_producto === filters.type; // según tipo
		const matchesBrand = !filters.brand || equipo.marca === filters.brand; // según marca
		const matchesSupplier = !filters.supplier || equipo.proveedor === filters.supplier; // según proveedor
		const matchesDescription = !searchDescription || equipo.descripcion.toLowerCase() 
									.includes(searchDescription.toLowerCase()); // según descripción
		const matchesConnection = sheet !== "especificas"
			|| filters.type !== "INVERSOR"
			|| !connectionType
			|| equipo.tipo_conexion === connectionType;
		const matchesUnit = sheet !== "especificas"
			|| filters.type !== "MÓDULO FV"
			|| !moduleUnit
			|| normalizeModuloFVUnidad(equipo.unidad) === normalizeModuloFVUnidad(moduleUnit);

		return matchesType && matchesBrand && matchesSupplier && matchesDescription
			&& matchesConnection && matchesUnit;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const sortedByCodeEquipos = useMemo(() => {
        if (sheet === "precios" && priceOrder) {
            return sortByNumericField(filteredEquipos, "precio_dolares", priceOrder);
        }
        if (sheet === "especificas" && metricSort) {
            return sortByNumericField(
                filteredEquipos,
                metricSort.field as keyof (typeof filteredEquipos)[number],
                metricSort.order,
            );
        }
        return sortGroupedByCodeSupplier(filteredEquipos, "cod_prov", codeOrder);
    }, [filteredEquipos, sheet, priceOrder, metricSort, codeOrder]);

    const {
        sortedRows: datedEquipos,
        createdOrder,
        updatedOrder,
        setCreatedOrder,
        setUpdatedOrder,
    } = useDateSorting(sortedByCodeEquipos);
    const sortedEquipos = sheet === "generales" ? datedEquipos : sortedByCodeEquipos;

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

					{sheet !== "precios" && (
					<section className="panel p-4">
						<div className="space-y-6">
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
								sheet={sheet}
								codeOrder={codeOrder}
								onCodeOrderChange={setCodeOrder}
								metricSort={metricSort}
								onMetricSortChange={setMetricSort}
							/>
						</div>
					</section>
					)}

					{sheet === "precios" && (
					<section className="panel p-4">
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
					)}

					<EquiposTable
						equipos={sortedEquipos}
						totalEquipos={equipos.length}
						onUpdateEquipos={handleUpdateEquipos}
						onDeleteEquipos={handleDeleteEquipos}
						sheet={sheet}
						onSheetChange={setSheet}
					/>
				</div>
			</main>
		</PortalShell>
	);
}