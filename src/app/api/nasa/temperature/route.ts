import { NextRequest, NextResponse } from "next/server";

const NASA_BASE_URL = "https://power.larc.nasa.gov";

export async function GET(req: NextRequest) {
    try {
        // Coordenadas (por defecto 0.0, se sobrescribirán si vienen en query params)
        let longitude = 0.0;
        let latitude = 0.0;

        // Obtener la fecha reciente y posibles parámetros de coordenadas
        const { searchParams } = new URL(req.url);
        const longitudeParam = searchParams.get("longitude");
        const latitudeParam = searchParams.get("latitude");

        // Si el cliente envía lat/lon, úsalos y valídalos
        if (longitudeParam !== null && latitudeParam !== null) {
            const parsedLon = parseFloat(longitudeParam);
            const parsedLat = parseFloat(latitudeParam);
            if (Number.isNaN(parsedLon) || Number.isNaN(parsedLat)) {
                return NextResponse.json(
                    { error: "Parámetros de coordenadas inválidos" },
                    { status: 400 }
                );
            }
            longitude = parsedLon;
            latitude = parsedLat;
        }

        // Fecha (YYYYMMDD) por defecto hoy en zona Lima
        const dateFromRequest = searchParams.get("date");
        const date = dateFromRequest ?? new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Lima",
        }).format(new Date()).replace(/-/g, "");

        const start = searchParams.get("start") ?? date;
        const end = searchParams.get("end") ?? date;

        const url = new URL("/api/temporal/daily/point", NASA_BASE_URL);
        url.searchParams.set("parameters", "T2M");
        url.searchParams.set("community", "SB");
        url.searchParams.set("longitude", String(longitude));
        url.searchParams.set("latitude", String(latitude));
        url.searchParams.set("start", start);
        url.searchParams.set("end", end);
        url.searchParams.set("format", "JSON");

        console.log("[NASA POWER API] Requesting:", url.toString());

        const response = await fetch(url.toString(), { cache: "no-store" });

        if (!response.ok) {
            console.error("[NASA POWER API] Response not OK", response.status, response.statusText);
            return NextResponse.json(
                { error: "Error consultando NASA POWER" },
                { status: response.status }
            );
        }

        // Leer texto bruto para poder registrar respuestas no-JSON y ayudar al debug
        const raw = await response.text();
        let data;
        try {
            data = JSON.parse(raw);
        } catch (err) {
            console.error("[NASA POWER API] Failed to parse JSON from NASA:", raw.slice(0, 2000));
            return NextResponse.json(
                { error: "Respuesta inválida de NASA POWER" },
                { status: 502 }
            );
        }

        const t2mValues: Record<string, number> = data?.properties?.parameter?.T2M ?? {};

        if (!data || !data.properties || !data.properties.parameter || !data.properties.parameter.T2M) {
            console.error("[NASA POWER API] Missing T2M in response:", JSON.stringify({ header: data?.header, parameters: data?.parameters }).slice(0,2000));
            return NextResponse.json(
                { error: "NASA POWER no retornó datos de temperatura" },
                { status: 502 }
            );
        }

        return NextResponse.json({
            location: { longitude, latitude },
            range: { start, end },
            unit: data?.parameters?.T2M?.units ?? "C",
            source: data?.header?.sources?.[0] ?? "MERRA2",
            T2M: t2mValues,
        });
    } catch (error) {
        console.error("[NASA POWER API]", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
