"use client"

import Button2Add from "@/features/view/components/Buttons/shared/button2Add";
import Button2MassiveClean from "@/features/view/components/Buttons/shared/button2MassiveClean";
import Button2MassiveDownload from "@/features/view/components/Buttons/shared/button2MassiveDownload";
import Button2MassiveUpload from "@/features/view/components/Buttons/shared/button2MassiveUpload";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import { ExcelWorkbook } from "@/features/view/components/Shells/ExcelWorkbook";
import BrandTable from "@/features/view/components/Tables/Proveedores/BrandTable";
import SupplierTable from "@/features/view/components/Tables/Proveedores/SupplierTable";
import TypeTable from "@/features/view/components/Tables/Proveedores/TypeTable";
import AddBrandModal from "@/features/view/components/Modals/Proveedores/marcas/AddBrandModal";
import AddSupplierModal from "@/features/view/components/Modals/Proveedores/proveedores/AddSupplierModal";
import AddTypeModal from "@/features/view/components/Modals/Proveedores/tipo/AddTypeModal";
import { useBrands, useBrandsMutations } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores, useProveedoresMutations } from "@/features/view/hooks/services/useRealtimeProveedores";
import { useTypes, useTypesMutations } from "@/features/view/hooks/services/useRealtimeTipos";
import { Brand, BrandFormData } from "@/lib/types/supabase/brand.types";
import { Supplier, SupplierFormData } from "@/lib/types/supabase/supplier-types";
import { Type, TypeFormData } from "@/lib/types/supabase/type-types";
import { SearchBar } from "@/features/view/components/Bars/SearchBar";
import { useState } from "react";
import {
	transformBrandRows,
	transformSupplierRows,
	transformTypeRows,
} from "@/lib/utils/helpers/massive/massiveUpload";
import {
	BRAND_EXPORT_COLUMNS,
	SUPPLIER_EXPORT_COLUMNS,
	TYPE_EXPORT_COLUMNS,
} from "@/lib/utils/consts/massiveDownload";
import {
	BRAND_UPLOAD_COLUMNS,
	BRAND_UPLOAD_HEADERS,
	SUPPLIER_UPLOAD_COLUMNS,
	SUPPLIER_UPLOAD_HEADERS,
	TYPE_UPLOAD_COLUMNS,
	TYPE_UPLOAD_HEADERS,
} from "@/lib/utils/consts/massiveUpload";
import { BRAND_TABLE, SUPPLIER_TABLE, TYPE_TABLE } from "@/lib/utils/namingTolerance";

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
                                                <Button2MassiveUpload
                                                    title="Subida masiva de proveedores"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de proveedores."
                                                    tableName={SUPPLIER_TABLE}
                                                    expectedHeaders={SUPPLIER_UPLOAD_HEADERS}
                                                    columns={SUPPLIER_UPLOAD_COLUMNS}
                                                    transformRows={transformSupplierRows}
                                                    onSuccess={refetchSupplier}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de proveedores"
                                                    description="Exporta la lista de proveedores en XLSX o CSV."
                                                    items={supplier.map((item) => ({
                                                        nombre: item.nombre ?? "",
                                                        codigo: item.codigo ?? "",
                                                        ruc: item.ruc ?? "",
                                                        contacto: item.contacto ?? "",
                                                        telefono: item.telefono ?? "",
                                                        categoria: item.categoria ?? "",
                                                    }))}
                                                    columns={SUPPLIER_EXPORT_COLUMNS}
                                                    defaultFileName="proveedores"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={supplier.length}
                                                    onSuccess={refetchSupplier}
                                                    tableName={SUPPLIER_TABLE}
                                                    title="Limpieza masiva de proveedores"
                                                    description="Esta acción elimina todas las filas de proveedores."
                                                    entityLabel="proveedores"
                                                />
                                                <Button2Add label="Añadir Proveedor">
                                                    {(close) => (
                                                        <AddSupplierModal
                                                            onAddSupplier={async (newSupplier: SupplierFormData) => {
                                                                await handleAddSupplier(newSupplier);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Add>
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
                                                <Button2MassiveUpload
                                                    title="Subida masiva de marcas"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de marcas."
                                                    tableName={BRAND_TABLE}
                                                    expectedHeaders={BRAND_UPLOAD_HEADERS}
                                                    columns={BRAND_UPLOAD_COLUMNS}
                                                    transformRows={transformBrandRows}
                                                    onSuccess={refetchBrand}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de marcas"
                                                    description="Exporta la lista de marcas en XLSX o CSV."
                                                    items={brand.map((item) => ({
                                                        nombre: item.nombre ?? "",
                                                        categoria: item.categoria ?? "",
                                                        proveedores: (item.proveedores_info ?? [])
                                                            .map((supplierItem) => supplierItem.nombre)
                                                            .filter(Boolean)
                                                            .join(", "),
                                                    }))}
                                                    columns={BRAND_EXPORT_COLUMNS}
                                                    defaultFileName="marcas"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={brand.length}
                                                    onSuccess={refetchBrand}
                                                    tableName={BRAND_TABLE}
                                                    title="Limpieza masiva de marcas"
                                                    description="Esta acción elimina todas las filas de marcas."
                                                    entityLabel="marcas"
                                                />
                                                <Button2Add label="Añadir Marca">
                                                    {(close) => (
                                                        <AddBrandModal
                                                            onAddBrand={async (newBrand: BrandFormData) => {
                                                                await handleAddBrand(newBrand);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Add>
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
                                                <Button2MassiveUpload
                                                    title="Subida masiva de tipos de producto"
                                                    description="Selecciona un archivo XLSX con la estructura de la hoja de tipos de producto."
                                                    tableName={TYPE_TABLE}
                                                    expectedHeaders={TYPE_UPLOAD_HEADERS}
                                                    columns={TYPE_UPLOAD_COLUMNS}
                                                    transformRows={transformTypeRows}
                                                    onSuccess={refetchType}
                                                />
                                                <Button2MassiveDownload
                                                    title="Descarga masiva de tipos de producto"
                                                    description="Exporta la lista de tipos de producto en XLSX o CSV."
                                                    items={type.map((item) => ({
                                                        nombre: item.nombre ?? "",
                                                        categoria: item.categoria ?? "",
                                                        marcas: (item.marcas_info ?? [])
                                                            .map((marca) => marca.nombre)
                                                            .filter(Boolean)
                                                            .join(", "),
                                                    }))}
                                                    columns={TYPE_EXPORT_COLUMNS}
                                                    defaultFileName="tipos-de-producto"
                                                />
                                                <Button2MassiveClean
                                                    currentCount={type.length}
                                                    onSuccess={refetchType}
                                                    tableName={TYPE_TABLE}
                                                    title="Limpieza masiva de tipos de producto"
                                                    description="Esta acción elimina todas las filas de tipos de producto."
                                                    entityLabel="tipos de producto"
                                                />
                                                <Button2Add label="Añadir Tipo de producto">
                                                    {(close) => (
                                                        <AddTypeModal
                                                            onAddType={async (newType: TypeFormData) => {
                                                                await handleAddType(newType);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Add>
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