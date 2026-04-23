import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dateFromRequest = searchParams.get("date");
        // condiciona a la fecha actual de Lima, Perú
        const date = dateFromRequest ?? new Intl.DateTimeFormat("en-CA", {
            timeZone: "America/Lima",
        }).format(new Date());

        const url = `https://api.decolecta.com/v1/tipo-cambio/sunat?date=${date}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.SUNAT_API_TOKEN}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Error consultando la API de SUNAT" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
