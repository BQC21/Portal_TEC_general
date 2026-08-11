import { createFinantial, deleteFinantial, 
    getFinantial, updateFinantial } from "@/features/controller/services/finanzasQueries";
import { createClient } from "@/lib/supabase/client";
import {
    Finantial,
    FinantialFormData,
    useFinantialMutationResult,
    useFinantialResult,
} from "@/lib/types/supabase/finantial-types";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useFinantials(): useFinantialResult {
    const [finantials, setFinantials] = useState<Finantial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 

    const fetchFinantials = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getFinantial();
            setFinantials(data);
        } catch (err) {
            const message = err instanceof Error ? err.message: "Error al cargar los análisis financieros";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchFinantials();
    }, [fetchFinantials]);

    /* 
        previene colision de suscripciones
    */
        useEffect(() => {
            const channelName = `quotes-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
            const channel = supabase
                .channel(channelName)
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "finanzas" },
                    () => {
                        void fetchFinantials();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "UPDATE", schema: "public", table: "finanzas" },
                    () => {
                        void fetchFinantials();
                    }
                )
                .on(
                    "postgres_changes",
                    { event: "DELETE", schema: "public", table: "finanzas" },
                    () => {
                        void fetchFinantials();
                    }
                )
                .subscribe();
    
            // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
            return () => {
                void supabase.removeChannel(channel);
            };
    
        }, [fetchFinantials]);

    return {
        finantials,
        loading,
        error,
        refetch: fetchFinantials
    };
}

export function useFinantialMutations(): useFinantialMutationResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // crear 
    const create = useCallback(async (finantial: FinantialFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createFinantial(finantial);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear el análisis financiero";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // actualizar 
    const update = useCallback(async (id: string, finantial: FinantialFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateFinantial(id, finantial);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar el análisis financiero";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // eliminar 
    const remove = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteFinantial(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar el análisis financiero";

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