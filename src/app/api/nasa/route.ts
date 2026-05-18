import { 
    NextRequest, 
    NextResponse } from "next/server";

const NASA_BASE_URL = "https://power.larc.nasa.gov";

export async function GET(req: NextRequest){
    try {
        // Coordenadas (por defecto 0.0, se sobrescribirán si vienen en query params)
        let longitude = 0.0; // recibir de la base de datos de ZONAS o del formulario
        let latitude = 0.0;  // recibir de la base de datos de ZONAS o del formulario

        // Obtener la fecha reciente y posibles parámetros de coordenadas
        const { searchParams } = new URL(req.url);
        const longitudeParam = searchParams.get("longitude");
        const latitudeParam = searchParams.get("latitude");

        // Si el cliente (el formulario de proyectos) envía lat/lon, úsalos y valídalos
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
        const dateFromRequest = searchParams.get("date");
        const date = dateFromRequest ?? new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Lima",
        }).format(new Date()).replace(/-/g, ""); // → "20260518"       

        // Rango: se acepta ?start=...&end=... o se usa la misma fecha para ambos
        const start = searchParams.get("start") ?? date;
        const end   = searchParams.get("end")   ?? date;

        // Construcción de la URL hacia NASA POWER
        const url = new URL("/api/temporal/daily/point", NASA_BASE_URL);
        url.searchParams.set("parameters", "T2M");
        url.searchParams.set("community",  "SB");
        url.searchParams.set("longitude",  String(longitude));
        url.searchParams.set("latitude",   String(latitude));
        url.searchParams.set("start",      start);
        url.searchParams.set("end",        end);
        url.searchParams.set("format",     "JSON");

        // Petición al servidor de NASA (server-side, sin restricciones CORS)
        const response = await fetch(url.toString(), {
            cache: "no-store", // siempre datos frescos
        });

        // en caso no se establezca una conexión exitosa con la API de SUNAT
        if (!response.ok) {
            return NextResponse.json(
                { error: "Error consultando la API de SUNAT" },
                { status: response.status }
            );
        }

        // recolectar dataset 
        const data = await response.json();

        // Extraer solo los valores de T2M para simplificar la respuesta al cliente
        const t2mValues: Record<string, number> =
            data?.properties?.parameter?.T2M ?? {};

        return NextResponse.json({
            location: { longitude, latitude },
            range:    { start, end },
            unit:     data?.parameters?.T2M?.units ?? "C",
            source:   data?.header?.sources?.[0]   ?? "MERRA2",
            T2M:      t2mValues,
        });

    } catch(error) {
        console.error("[NASA POWER API]", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}