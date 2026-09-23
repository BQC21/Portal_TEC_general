"use client";

import { useMemo, useState } from "react";

import { PortalShell } from "@/features/view/components/Shells/PortalShell";

import { MaterialesFilters } from "@/features/view/components/Tables/Materiales/MaterialesFilters";
import { MaterialesTable } from "@/features/view/components/Tables/Materiales/MaterialesTable";

import { useMateriales, useMaterialMutations } from "@/features/controller/hooks/services/useRealtimeMateriales";

import type { Materiales, MaterialesFormState } from "@/lib/types/supabase/materiales-types";

import type { ProductSortingOrder } from "@/lib/types/components/General/options"; // Tipados
import { sortGroupedByCodeSupplier, sortGroupedByPrice } from "@/lib/utils/helpers/sorting/sorting";
import { useCatalogCascadeFilters } from "@/features/controller/hooks/filters/useCatalogCascadeFilters";
import { useDateSorting } from "@/features/controller/hooks/filters/useDateSorting";

import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { Sorting_IGV_USD } from "@/features/view/components/sorter/SortingIGVUSD";

import Button2Add from "@/features/view/components/Buttons/shared/button2Add";
import Button2MassiveClean from "@/features/view/components/Buttons/shared/button2MassiveClean";
import Button2MassiveDownload from "@/features/view/components/Buttons/shared/button2MassiveDownload";
import Button2MassiveUpload from "@/features/view/components/Buttons/shared/button2MassiveUpload";
import { AddMaterialModal } from "@/features/view/components/Modals/Materiales/AddMaterialModal";
import { transformMaterialesRows } from "@/lib/utils/helpers/massive/massiveUpload";
import { MATERIALES_EXPORT_COLUMNS } from "@/lib/utils/consts/massiveDownload";
import {
	MATERIALES_UPLOAD_COLUMNS,
	MATERIALES_UPLOAD_HEADERS,
} from "@/lib/utils/consts/massiveUpload";
import { MATERIALES_TABLE } from "@/lib/utils/namingTolerance";

export default function MaterialesPage() {
	const { materiales, refetch } = useMateriales();
	const { create: create, update: update, remove: remove} = useMaterialMutations();

    // ---------------------------------
    // ---- Filtrado -------------------
    // ---------------------------------

	const [searchDescription, setSearchDescription] = useState<string>("");
	const { filters, filterOptions, handleFilterChange } = useCatalogCascadeFilters(
		materiales,
		"Materiales",
	);

	const filteredMateriales = materiales.filter((material) => {
		const matchesType = !filters.type || material.tipo_de_producto === filters.type;
		const matchesBrand = !filters.brand || material.marca === filters.brand;
		const matchesSupplier = !filters.supplier || material.proveedor === filters.supplier;
		const matchesDescription = !searchDescription || material.descripcion.toLowerCase().includes(searchDescription.toLowerCase());

		return matchesType && matchesBrand && matchesSupplier && matchesDescription;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const sortedByCodeMateriales = useMemo(() => {
        return sortGroupedByCodeSupplier(filteredMateriales, "cod_producto");
    }, [filteredMateriales]);	

    const [sorting, setSorting] = useState<ProductSortingOrder>("codigo"); // estado para ordenar la lista de productos

    const sortedByPriceMateriales = useMemo(() => {
        const materialesToSort = [...sortedByCodeMateriales]; // procura si la tabla ha sido filtrada o no
        return sorting === "codigo" ? materialesToSort : 
            sorting === "asc" ? sortGroupedByPrice(materialesToSort, "asc") :
                sorting === "desc" ? sortGroupedByPrice(materialesToSort, "desc") : []
    }, [sortedByCodeMateriales, sorting]); // lógica para asignar el tipo de ordenamiento de productos

    const {
        sortedRows: sortedMateriales,
        createdOrder,
        updatedOrder,
        setCreatedOrder,
        setUpdatedOrder,
    } = useDateSorting(sortedByPriceMateriales);
	
	// ---------------------------------
	// ---- Lista de eventos -----------
	// ---------------------------------
	async function handleAddMateriales(material: MaterialesFormState) {
		await create(material);
		await refetch();
	} // añadir equipo
	async function handleUpdateMateriales(updatedMateriales: Materiales) {
		const { id, ... materialData } = updatedMateriales;
		await update(String(id), materialData);
		await refetch();
	} // actualizar equipo
	async function handleDeleteMateriales(materialId: string) {
		await remove(materialId);
		await refetch();
	} // remover equipo


	return (
		<PortalShell
			title="Materiales eléctricos"
			subtitle="Gestión de materiales eléctricos"
			activePath="/materiales"
		>
			<main className="min-h-screen bg-background text-foreground">
				<div className="flex w-full min-w-0 flex-col gap-6 py-5">
                <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                        <div className="min-w-0 flex-1">
                            <SearchBar
                                value={searchDescription}
                                onChange={setSearchDescription}
								placeholder="Buscar por descripción del material..."
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Sorting_IGV_USD
                                value={sorting}
                                onSortingChange={setSorting}
                            />
							<Button2MassiveUpload
								title="Subida masiva de materiales"
								description="Selecciona un archivo XLSX con la estructura de la hoja de materiales eléctricos."
								tableName={MATERIALES_TABLE}
								expectedHeaders={MATERIALES_UPLOAD_HEADERS}
								columns={MATERIALES_UPLOAD_COLUMNS}
								transformRows={transformMaterialesRows}
								onSuccess={refetch}
							/>
							<Button2MassiveDownload
								title="Descarga masiva de materiales"
								description="Exporta el catálogo de materiales eléctricos en XLSX o CSV."
								items={materiales}
								columns={MATERIALES_EXPORT_COLUMNS}
								defaultFileName="materiales"
							/>
							<Button2MassiveClean
								currentCount={materiales.length}
								onSuccess={refetch}
								tableName={MATERIALES_TABLE}
								title="Limpieza masiva de materiales"
								description="Esta acción elimina todas las filas de materiales eléctricos."
								entityLabel="materiales eléctricos"
							/>
							<Button2Add label="Añadir Material">
								{(close) => (
									<AddMaterialModal
										existingMateriales={materiales}
										onAddMateriales={async (material) => {
											await handleAddMateriales(material);
											close();
										}}
										onClose={close}
									/>
								)}
							</Button2Add>
                        </div>
                    </div>
                </section>

					<section className="panel p-4">
						<div className="space-y-6">
							<MaterialesFilters
								values={filters}
								filterOptions={filterOptions}
								onFilterChange={handleFilterChange}
								createdOrder={createdOrder}
								updatedOrder={updatedOrder}
								onCreatedOrderChange={setCreatedOrder}
								onUpdatedOrderChange={setUpdatedOrder}
							/>
						</div>
					</section>

					<MaterialesTable
						materiales={sortedMateriales}
						totalMateriales={materiales.length}
						onUpdateMateriales={handleUpdateMateriales}
						onDeleteMateriales={handleDeleteMateriales}
					/>
				</div>
			</main>
		</PortalShell>
	);
}
