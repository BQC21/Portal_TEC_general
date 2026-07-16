"use client"

import Button2Modal_brand from "@/features/view/components/Buttons/Proveedores/marcas/button2Add";
import Button2Modal_supplier from "@/features/view/components/Buttons/Proveedores/proveedores/button2Add";
import Button2Modal_type from "@/features/view/components/Buttons/Proveedores/tipo/button2Add";
import { PortalShell } from "@/features/view/components/Shells/PortalShell";
import BrandTable from "@/features/view/components/Tables/Proveedores/BrandTable";
import SupplierTable from "@/features/view/components/Tables/Proveedores/SupplierTable";
import TypeTable from "@/features/view/components/Tables/Proveedores/TypeTable";
import { useBrands, useBrandsMutations } from "@/features/view/hooks/services/useRealtimeMarcas";
import { useProveedores, useProveedoresMutations } from "@/features/view/hooks/services/useRealtimeProveedores";
import { useTypes, useTypesMutations } from "@/features/view/hooks/services/useRealtimeTipos";
import { Brand, BrandFormData } from "@/lib/types/supabase/brand.types";
import { Supplier, SupplierFormData } from "@/lib/types/supabase/supplier-types";
import { Type, TypeFormData } from "@/lib/types/supabase/type-types";

export default function ProveedoresPage() {
	const { supplier, refetch: refetchSupplier } = useProveedores();
	const { create: createSupplier, update: updateSupplier, remove: removeSupplier} = useProveedoresMutations();

    const { brand, refetch: refetchBrand } = useBrands();
	const { create: createBrand, update: updateBrand, remove: removeBrand} = useBrandsMutations();

    const { type, refetch: refetchType } = useTypes();
	const { create: createType, update: updateType, remove: removeType} = useTypesMutations();

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
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
						<h2 className="text-2xl font-semibold tracking-tight text-slate-800">Lista de proveedores</h2>

                        <div className="flex mb-5 w-full xl:justify-end">
							<Button2Modal_supplier onAddSupplier={handleAddSupplier} />
                        </div>

                        <SupplierTable
                            supplier={supplier}
                            totalSupplier={supplier.length}
                            onUpdateSupplier={handleUpdateSupplier}
                            onDeleteSupplier={handleDeleteSupplier}
                        />
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
						<h2 className="text-2xl font-semibold tracking-tight text-slate-800">Lista de marcas</h2>

                        <div className="flex mb-5 w-full xl:justify-end">
							<Button2Modal_brand onAddBrand={handleAddBrand} />
                        </div>

                        <BrandTable
                            brand={brand}
                            totalBrand={brand.length}
                            onUpdateBrand={handleUpdateBrand}
                            onDeleteBrand={handleDeleteBrand}
                        />
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
						<h2 className="text-2xl font-semibold tracking-tight text-slate-800">Lista de tipos de producto</h2>

                        <div className="flex mb-5 w-full xl:justify-end">
							<Button2Modal_type onAddType={handleAddType} />
                        </div>

                        <TypeTable
                            type={type}
                            totalType={type.length}
                            onUpdateType={handleUpdateType}
                            onDeleteType={handleDeleteType}
                        />
                    </section>
                </div>
            </main>
        </PortalShell>
    )
}