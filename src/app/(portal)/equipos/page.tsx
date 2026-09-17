"use client";

import { useMemo, useState } from "react";

import { PortalShell } from "@/features/view/components/Shells/PortalShell";

import { EquiposFilters } from "@/features/view/components/Tables/Equipos/EquiposFilters";
import { EquiposTable } from "@/features/view/components/Tables/Equipos/EquiposTable";

import { useEquipoMutations, useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";

import type { Equipos, EquiposFormData } from "@/lib/types/supabase/equipos-types";

import type { ProductSortingOrder } from "@/lib/types/components/General/options"; // Tipados
import { sortGroupedByCodeSupplier, sortGroupedByPrice } from "@/lib/utils/helpers/sorting/sorting";
import { useCatalogCascadeFilters } from "@/features/view/hooks/filters/useCatalogCascadeFilters";

import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { Sorting_IGV_USD } from "@/features/view/components/sorter/SortingIGVUSD";

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
    // ---- Filtrado -------------------
    // ---------------------------------
	const [searchDescription, setSearchDescription] = useState<string>("");
	const { filters, filterOptions, handleFilterChange } = useCatalogCascadeFilters(
		equipos,
		"Equipos",
	);

	const filteredEquipos = equipos.filter((equipo) => {
		const matchesType = !filters.type || equipo.tipo_de_producto === filters.type; // según tipo
		const matchesBrand = !filters.brand || equipo.marca === filters.brand; // según marca
		const matchesSupplier = !filters.supplier || equipo.proveedor === filters.supplier; // según proveedor
		const matchesDescription = !searchDescription || equipo.descripcion.toLowerCase() 
									.includes(searchDescription.toLowerCase()); // según descripción

		return matchesType && matchesBrand && matchesSupplier && matchesDescription;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const sortedByCodeEquipos = useMemo(() => {
        return sortGroupedByCodeSupplier(filteredEquipos, "cod_producto");
    }, [filteredEquipos]);	

    const [sorting, setSorting] = useState<ProductSortingOrder>("codigo"); // estado para ordenar la lista de productos

    const sortedEquipos = useMemo(() => {
        const equiposToSort = [...sortedByCodeEquipos]; // procura si la tabla ha sido filtrada o no
        return sorting === "codigo" ? equiposToSort : 
            sorting === "asc" ? sortGroupedByPrice(equiposToSort, "asc") :
                sorting === "desc" ? sortGroupedByPrice(equiposToSort, "desc") : []
    }, [sortedByCodeEquipos, sorting]); // lógica para asignar el tipo de ordenamiento de productos

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
                            <Sorting_IGV_USD
                                value={sorting}
                                onSortingChange={setSorting}
                            />
							<Button2MassiveUpload
								title="Subida masiva de equipos"
								description="Selecciona un archivo XLSX con la estructura de la hoja de equipos principales."
								tableName={EQUIPOS_TABLE}
								expectedHeaders={EQUIPOS_UPLOAD_HEADERS}
								columns={EQUIPOS_UPLOAD_COLUMNS}
								transformRows={transformEquiposRows}
								onSuccess={refetch}
							/>
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

					<section className="panel">
						<div className="space-y-6">
							<EquiposFilters
								values={filters}
								filterOptions={filterOptions}
								onFilterChange={handleFilterChange}
							/>
						</div>
					</section>

					<EquiposTable
						equipos={sortedEquipos}
						totalEquipos={equipos.length}
						onUpdateEquipos={handleUpdateEquipos}
						onDeleteEquipos={handleDeleteEquipos}
					/>
				</div>
			</main>
		</PortalShell>
	);
}