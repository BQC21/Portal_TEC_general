"use client";

import { useCallback, useEffect, useState } from "react";

import {
    createProduct,
    deleteProduct,
    getProducts,
    getProductFilterOptions,
    updateProduct,
} from "@/features/services/productQueries";
import type { 
    Product,
    ProductFormData,
    ProductFilterOptions,
    UseProductMutationsResult,
    UseProductsResult,
} from "@/features/types/product-types";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useProducts(): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            const message =
            err instanceof Error ? err.message : "Error al cargar los productos";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const channelName = `products-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; // previene colision de suscripciones
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "productos" },
                () => {
                    void fetchProducts();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "productos" },
                () => {
                    void fetchProducts();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "productos" },
                () => {
                    void fetchProducts();
                }
            )
            .subscribe();

        // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
        return () => {
            void supabase.removeChannel(channel);
        };

    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
}

export function useProductFilterOptions() {
    const [options, setOptions] = useState<ProductFilterOptions>({
        types: [],
        brands: [],
        suppliers: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProductFilterOptions();
            setOptions(data);
        } catch (err) {
            const message =
            err instanceof Error ? err.message : "Error al cargar las opciones de filtro";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchOptions();
    }, [fetchOptions]);

    return {
        options,
        loading,
        error,
        refetch: fetchOptions,
    };
}

export function useProductMutations(): UseProductMutationsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (product: ProductFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createProduct(product);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear el producto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, product: ProductFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateProduct(id, product);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar el producto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const remove = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteProduct(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar el producto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        create,
        update,
        remove,
    };
}