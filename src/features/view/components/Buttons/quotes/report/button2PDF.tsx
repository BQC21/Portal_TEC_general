"use client";
import { useState } from "react";
import { useGenerateReportPdf } from "@/features/view/hooks/api/useGenerateReportPdf";
import { Button2PDFProps } from "@/lib/types/components/General/buttons";
import { DEFAULT_PAY_FORMAT } from "@/lib/utils/options";

export default function Button2PDF({ form, equipos, materiales, hiddenEquipoIds = [] }: Button2PDFProps) {
    const [requested, setRequested] = useState(false);
    const { loading, error, generate } = useGenerateReportPdf();

    async function handleGenerate() {
            setRequested(true);
            await generate({
                
                tipo: "report",

                // reporte
                cliente: form.cliente,
                ruc_dni: form.ruc_dni,
                fecha: form.fecha
                ? form.fecha.toISOString().slice(0, 10) // YYYY-MM-DD
                : undefined,
                lugar: form.lugar,
                atencion: form.atencion,
                porcentaje_eqmt: form.porcentaje_eqmt,
                porcentaje_inst: form.porcentaje_inst,
                precio_cotizacion:
                    form.precio_cotizacion || form.cotizacion_info?.precio_dolares,
                validez_oferta: form.validez_oferta,
                plazo_entrega: form.plazo_entrega,
                tasa_dscto: form.opcion_dscto === "CON DSCTO" ? form.tasa_dscto : 0,
                opcion_dscto: form.opcion_dscto,
                formato_dscto: form.formato_dscto,
                payFormat: form.payFormat || DEFAULT_PAY_FORMAT,
                cotizacion_id: form.cotizacion_id,
                cotizacion_info: form.cotizacion_info
                ? {
                    cod_cotizacion: form.cotizacion_info.cod_cotizacion,
                    precio_dolares: form.cotizacion_info.precio_dolares,
                    igv: form.cotizacion_info.igv,
                    tasa_cambio: form.cotizacion_info.tasa_cambio,
                    proyecto_info: {
                        nombre: form.cotizacion_info.proyecto_info?.nombre,
                    },
                    }
                : undefined,

                // equipos principales
                equipos: equipos.map((e) => ({
                cantidad: e.cantidad,
                visible: !hiddenEquipoIds.includes(String(e.id)),
                equipo_info: {
                    cod_producto: e.equipo_info?.cod_producto,
                    descripcion: e.equipo_info?.descripcion,
                    unidad: e.equipo_info?.unidad,
                    tipo_de_producto: e.equipo_info?.tipo_de_producto,
                    marca: e.equipo_info?.marca,
                },
                })),

                // materiales eléctricos
                materiales: materiales.map((m) => ({
                cantidad: m.cantidad,
                material_info: {
                    cod_producto: m.material_info?.cod_producto,
                    descripcion: m.material_info?.descripcion,
                    unidad: m.material_info?.unidad,
                    tipo_de_producto: m.material_info?.tipo_de_producto,
                },
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