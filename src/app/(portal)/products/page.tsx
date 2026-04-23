"use client";

import { useMemo, useState } from "react";

import { ProductFilters } from "@/features/components/Tables/ProductFilters";
import { ProductTable } from "@/features/components/Tables/ProductTable";
import { Sorting_IGV_USD } from "@/features/components/Tables/SortingIGVUSD";
import Button2MassiveUpload from "@/features/components/Buttons/Button2MassiveUpload";
import Button2Modal from "@/features/components/Buttons/button2modal";
import { PortalShell } from "@/app/components/PortalShell";

import { useProductMutations, useProducts } from "@/features/hooks/useRealtimeProducts"; // Supabase
// import { useConverter } from "@/features/hooks/useConverterFrankfurter"; // API (browser)
import { useConverterSunat } from "@/features/hooks/useConverterSunat"; // API SUNAT

import type { Product, ProductFormData, 
    ProductSortingOrder, ProductFilterValues 
} from "@/lib/types/product-types"; // Tipados

export default function ProductsPage() {

    const { products, refetch } = useProducts(); // obtener la lista de proudctos
    const { create, createBulk, update, remove } = useProductMutations(); // poder hacer mutaciones a la lista
    const [isMassiveUploading, setIsMassiveUploading] = useState(false);
    const [massiveUploadSummary, setMassiveUploadSummary] = useState<{
        inserted: number;
        failed: number;
        message: string;
        isError: boolean;
    } | null>(null);

    // ---------------------------------
    // ---- Llamada de API -------------
    // ---------------------------------
    
    {/*}
    const {
        exchangeRate,
        loading: exchangeRateLoading,
        error: exchangeRateError,
    } = useConverter("USD", "PEN"); // convertir moneda (FRANKFURTER)
    */}

    const {
        sellPrice: exchangeRate,
        loading: exchangeRateLoading,
        error: exchangeRateError,
    } = useConverterSunat(); // convertir moneda (SUNAT)

    // ---------------------------------
    // ---- Filtrado de productos ------
    // ---------------------------------

    const [filters, setFilters] = useState<ProductFilterValues>({
        type: "",
        brand: "",
        supplier: "",
    }); // estado para filtrar la lista de productos

    const filteredProducts = products.filter((product) => {
        const matchesType = !filters.type || product.type === filters.type;
        const matchesBrand = !filters.brand || product.brand === filters.brand;
        const matchesSupplier = !filters.supplier || product.supplier === filters.supplier;

        return matchesType && matchesBrand && matchesSupplier;
    }); // lógica para operar el filtrado de productos


    // ---------------------------------
    // ---- Ordenamiento de productos --
    // ---------------------------------

    const [sorting, setSorting] = useState<ProductSortingOrder>(null); // estado para ordenar la lista de productos

    const sortedProducts = useMemo(() => {
        const productsToSort = [...filteredProducts]; // procura si la tabla ha sido filtrada o no

        if (!sorting) {
            return productsToSort;
        }

        return productsToSort.sort((leftProduct, rightProduct) => {
            const leftPrice = Number(leftProduct.precio_dolares_igv ?? 0); // precio del row anterior
            const rightPrice = Number(rightProduct.precio_dolares_igv ?? 0); // precio del row posterior

            return sorting === "asc"
                ? leftPrice - rightPrice // ascendente
                : rightPrice - leftPrice; // descendente
        });
    }, [filteredProducts, sorting]); // lógica para asignar el tipo de ordenamiento de productos

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    async function handleMassiveAddProduct(batchProducts: ProductFormData[]) {
        if (batchProducts.length === 0) {
            setMassiveUploadSummary({
                inserted: 0,
                failed: 0,
                message: "No se encontraron productos para importar.",
                isError: true,
            });
            return;
        }

        setIsMassiveUploading(true);
        setMassiveUploadSummary(null);

        try {
            const result = await createBulk(batchProducts);

            await refetch();

            setMassiveUploadSummary({
                inserted: result.inserted,
                failed: result.failed,
                message:
                    result.failed > 0
                        ? `Subida masiva finalizada: ${result.inserted} productos insertados y ${result.failed} fallidos.`
                        : `Subida masiva finalizada: ${result.inserted} productos insertados.`,
                isError: result.failed > 0,
            });
        } catch {
            setMassiveUploadSummary({
                inserted: 0,
                failed: batchProducts.length,
                message: "No se pudo completar la subida masiva. Intenta nuevamente.",
                isError: true,
            });
        } finally {
            setIsMassiveUploading(false);
        }
    } // añadidura masiva de productos
    async function handleAddProduct(product: ProductFormData) {
        await create(product);
        await refetch();
    } // añadir producto
    async function handleUpdateProduct(updatedProduct: Product) {
        const { id, ...productData } = updatedProduct;
        await update(id, productData);
        await refetch();
    } // actualizar producto
    async function handleDeleteProduct(productId: string) {
        await remove(productId);
        await refetch();
    } // remover producto

    // ---------------------------------
    // ---- Renderizado condicional ----
    // ---------------------------------

    if (exchangeRateLoading) {
        return (
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <p className="text-lg text-slate-600">Cargando tasa de conversión...</p>
            </div>
        </main>
        );
    } // en caso se esté cargando la tasa de conversión
    if (exchangeRateError) {
        return (
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <p className="text-lg text-red-600">{exchangeRateError}</p>
            </div>
        </main>
        );
    } // en caso no haya conexión exitosa con la API

    return (
        <PortalShell
            title="Base de Productos"
            subtitle="Gestión de inventario de productos para energía solar fotovoltaica"
            activePath="/products"
        >
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                        <p className="text-lg text-slate-500">
                        Tasa de cambio actual: S/. {exchangeRate.toFixed(2)} por dólar
                        </p>
                        {isMassiveUploading ? (
                        <p className="text-sm text-blue-700">Procesando subida masiva...</p>
                        ) : null}
                        {massiveUploadSummary ? (
                        <p
                            className={`text-sm ${
                            massiveUploadSummary.isError ? "text-amber-700" : "text-emerald-700"
                            }`}
                        >
                            {massiveUploadSummary.message}
                        </p>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Sorting_IGV_USD
                        value={sorting}
                        onSortingChange={setSorting}
                        />
                    </div>

                    {/* añadir subida masiva*/}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2MassiveUpload
                        onMassiveAddProduct={handleMassiveAddProduct}
                        isMassiveUploading={isMassiveUploading}
                        />
                    </div>                    

                    {/* añadir limpieza masiva*/}


                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal
                        exchangeRate={exchangeRate}
                        existingProducts={products}
                        onAddProduct={handleAddProduct}
                        />
                    </div>
                </section>

                <section className="panel">
                    <div className="space-y-6">
                        <ProductFilters
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

                <ProductTable 
                products={sortedProducts}
                totalProducts={products.length}
                exchangeRate={exchangeRate}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                />
            </div>
        </main>

        </PortalShell>
    );
}