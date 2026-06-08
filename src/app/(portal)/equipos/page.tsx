"use client";

import { useMemo, useState } from "react";

import { PortalShell } from "@/features/view/components/PortalShell";

import { EquiposFilters } from "@/features/view/components/Tables/Equipos/EquiposFilters";
import { EquiposTable } from "@/features/view/components/Tables/Equipos/EquiposTable";

import { useEquipoMutations, useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";

import type { Equipos, EquiposFilterValues, EquiposFormData } from "@/lib/types/equipos-types";

import type { ProductSortingOrder } from "@/lib/utils/options"; // Tipados
import { sortGroupedByCodeSupplier } from "@/lib/utils/helpers/renders";

import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { Sorting_IGV_USD } from "@/features/view/components/Buttons/Products/SortingIGVUSD";

import Button2MassiveUpload from "@/features/view/components/Buttons/Equipos/Button2MassiveUpload";
import Button2MassiveClean from "@/features/view/components/Buttons/Equipos/Button2MassiveClean";
import Button2Modal from "@/features/view/components/Buttons/Equipos/Button2Add";

export default function EquiposPage() {
	const { equipos, refetch } = useEquipos();
	const { create: create, update: update, remove: remove} = useEquipoMutations();

    // ---------------------------------
    // ---- Filtrado -------------------
    // ---------------------------------
	const [searchDescription, setSearchDescription] = useState<string>("");
	const [filters, setFilters] = useState<EquiposFilterValues>({
		type: "",
		brand: "",
		supplier: "",
	});

	const filteredEquipos = equipos.filter((equipo) => {
		const matchesType = !filters.type || equipo.tipo_de_producto === filters.type;
		const matchesBrand = !filters.brand || equipo.marca === filters.brand;
		const matchesSupplier = !filters.supplier || equipo.proveedor === filters.supplier;
		const matchesDescription = !searchDescription || equipo.descripcion.toLowerCase().includes(searchDescription.toLowerCase());

		return matchesType && matchesBrand && matchesSupplier && matchesDescription;
	});

    // ---------------------------------
    // ---- Ordenamiento ---------------
    // ---------------------------------

	// segun codigo
	const sortedByCodeProducts = useMemo(() => {
		return sortGroupedByCodeSupplier(filteredEquipos, "cod_producto");
	}, [filteredEquipos]);

	// segun precio
    const [sorting, setSorting] = useState<ProductSortingOrder>(null); // estado para ordenar la lista de productos

    const sortedEquipos = useMemo(() => {
        const EquiposToSort = [...sortedByCodeProducts]; // procura si la tabla ha sido filtrada o no

        if (!sorting) {
            return EquiposToSort;
        }

        return EquiposToSort.sort((leftEquipos, rightEquipos) => {
            const leftPrice = Number(leftEquipos.precio_dolares_igv ?? 0); // precio del row anterior
            const rightPrice = Number(rightEquipos.precio_dolares_igv ?? 0); // precio del row posterior

            return sorting === "asc"
                ? leftPrice - rightPrice // ascendente
                : rightPrice - leftPrice; // descendente
        });
    }, [sortedByCodeProducts, sorting]); // lógica para asignar el tipo de ordenamiento de productos

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
			subtitle="Gestión de equipos principales desde Supabase"
			activePath="/equipos"
		>
			<main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)] xl:items-end">
                        <div className="flex w-full xl:justify-end">
                            <SearchBar
                                value={searchDescription}
                                onChange={setSearchDescription}
                                placeholder="Buscar por descripción del equipo..."
                            />
                        </div>

                        <div className="flex w-full xl:justify-end">
                            <Sorting_IGV_USD
                                value={sorting}
                                onSortingChange={setSorting}
                            />
                        </div>

                        <div className="flex w-full xl:justify-end">
							<Button2MassiveUpload onSuccess={refetch} />
                        </div>

                        <div className="flex w-full xl:justify-end">
							<Button2MassiveClean currentCount={equipos.length} onSuccess={refetch} />
                        </div>

						<div className="flex w-full xl:justify-end">
							<Button2Modal existingEquipos={equipos} onAddEquipos={handleAddEquipos} />
                        </div>
                    </div>
                </section>

					<section className="panel">
						<div className="space-y-6">
							<EquiposFilters
								values={filters}
								onFilterChange={(key: string, value: string) =>
									setFilters((current) => ({
										...current,
										[key]: value,
									}))
								}
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
