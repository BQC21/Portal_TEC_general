"use client"

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Zone, ZoneFormData, UseZoneMutationsResult, UseZoneResult } from "@/lib/types/zone-types"
import { getZones, createZone, updateZone, deleteZone  } from "@/features/services/zoneQueries"

const supabase = createClient();

export function useZone(): UseZoneResult {
	const [zones, setZones] = useState< Zone []>([]); // data
	const [loading, setLoading] = useState(true); // loading state
	const [error, setError] = useState<string | null>(null); // error state
	
	const fetchZones = useCallback(async()=>{
		try{
			setLoading(true);
			setError(null);
			const data = await getZones(); // Querie importada
			setZones(data);
		} catch (err){
			const message = err instanceof Error ? err.message : "Error al cargar las zonas";
			setError(message);
		} finally{
			setLoading(false);
		}
	}, []);
	
	useEffect(() => {
        void fetchZones();
    }, [fetchZones]);
    
    /* 
        previene colision de suscripciones
    */
    useEffect(() => {
        const channelName = `zones-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "zonas" },
                () => {
                    void fetchZones();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "zonas" },
                () => {
                    void fetchZones();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "zonas" },
                () => {
                    void fetchZones();
                }
            )
            .subscribe();

        // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
        return () => {
            void supabase.removeChannel(channel);
        };

    }, [fetchZones]);

    return {
        zones,
        loading,
        error,
        refetch: fetchZones,
    };
}

// Aplicar mutaciones a la lista de productos
export function useZoneMutations(): UseZoneMutationsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // crear productos
    const create = useCallback(async (zone: ZoneFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createZone(zone);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear la zona";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // actualizar producto
    const update = useCallback(async (id: string, zone: ZoneFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateZone(id, zone);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar la zona";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // eliminar producto
    const remove = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteZone(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar la zona";

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