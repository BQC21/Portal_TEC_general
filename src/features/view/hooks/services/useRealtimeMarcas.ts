import { createMarca, deleteMarca, getMarcas, getMarcasbyId, updateMarca } from "@/features/controller/services/marcasQueries";
import { createClient } from "@/lib/supabase/client";
import { Brand, BrandFormData, UseBrandMutationsResult, UseBrandResult } from "@/lib/types/supabase/brand.types";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useBrands(): UseBrandResult {
    const [brand, setBrand] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMarcas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getMarcas();
            setBrand(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cargar las marcas";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchMarcas();
    }, [fetchMarcas]);

    useEffect(() => {
        const channelName = `marcas-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "marcas" },
                () => {
                    void fetchMarcas();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "marcas" },
                () => {
                    void fetchMarcas();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "marcas" },
                () => {
                    void fetchMarcas();
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        }
    }, [fetchMarcas]);

    return {
        brand,
        loading,
        error,
        refetch: fetchMarcas,
    };
}

export function useBrandsMutations(): UseBrandMutationsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createMarca(brand);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear la marca";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateMarca(id, brand);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar la marca";
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

            return await deleteMarca(id);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar la marca";
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

export async function getMarcaByIdService(id: string): Promise<Brand> {
    return getMarcasbyId(id);
}