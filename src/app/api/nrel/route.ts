import { NextRequest, NextResponse } from "next/server";
import { NRELInfo } from "@/lib/types/nrel-types";

const NREL_BASE_URL = "https://developer.nrel.gov";
// const NREL_BASE_URL "https://developer.nlr.gov"; // desde el 29/5/2026

// Parámetros fijos de PVWatts (requeridos por la API)
const PVWATTS_DEFAULTS = {
    system_capacity: "1",
    module_type:     "0",
    losses:          "14",
    array_type:      "1",
    tilt:            "0", 
    azimuth:         "0",
    dataset:         "nsrdb", // diferirá un poco al de ATLAS (este de SOLARGIS dataset)
} as const;

export async function GET(req: NextRequest){
    try{
        // Obtener posibles parámetros de coordenadas
        const { searchParams } = new URL(req.url);
        const longitudeParam = searchParams.get("longitude");
        const latitudeParam = searchParams.get("latitude");
        
        // Validar que ambas coordenadas estén presentes
        if (longitudeParam === null || latitudeParam === null) {
            return NextResponse.json(
                { error: "Se requieren los parámetros latitude y longitude" },
                { status: 400 }
            );
        }    
        const parsedLon = parseFloat(longitudeParam);
        const parsedLat = parseFloat(latitudeParam);

        if (Number.isNaN(parsedLon) || Number.isNaN(parsedLat)) {
            return NextResponse.json(
                { error: "Parámetros de coordenadas inválidos" },
                { status: 400 }
            );
        }

        // Leer API key desde variable de entorno del servidor
        const apiKey = process.env.NREL_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "API key de NREL no configurada" },
                { status: 500 }
            );
        }

        const url = new URL("/api/pvwatts/v8.json", NREL_BASE_URL);
        url.searchParams.set("api_key",  apiKey);
        url.searchParams.set("lat",      String(parsedLat));
        url.searchParams.set("lon",      String(parsedLon));

        for (const [key, value] of Object.entries(PVWATTS_DEFAULTS)) {
            url.searchParams.set(key, value);
        }

        const response = await fetch(url.toString(), {cache: "no-store" });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Error consultando NREL: ${response.status}` },
                { status: response.status }
            );
        }

        const data = (await response.json()) as NRELInfo;
        
        // Validar errores en el body (NREL puede responder 200 con errores internos)
        if (data.errors && data.errors.length > 0) {
            return NextResponse.json(
                { error: data.errors.join(", ") },
                { status: 422 }
            );
        }
        
        // Extraer HSP (kWh/m²/day)
        const hsp = data.outputs.solrad_annual;

        return NextResponse.json({
            hsp,    // kWh/m²/day
        });

    } catch (error) {
        console.error("[NREL API]", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    } 
}