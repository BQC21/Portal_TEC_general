"use client";

import { useState, useEffect } from "react"; 
import { NRELInfo } from "@/lib/types/nrel-types"; 

interface UseNasaGHIOptions {
    latitude?: string;
    longitude?: string;}

interface UseNasaGHIResult {
    ghi: number | null;       // kwh/m² 
    hsp: number | null;       // kwh/m²/day 
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useConverterNREL(options: UseNasaGHIOptions = {}): UseNasaGHIResult{
    const { latitude, longitude } = options;

    const [ghi, setGhi]       = useState<number | null>(null);
    const [hsp, setHsp]       = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    // Permite refetch manual desde la vista
    const refetch = () => setTrigger((n) => n + 1);

    useEffect(() =>{
        const load = async () => {
            try{
                setLoading(true);
                setError(null);

                // Validar y parsear coordenadas
                const latNum = latitude ? parseFloat(latitude) : null;
                const lonNum = longitude ? parseFloat(longitude) : null;
                
                if ((latitude && isNaN(latNum!)) || (longitude && isNaN(lonNum!))) {
                    throw new Error("Coordenadas inválidas");
                }

                // enlace con url
                const params = new URLSearchParams();
                params.set("api_key", process.env.NEXT_PUBLIC_NREL_API_KEY ?? "");
                params.set("lat", latitude!);
                params.set("lon", longitude!);
                params.set("dataset", "nsrdb");
                const res = await fetch(
                    `https://developer.nrel.gov/api/pvwatts/v8.json?${params.toString()}`,
                    // `https://developer.nlr.gov/api/pvwatts/v8.json`// desde el 29/5/2026
                );

                if (!res.ok) {
                    throw new Error(`Error consultando NREL: ${res.status}`);
                }

                const data = (await res.json()) as NRELInfo;

                // obtener hsp (kwh/m²/day) a partir de "data" 
                const hsp = data.outputs.solrad_annual;
                setHsp(hsp)

                // calcular ghi (hsp * 365 days)
                const ghi = hsp * 365
                setGhi(ghi)

            } catch (err) {
                const message = 
                    err instanceof Error 
                        ? err.message 
                        : "Error cargando NASA POWER";
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        // Solo llamar si hay coordenadas válidas
        if (latitude && longitude) {
            void load();
        }
    }, [latitude, longitude, trigger])

    return{
        ghi,
        hsp,
        loading,
        error,
        refetch
    }

}