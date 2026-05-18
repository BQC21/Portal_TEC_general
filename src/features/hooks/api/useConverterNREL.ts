"use client";

import { useState, useEffect } from "react"; 
interface NRELRouteResponse {
    hsp: number;
    error?: string;
}

interface UseConverterNRELOptions {
    latitude?: string;
    longitude?: string;
}

interface UseConverterNRELResult {
    ghi:     number | null;   // kWh/m²/año
    hsp:     number | null;   // kWh/m²/día
    loading: boolean;
    error:   string | null;
    refetch: () => void;
}

export function useConverterNREL(options: UseConverterNRELOptions = {}): UseConverterNRELResult{
    const { latitude, longitude } = options;

    const [ghi,     setGhi]     = useState<number | null>(null);
    const [hsp,     setHsp]     = useState<number | null>(null);
    const [loading, setLoading] = useState(false); // false hasta que haya coordenadas
    const [error,   setError]   = useState<string | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    // Permite refetch manual desde la vista
    const refetch = () => setTrigger((n) => n + 1);

    useEffect(() =>{
        // No ejecutar si no hay coordenadas
        if (!latitude || !longitude) {
            setGhi(null);
            setHsp(null);
            setError(null);
            setLoading(false);
            return;
        }

        // Validar que sean números antes de llamar al servidor
        const latNum = parseFloat(latitude);
        const lonNum = parseFloat(longitude);

        if (isNaN(latNum) || isNaN(lonNum)) {
            setError("Coordenadas inválidas");
            return;
        }

        const load = async () => {
            try{
                setLoading(true);
                setError(null);

                // Llamar al route handler interno
                const params = new URLSearchParams();
                params.set("latitude",  String(latNum));
                params.set("longitude", String(lonNum));
                
                const res = await fetch(`/api/nrel?${params.toString()}`);
                // const res = await fetch(`/api/nlr?${params.toString()}`); 
                // desde el 29/5/2026 el route handler ya apunta a developer.nlr.gov

                const data = (await res.json()) as NRELRouteResponse;

                if (!res.ok || data.error) {
                    throw new Error(data.error ?? `Error del servidor: ${res.status}`);
                }

                // obtener hsp (kwh/m²/day) a partir de "data" 
                const hspValue = data.hsp;
                setHsp(hspValue)

                // calcular ghi (hsp * 365 days)
                const ghiValue = parseFloat((hspValue * 365).toFixed(2));
                setGhi(ghiValue)

            } catch (err) {
                const message = 
                    err instanceof Error 
                        ? err.message 
                        : "Error cargando NASA POWER";
                setError(message);
                setHsp(null);
                setGhi(null);
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [latitude, longitude, trigger])

    return{
        ghi,
        hsp,
        loading,
        error,
        refetch
    }

}