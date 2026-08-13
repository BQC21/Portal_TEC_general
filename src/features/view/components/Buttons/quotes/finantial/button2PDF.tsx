"use client";
import { useState } from "react";
import { useGenerateReportPdf } from "@/features/view/hooks/api/useGenerateReportPdf";
import { Button2PDFProps_FINANTIAL } from "@/lib/types/components/General/buttons";

export default function Button2PDF_FINANTIAL({
    form,
    analysis,
}: Button2PDFProps_FINANTIAL) {
    const [requested, setRequested] = useState(false);
    const { loading, error, generate } = useGenerateReportPdf();

    async function handleGenerate() {
        setRequested(true);
        await generate({
            tipo: "finantial",

            // ---- Parámetros de entrada ----
            planta: form.planta,
            generacion: form.generacion,
            tarifa_red: form.tarifa_red,
            degra_1er: form.degra_1er,
            degra_2do: form.degra_2do,
            tarifa_crecimiento: form.tarifa_crecimiento,
            tasa_descuento: form.tasa_descuento,

            // ---- Métricas calculadas ----
            capex: analysis.capex,
            opex: analysis.opex,
            tiempo_retorno: analysis.tiempo_retorno ?? form.tiempo_retorno,
            lcoe: analysis.lcoe === null ? form.lcoe : analysis.lcoe,
            van: analysis.van ?? undefined,
            capex_total: analysis.capex_total,
            om_total: analysis.om_total,
            energia_total: analysis.energia_total,
            beneficio_acumulado:
                analysis.flowRows.at(-1)?.flujo_acumulado ?? undefined,

            // ---- Cotización / proyecto ----
            cotizacion_id: form.cotizacion_id,
            cotizacion_info: form.cotizacion_info
                ? {
                      cod_cotizacion: form.cotizacion_info.cod_cotizacion,
                      precio_dolares: form.cotizacion_info.precio_dolares,
                      proyecto_info: {
                          nombre: form.cotizacion_info.proyecto_info?.nombre,
                      },
                  }
                : undefined,

            // ---- Tablas para el PDF ----
            flow_rows: analysis.flowRows.map((row) => ({
                year: row.year,
                equipamiento: row.equipamiento,
                tarifa_cliente: row.tarifa_cliente,
                om: row.om,
                energy_mwh: row.energy_mwh,
                ahorro: row.ahorro,
                flujo_total: row.flujo_total,
                flujo_acumulado: row.flujo_acumulado,
            })),
            energy_rows: analysis.energyRows.map((row) => ({
                year: row.year,
                energy_mwh: row.energy_mwh,
                degradation_pct: row.degradation_pct,
            })),
        });
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => void handleGenerate()}
                disabled={loading || !form.cotizacion_id}
                className="rounded-xl bg-red-500 text-white border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-red-300 disabled:opacity-50"
            >
                {loading ? "Generando PDF..." : "Generar PDF"}
            </button>

            {requested && error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
