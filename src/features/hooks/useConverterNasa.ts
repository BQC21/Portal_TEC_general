"use client";

import { useState, useEffect } from "react"; 
import { NasaInfo } from "@/lib/types/nasa-types"; 

/**
 * Estimación del GHI (Global Horizontal Irradiance) en W/m²
 * a partir de la temperatura a 2 metros (T2M en °C).
 *
 * Fórmula empírica simplificada (Hargreaves-Samani adaptada):
 *   GHI ≈ 0.16 × Ra × √(T2M + 273.15)
 * donde Ra (irradiancia extraterrestre) se asume constante (1361 W/m²)
 * para una estimación de primer orden.
 *
 * Para mayor precisión se recomienda incluir también ALLSKY_SFC_SW_DWN
 * como parámetro adicional en la API de NASA POWER.
 */

function estimateGHI(t2m: number): number {
    const Ra = 1361; // W/m² (constante solar)
    const ghi = 0.16 * Ra * Math.sqrt(Math.max(t2m + 273.15, 1)); // evitar sqrt negativo
    return parseFloat(ghi.toFixed(2));
}

interface UseNasaGHIOptions {
    latitude?: string;
    longitude?: string;
    date?: string; // formato YYYYMMDD
}

interface UseNasaGHIResult {
    ghi: number | null;       // W/m² estimado
    t2m: number | null;       // °C crudo de la API
    date: string;
    unit: string;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useConverterNasa(options: UseNasaGHIOptions = {}): UseNasaGHIResult{
    const { latitude, longitude, date } = options;

    const [ghi, setGhi]       = useState<number | null>(null);
    const [t2m, setT2m]       = useState<number | null>(null);
    const [date_, setDate]    = useState<string>("");
    const [unit, setUnit]     = useState<string>("C");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<number>(0);

    // Permite refetch manual desde la vista
    const refetch = () => setTrigger((n) => n + 1);

    useEffect(() => {
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

                // Construir query params opcionales
                const params = new URLSearchParams();
                if (latNum !== null)  params.set("latitude",  String(latNum));
                if (lonNum !== null) params.set("longitude", String(lonNum));
                if (date)      params.set("date",      date);

                const res = await fetch(
                    `/api/nasa/temperature?${params.toString()}`,
                    { cache: "no-store" }
                );

                if (!res.ok) {
                    throw new Error(`Error consultando NASA: ${res.status}`);
                }

                const data = (await res.json()) as NasaInfo;

                // Tomar la primera (y única) entrada de T2M del rango
                const t2mEntries = Object.entries(data.T2M);
                if (t2mEntries.length === 0) {
                    throw new Error("La API no retornó valores de T2M");
                }

                const [dateKey, t2mValue] = t2mEntries[0];

                // NASA usa -999 como código para "sin datos"
                if (typeof t2mValue !== "number" || isNaN(t2mValue) || t2mValue === -999) {
                    throw new Error("La API de NASA no retornó datos válidos para esta ubicación");
                }

                // Calcular GHI estimado
                const ghiValue = estimateGHI(t2mValue);

                setT2m(t2mValue);
                setGhi(ghiValue);
                setDate(dateKey);
                setUnit(data.unit ?? "C");
            }
            catch (err) {
                const message = 
                    err instanceof Error 
                        ? err.message 
                        : "Error cargando NASA POWER";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        // Solo llamar si hay coordenadas válidas
        if (latitude && longitude) {
            void load();
        }
    }, [latitude, longitude, date, trigger]);

    return{
        ghi,
        t2m,
        date: date_,
        unit,
        loading,
        error,
        refetch
    }
}