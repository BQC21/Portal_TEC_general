"use client";

import { useMemo, useState } from "react";

import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";

import { MaterialesFilters } from "@/features/view/components/Tables/Materiales/MaterialesFilters";
import { MaterialesTable } from "@/features/view/components/Tables/Materiales/MaterialesTable";

import { useMateriales, useMaterialMutations } from "@/features/ViewModel/hooks/services/useRealtimeMateriales";

import type { Materiales, MaterialesFormState } from "@/lib/types/supabase/materiales-types";

import type { FilterKey } from "@/lib/types/components/General/options"; // Tipados
import { CodeSortOrder } from "@/lib/types/components/Filter/filter_tables";
import { ELECTRICAL_PART_FILTER_TYPES } from "@/lib/utils/options";
import { sortByNumericField, sortGroupedByCodeSupplier } from "@/lib/utils/helpers/sorting/sorting";
import { useCatalogCascadeFilters } from "@/features/ViewModel/hooks/filters/useCatalogCascadeFilters";
import { useDateSorting } from "@/features/ViewModel/hooks/filters/useDateSorting";

import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { TableFilterSelect } from "@/features/view/components/Filters/TableFilterSelect";

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
import { useTypes } from "@/features/ViewModel/hooks/services/useRealtimeTipos";
import { defaultPropertiesForType } from "@/lib/utils/helpers/render/EP_MAT_tables";

export default function MaterialesPage() {
	const { materiales, refetch } = useMateriales();
	const { type: productTypes } = useTypes();
	const { create: create, update: update, remove: remove} = useMaterialMutations();

    // ---------------------------------
    // ---- Filtrado -------------------
    // ---------------------------------

	const [searchDescription, setSearchDescription] = useState<string>("");
	const [parteElectrica, setParteElectrica] = useState("");
	const [codeOrder, setCodeOrder] = useState<CodeSortOrder>("asc");
	const [priceOrder, setPriceOrder] = useState<CodeSortOrder | "">("");
	const { filters, filterOptions, handleFilterChange } = useCatalogCascadeFilters(
		materiales,
		"Materiales",
	);

	function handleCatalogFilterChange(key: FilterKey, value: string) {
		handleFilterChange(key, value);
		if (key === "type") setParteElectrica("");
	}

	const catalogMateriales = materiales.filter((material) => {
		const matchesType = !filters.type || material.tipo_de_producto === filters.type;
		const matchesBrand = !filters.brand || material.marca === filters.brand;
		const matchesSupplier = !filters.supplier || material.proveedor === filters.supplier;
		const matchesDescription = !searchDescription || material.descripcion.toLowerCase().includes(searchDescription.toLowerCase());
		return matchesType && matchesBrand && matchesSupplier && matchesDescription;
	});
	const specificMateriales = catalogMateriales.filter((material) => {
		const electricalPart = (material.parte_electrica || "---").trim() || "---";
		if (!ELECTRICAL_PART_FILTER_TYPES.includes(filters.type) || !parteElectrica) return true;
		return parteElectrica === "---"
			? electricalPart === "---"
			: electricalPart.toUpperCase() === parteElectrica.toUpperCase();
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

    const generalesByCode = useMemo(
        () => sortGroupedByCodeSupplier(catalogMateriales, "cod_prov", codeOrder),
        [catalogMateriales, codeOrder],
    );
    const especificasSorted = useMemo(
        () => sortGroupedByCodeSupplier(specificMateriales, "cod_prov", codeOrder),
        [specificMateriales, codeOrder],
    );
    const preciosSorted = useMemo(() => {
        if (priceOrder) return sortByNumericField(catalogMateriales, "precio_dolares", priceOrder);
        return sortGroupedByCodeSupplier(catalogMateriales, "cod_prov", codeOrder);
    }, [catalogMateriales, priceOrder, codeOrder]);

    const {
        sortedRows: datedMateriales,
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
			?? defaultPropertiesForType(filters.type, selected?.categoria ?? "Materiales");
		return properties.filter((property) => property.columna !== "unidad");
	}, [filters.type, productTypes]);

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
							{/* <Button2MassiveUpload
								title="Subida masiva de materiales"
								description="Selecciona un archivo XLSX con la estructura de la hoja de materiales eléctricos."
								tableName={MATERIALES_TABLE}
								expectedHeaders={MATERIALES_UPLOAD_HEADERS}
								columns={MATERIALES_UPLOAD_COLUMNS}
								transformRows={transformMaterialesRows}
								onSuccess={refetch}
							/> */}
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

					<ExcelWorkbook
						defaultSheetId="generales"
						sheets={[
							{
								id: "generales",
								label: "Prop.generales",
								content: (
									<>
										<section className="panel mb-6 p-4">
											<MaterialesFilters
												values={filters}
												filterOptions={filterOptions}
												onFilterChange={handleCatalogFilterChange}
												parteElectrica={parteElectrica}
												onParteElectricaChange={setParteElectrica}
												createdOrder={createdOrder}
												updatedOrder={updatedOrder}
												onCreatedOrderChange={setCreatedOrder}
												onUpdatedOrderChange={setUpdatedOrder}
												sheet="generales"
												codeOrder={codeOrder}
												onCodeOrderChange={setCodeOrder}
											/>
										</section>
										<MaterialesTable
											materiales={datedMateriales}
											totalMateriales={materiales.length}
											onUpdateMateriales={handleUpdateMateriales}
											onDeleteMateriales={handleDeleteMateriales}
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
											<MaterialesFilters
												values={filters}
												filterOptions={filterOptions}
												onFilterChange={handleCatalogFilterChange}
												parteElectrica={parteElectrica}
												onParteElectricaChange={setParteElectrica}
												createdOrder={createdOrder}
												updatedOrder={updatedOrder}
												onCreatedOrderChange={setCreatedOrder}
												onUpdatedOrderChange={setUpdatedOrder}
												sheet="especificas"
												codeOrder={codeOrder}
												onCodeOrderChange={setCodeOrder}
											/>
										</section>
										<MaterialesTable
											materiales={especificasSorted}
											totalMateriales={materiales.length}
											onUpdateMateriales={handleUpdateMateriales}
											onDeleteMateriales={handleDeleteMateriales}
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
										<MaterialesTable
											materiales={preciosSorted}
											totalMateriales={materiales.length}
											onUpdateMateriales={handleUpdateMateriales}
											onDeleteMateriales={handleDeleteMateriales}
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
