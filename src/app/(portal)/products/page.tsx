"use client";

import { useEffect, useMemo, useState } from "react";

import { ProductFilters } from "@/features/view/components/Tables/Products/ProductFilters";
import { ProductTable } from "@/features/view/components/Tables/Products/ProductTable";

import { Sorting_IGV_USD } from "@/features/view/components/Buttons/Products/SortingIGVUSD";
import Button2Modal from "@/features/view/components/Buttons/Products/button2modal";
import Button2MassiveDownload from "@/features/view/components/Buttons/Products/Button2MassiveDownload";

import { PortalShell } from "@/features/view/components/PortalShell";

import { useProducts, useProductMutations } from "@/features/view/hooks/useRealtimeProducts"; // Supabase
// import { useConverter } from "@/features/hooks/useConverterFrankfurter"; // API (browser)
import { useConverterSunat } from "@/features/view/hooks/api/useConverterSunat"; // API SUNAT

import type { Product, ProductFormData, ProductFilterValues } from "@/lib/types/product-types"; // Tipados

import type { ProductSortingOrder } from "@/lib/utils/options"; // Tipados

import { SearchBar } from "@/features/view/components/Bars/SearchBar"; // barra de busqueda
import { sortGroupedByCodeSupplier } from "@/lib/utils/helpers/renders";

export default function ProductsPage() {

    const { products, refetch } = useProducts(); // obtener la lista de proudctos
    const { create, update, remove } = useProductMutations(); // obtener funciones de mutación

    // Valores de respaldo locales
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

    // ---------------------------------
    // ---- Almacenamiento local --------
    // ---------------------------------   

    const [manualSellRate, setManualSellRate] = useState<string>(() => {
        if (typeof window === "undefined") return String(exchangeRate_respaldo);
        return window.localStorage.getItem("products.manualSellRate") ?? String(exchangeRate_respaldo);
    });

    const [manualBuyRate, setManualBuyRate] = useState<string>(() => {
        if (typeof window === "undefined") return String(exchangeRate_buy_respaldo);
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
    // ---- Ordenamiento de productos (segun codigo) --
    // ---------------------------------

    const sortedByCodeProducts = useMemo(() => {
        return sortGroupedByCodeSupplier(filteredProducts, "codigo");
    }, [filteredProducts]);


    // ---------------------------------
    // ---- Ordenamiento de productos (segun precio) --
    // ---------------------------------

    const [sorting, setSorting] = useState<ProductSortingOrder>(null); // estado para ordenar la lista de productos

    const sortedProducts = useMemo(() => {
        const productsToSort = [...sortedByCodeProducts]; // procura si la tabla ha sido filtrada o no

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
    }, [sortedByCodeProducts, sorting]); // lógica para asignar el tipo de ordenamiento de productos

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
                            No se pudo obtener el tipo de cambio desde SUNAT. Puedes ingresar valores manuales a partir de este enlace:
                        </p>
                        <a href="https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias"> 
                            https://e-consulta.sunat.gob.pe/cl-at-ittipcam/tcS01Alias
                        </a>
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

                <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div className="space-y-1">
                        <p className="text-lg text-slate-500">
                            Tasa de cambio actual (venta): S/. {tasaVenta.toFixed(3)} por dólar
                        </p>
                        <p className="text-lg text-slate-500">
                            Tasa de cambio actual (compra): S/. {tasaCompra.toFixed(3)} por dólar
                        </p>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(280px,1.7fr)_minmax(180px,1fr)_minmax(170px,1fr)_minmax(220px,1fr)] xl:items-end">
                        <div className="w-full">
                            <SearchBar 
                                value={searchDescription}
                                onChange={setSearchDescription}
                                placeholder="Buscar por descripción del producto..."
                            />
                        </div>

                        <div className="flex w-full xl:justify-end">
                            <Sorting_IGV_USD
                                value={sorting}
                                onSortingChange={setSorting}
                            />
                        </div>

                        <div className="flex w-full xl:justify-end">
                            <Button2Modal
                                exchangeRate={tasaVenta}
                                existingProducts={sortedProducts}
                                onAddProduct={handleAddProduct}
                            />
                        </div>

                        <div className="flex w-full xl:justify-end">
                            <Button2MassiveDownload
                                productsToDownload={sortedProducts}
                                exchangeRate={tasaVenta}
                                defaultFileName="BaseDatos_productos_TEC"
                            />
                        </div>
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