"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductFilters } from "@/features/components/Tables/ProductFilters";
import { ProductTable } from "@/features/components/Tables/ProductTable";
import { Sorting_IGV_USD } from "@/features/components/Tables/SortingIGVUSD";
import Button2Modal from "@/features/components/Buttons/button2modal";
import { PortalShell } from "@/app/components/PortalShell";

import { useProducts, useProductMutations } from "@/features/hooks/useRealtimeProducts"; // Supabase
// import { useConverter } from "@/features/hooks/useConverterFrankfurter"; // API (browser)
import { useConverterSunat } from "@/features/hooks/useConverterSunat"; // API SUNAT

import type { Product, ProductFormData, ProductFilterValues } from "@/lib/types/product-types"; // Tipados

import type { ProductSortingOrder } from "@/lib/utils/options"; // Tipados

import { SearchBar } from "@/features/components/Tables/SearchBar"; // barra de busqeuda

import { AddProductTextField } from "@/features/components/Form_fields/AddProductTextField";

export default function ProductsPage() {

    const { products, refetch } = useProducts(); // obtener la lista de proudctos
    const { create, update, remove } = useProductMutations(); // obtener funciones de mutación

    const exchangeRate_buy_respaldo = 3.501;
    const exchangeRate_respaldo = 3.388;

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
        buyPrice: exchangeRate_buy,
        sellPrice: exchangeRate, // venta
        loading: exchangeRateLoading,
        error: exchangeRateError,
    } = useConverterSunat(); // convertir moneda (SUNAT)

    const [manualSellRate, setManualSellRate] = useState<string>(() => {
        if (typeof window === "undefined") {
            return String(exchangeRate_respaldo);
        }

        return window.localStorage.getItem("products.manualSellRate") ?? String(exchangeRate_respaldo);
    });

    const [manualBuyRate, setManualBuyRate] = useState<string>(() => {
        if (typeof window === "undefined") {
            return String(exchangeRate_buy_respaldo);
        }

        return window.localStorage.getItem("products.manualBuyRate") ?? String(exchangeRate_buy_respaldo);
    });

    useEffect(() => {
        window.localStorage.setItem("products.manualSellRate", manualSellRate);
        window.localStorage.setItem("products.manualBuyRate", manualBuyRate);
    }, [manualBuyRate, manualSellRate]);

    // ---------------------------------
    // ---- Filtrado de productos ------
    // ---------------------------------

    const [searchDescription, setSearchDescription] = useState<string>(""); // barra de búsqueda para filtrar por descripción

    const [filters, setFilters] = useState<ProductFilterValues>({
        type: "",
        brand: "",
        supplier: "",
    }); // estado para filtrar la lista de productos

    const filteredProducts = products.filter((product) => {
        const matchesType = !filters.type || product.tipo === filters.type;
        const matchesBrand = !filters.brand || product.marca === filters.brand;
        const matchesSupplier = !filters.supplier || product.proveedor === filters.supplier;
        const matchesDescription = !searchDescription || product.descripcion.toLowerCase().includes(searchDescription.toLowerCase());
        
        return matchesType && matchesBrand && matchesSupplier && matchesDescription;
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

    const parsedManualSellRate = Number(manualSellRate);
    const parsedManualBuyRate = Number(manualBuyRate);

    const tasaVenta = exchangeRateError
        ? (Number.isFinite(parsedManualSellRate) && parsedManualSellRate > 0 ? parsedManualSellRate : exchangeRate_respaldo)
        : (Number.isFinite(exchangeRate) && exchangeRate > 0 ? exchangeRate : exchangeRate_respaldo);

    const tasaCompra = exchangeRateError
        ? (Number.isFinite(parsedManualBuyRate) && parsedManualBuyRate > 0 ? parsedManualBuyRate : exchangeRate_buy_respaldo)
        : (Number.isFinite(exchangeRate_buy) && exchangeRate_buy > 0 ? exchangeRate_buy : exchangeRate_buy_respaldo);

    if (exchangeRateLoading) {
        return (
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <p className="text-lg text-slate-600">Cargando tasa de conversión...</p>
            </div>
        </main>
        );
    } // en caso se esté cargando la tasa de conversión
    // if (exchangeRateError) {
    //     return (
    //     <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
    //         <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
    //         <p className="text-lg text-red-600">{exchangeRateError}</p>
    //         </div>
    //     </main>
    //     );
    // } // en caso no haya conexión exitosa con la API

    return (
        <PortalShell
            title="Base de datos de los equipos y materiales eléctricos"
            subtitle="Gestión de inventario de productos para energía solar fotovoltaica"
            activePath="/products"
        >
        <main className="min-h-screen bg-[var(--page-bg)] text-[var(--foreground)]">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                {exchangeRateError && (
                    <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
                        <p className="text-base font-semibold">
                            No se pudo obtener el tipo de cambio desde SUNAT. Puedes ingresar valores manuales y se guardarán en este navegador.
                        </p>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm font-medium">
                                Tasa de compra manual
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    value={manualBuyRate}
                                    onChange={(event) => setManualBuyRate(event.target.value)}
                                    className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm font-medium">
                                Tasa de venta manual
                                <input
                                    type="number"
                                    step="0.001"
                                    min="0"
                                    value={manualSellRate}
                                    onChange={(event) => setManualSellRate(event.target.value)}
                                    className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500"
                                />
                            </label>
                        </div>
                    </section>
                )}

                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1">
                        <p className="text-lg text-slate-500">
                            Tasa de cambio actual (venta): S/. {exchangeRate.toFixed(3)} por dólar
                        </p>
                        <p className="text-lg text-slate-500">
                            Tasa de cambio actual (compra): S/. {exchangeRate_buy.toFixed(3)} por dólar
                        </p>
                    </div>                           

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <SearchBar 
                            value={searchDescription}
                            onChange={setSearchDescription}
                            placeholder="Buscar por descripción del producto..."
                        />
                    </div>                 

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Sorting_IGV_USD
                        value={sorting}
                        onSortingChange={setSorting}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button2Modal
                        exchangeRate={tasaVenta}
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
                    exchangeRate={tasaVenta}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            </div>
        </main>

        </PortalShell>
    );
}