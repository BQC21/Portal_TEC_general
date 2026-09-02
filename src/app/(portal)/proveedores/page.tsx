"use client"

import Button2Modal_brand from "@/features/view/components/Buttons/Proveedores/marcas/button2Add";
import Button2Modal_supplier from "@/features/view/components/Buttons/Proveedores/proveedores/button2Add";
import Button2Modal_type from "@/features/view/components/Buttons/Proveedores/tipo/button2Add";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import BrandTable from "@/features/view/components/Tables/Proveedores/BrandTable";
import SupplierTable from "@/features/view/components/Tables/Proveedores/SupplierTable";
import TypeTable from "@/features/view/components/Tables/Proveedores/TypeTable";
import { useBrands, useBrandsMutations } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores, useProveedoresMutations } from "@/features/view/hooks/services/useRealtimeProveedores";
import { useTypes, useTypesMutations } from "@/features/view/hooks/services/useRealtimeTipos";
import { Brand, BrandFormData } from "@/lib/types/supabase/brand.types";
import { Supplier, SupplierFormData } from "@/lib/types/supabase/supplier-types";
import { Type, TypeFormData } from "@/lib/types/supabase/type-types";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { useState } from "react";

export default function ProveedoresPage() {
	const { supplier, refetch: refetchSupplier } = useProveedores();
	const { create: createSupplier, update: updateSupplier, remove: removeSupplier} = useProveedoresMutations();

    const { brand, refetch: refetchBrand } = useBrands();
	const { create: createBrand, update: updateBrand, remove: removeBrand} = useBrandsMutations();

    const { type, refetch: refetchType } = useTypes();
	const { create: createType, update: updateType, remove: removeType} = useTypesMutations();

    // ---------------------------------
    // ---- Filtrado -------------------
    // ---------------------------------
	const [searchSupplier, setSearchSupplier] = useState<string>("");
	const [searchBrand, setSearchBrand] = useState<string>("");
	const [searchType, setSearchType] = useState<string>("");

    const filteredSupplier = supplier.filter((supplier) => {
		const matchesDescription = !searchSupplier || 
            supplier.nombre?.toLowerCase().includes(searchSupplier.toLowerCase());

		return matchesDescription;
	});

    const filteredBrand = brand.filter((brand) => {
		const matchesDescription = !searchBrand || 
            brand.nombre?.toLowerCase().includes(searchBrand.toLowerCase());

		return matchesDescription;
	});

    const filteredType = type.filter((type) => {
		const matchesDescription = !searchType || 
            type.nombre?.toLowerCase().includes(searchType.toLowerCase());

		return matchesDescription;
	});

    // ---------------------------------
    // ---- Lista de eventos -----------
    // ---------------------------------
	async function handleAddSupplier(supplier: SupplierFormData) {
		await createSupplier(supplier);
		await refetchSupplier();
	} // añadir 
	async function handleUpdateSupplier(updatedSupplier: Supplier) {
		const { id, ...supplierData } = updatedSupplier;
		await updateSupplier(String(id), supplierData);
		await refetchSupplier();
	} // actualizar 
	async function handleDeleteSupplier(supplierId: string) {
		await removeSupplier(supplierId);
		await refetchSupplier();
	} // remover 

////////////////////

	async function handleAddBrand(brand: BrandFormData) {
		await createBrand(brand);
		await refetchBrand();
	} // añadir 
	async function handleUpdateBrand(updatedBrand: Brand) {
		const { id, ...brandData } = updatedBrand;
		await updateBrand(String(id), brandData);
		await refetchBrand();
	} // actualizar 
	async function handleDeleteBrand(brandId: string) {
		await removeBrand(brandId);
		await refetchBrand();
	} // remover 

////////////////////

	async function handleAddType(type: TypeFormData) {
		await createType(type);
		await refetchType();
	} // añadir 
	async function handleUpdateType(updatedType: Type) {
		const { id, ...typeData } = updatedType;
		await updateType(String(id), typeData);
		await refetchType();
	} // actualizar 
	async function handleDeleteType(typeId: string) {
		await removeType(typeId);
		await refetchType();
	} // remover 

    return(
        <PortalShell
			title="Información adicional"
			subtitle="Aquí puedes revisar los proveedores, marcas y tipos de productos disponibles"
			activePath="/proveedores"
		>
            <main className="min-h-screen bg-background text-foreground">
                <div className="flex w-full min-w-0 flex-col gap-6 py-5">
                    <ExcelWorkbook
                        sheets={[
                            {
                                id: "proveedores",
                                label: "Lista de proveedores",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchSupplier}
                                                    onChange={setSearchSupplier}
                                                    placeholder="Buscar por nombre del proveedor..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Modal_supplier onAddSupplier={handleAddSupplier} />
                                            </div>
                                        </section>
                                        <SupplierTable
                                            supplier={filteredSupplier}
                                            totalSupplier={filteredSupplier.length}
                                            onUpdateSupplier={handleUpdateSupplier}
                                            onDeleteSupplier={handleDeleteSupplier}
                                        />
                                    </>
                                ),
                            },
                            {
                                id: "marcas",
                                label: "Lista de marcas",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchBrand}
                                                    onChange={setSearchBrand}
                                                    placeholder="Buscar por nombre de la marca..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Modal_brand onAddBrand={handleAddBrand} />
                                            </div>
                                        </section>
                                        <BrandTable
                                            brand={filteredBrand}
                                            totalBrand={filteredBrand.length}
                                            onUpdateBrand={handleUpdateBrand}
                                            onDeleteBrand={handleDeleteBrand}
                                        />
                                    </>
                                ),
                            },
                            {
                                id: "tipos",
                                label: "Lista de tipo de producto",
                                content: (
                                    <>
                                        <section className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
                                            <div className="min-w-0 flex-1">
                                                <SearchBar
                                                    value={searchType}
                                                    onChange={setSearchType}
                                                    placeholder="Buscar por tipo de producto..."
                                                />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <Button2Modal_type onAddType={handleAddType} />
                                            </div>
                                        </section>
                                        <TypeTable
                                            type={filteredType}
                                            totalType={filteredType.length}
                                            onUpdateType={handleUpdateType}
                                            onDeleteType={handleDeleteType}
                                        />
                                    </>
                                ),
                            },
                        ]}
                    />
                </div>
            </main>
        </PortalShell>
    )
}