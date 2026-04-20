"use client";

import { useState } from "react";
// import { SearchBar } from "@/features/components/SearchBar";
import { ProductFilters, type ProductFilterValues } from "@/features/components/Tables/ProductFilters";
import { ProductTable } from "@/features/components/Tables/ProductTable";
import Button2Modal from "@/features/components/Buttons/button2modal";
import { useProductMutations, useProducts } from "@/features/hooks/useRealtimeProducts";
import type { Product, ProductFormData } from "@/features/types/product-types";
import { useConverter } from "@/features/hooks/useConverter";

import { PortalShell } from "@/app/components/PortalShell";

export default function ProductsPage() {

    const { products, refetch } = useProducts();
    const { create, update, remove } = useProductMutations();
    const {
        exchangeRate,
        loading: exchangeRateLoading,
        error: exchangeRateError,
    } = useConverter("USD", "PEN");
    const [filters, setFilters] = useState<ProductFilterValues>({
        type: "",
        brand: "",
        supplier: "",
    });

    const filteredProducts = products.filter((product) => {
        const matchesType = !filters.type || product.type === filters.type;
        const matchesBrand = !filters.brand || product.brand === filters.brand;
        const matchesSupplier = !filters.supplier || product.supplier === filters.supplier;

        return matchesType && matchesBrand && matchesSupplier;
    });

    async function handleAddProduct(product: ProductFormData) {
        await create(product);
        await refetch();
    }

    async function handleUpdateProduct(updatedProduct: Product) {
        const { id, ...productData } = updatedProduct;
        await update(id, productData);
        await refetch();
    }

    async function handleDeleteProduct(productId: string) {
        await remove(productId);
        await refetch();
    }

    if (exchangeRateLoading) {
        return (
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <p className="text-lg text-slate-600">Cargando tasa de conversión...</p>
            </div>
        </main>
        );
    }

    if (exchangeRateError) {
        return (
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <p className="text-lg text-red-600">{exchangeRateError}</p>
            </div>
        </main>
        );
    }

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
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal
                        exchangeRate={exchangeRate}
                        nextProductRowNumber={products.length + 1}
                        onAddProduct={handleAddProduct}
                        />
                    </div>
                </section>

                <section className="panel">
                    <div className="space-y-6">
                        {/* <SearchBar 
                        value={searchTerm}
                        onChange={(newValue: string) => setSearchTerm(newValue)}
                        /> */}
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
                products={filteredProducts}
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