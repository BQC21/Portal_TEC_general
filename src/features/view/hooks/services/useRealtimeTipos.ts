import { createType, deleteType, getTypeById, getTypes, updateType } from "@/features/controller/services/typeQueries";
import { createClient } from "@/lib/supabase/client";
import { Type, TypeFormData, UseTypeMutationsResult, UseTypeResult } from "@/lib/types/supabase/type-types";
import { useEffect, useState } from "react";

import { useCallback } from "react";

const supabase = createClient();

export function useTypes(): UseTypeResult {
    const [type, setType] = useState<Type[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getTypes();
            setType(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al cargar los tipos";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchTypes();
    }, [fetchTypes]);

    useEffect(() => {
        const channelName = `types-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes", { event: "INSERT", schema: "public", table: "tipos" },
                () => {
                    void fetchTypes();
                }
            )
            .on(
                "postgres_changes", { event: "UPDATE", schema: "public", table: "tipos" },
                () => {
                    void fetchTypes();
                }
            )
            .on(
                "postgres_changes", { event: "DELETE", schema: "public", table: "tipos" },
                () => {
                    void fetchTypes();
                }
            )
            .subscribe();

        return () => {
            void supabase.removeChannel(channel);
        }
    }, [fetchTypes]);

    return {
        type,
        loading,
        error,
        refetch: fetchTypes,
    };
}

export function useTypesMutations(): UseTypeMutationsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (type: TypeFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createType(type);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al crear el tipo";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (id: string, type: TypeFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateType(id, type);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al actualizar el tipo";
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

            return await deleteType(id);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar el tipo";
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

export async function getTypeByIdService(id: string): Promise<Type> {
    return getTypeById(id);
}