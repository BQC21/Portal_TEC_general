import { NextRequest, NextResponse } from "next/server";

const PYTHON_PDF_URL =
    process.env.PYTHON_PDF_URL ?? "http://127.0.0.1:8000/api/reports/pdf";

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();

        const response = await fetch(PYTHON_PDF_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            const detail = await response.text();
            return NextResponse.json(
            { error: "Error generando PDF en el servidor Python", detail },
            { status: response.status },
            );
        }

        const pdfBuffer = await response.arrayBuffer();
        const defaultFilename = 
            body?.tipo === "finantial" 
                ? "analisis_financiero.pdf" 
                : "cotizacion.pdf";
        const contentDisposition =
            response.headers.get("Content-Disposition") ??
            `attachment; filename="${defaultFilename}"`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": contentDisposition,
            },
        });
    } catch {
        return NextResponse.json(
            { error: "No se pudo conectar con el servidor Python (¿está en :8000? 🤨)" },
            { status: 500 },
        );
    }
}