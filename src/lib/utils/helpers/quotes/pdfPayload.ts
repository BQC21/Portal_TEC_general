import { FinantialAnalysis } from "@/lib/types/components/Quotes/finantial_analysis";
import { FinantialPdfPayload } from "@/lib/types/components/Python_components/FinantialPdfPayload";
import { ReportPdfPayload } from "@/lib/types/components/Python_components/ReportPdfPayload";
import { FinantialFormState } from "@/lib/types/supabase/finantial-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { quoteAssociatedLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { DEFAULT_PAY_FORMAT } from "@/lib/utils/options";

export function buildReportPdfPayload({
	form,
	equipos,
	materiales,
	hiddenEquipoIds = [],
	hiddenMOIds = [],
}: {
	form: ReportFormState;
	equipos: Project_Equipos[];
	materiales: Project_Materiales[];
	hiddenEquipoIds?: string[];
	hiddenMOIds?: string[];
}): ReportPdfPayload {
	return {
		tipo: "report",
		cliente: form.cliente,
		ruc_dni: form.ruc_dni,
		fecha: form.fecha ? form.fecha.toISOString().slice(0, 10) : undefined,
		lugar: form.lugar,
		atencion: form.atencion,
		porcentaje_eqmt: form.porcentaje_eqmt,
		porcentaje_inst: form.porcentaje_inst,
		precio_cotizacion: form.precio_cotizacion || form.cotizacion_info?.precio_dolares,
		validez_oferta: form.validez_oferta,
		plazo_entrega: form.plazo_entrega,
		tasa_dscto: form.opcion_dscto === "CON DSCTO" ? form.tasa_dscto : 0,
		opcion_dscto: form.opcion_dscto,
		formato_dscto: form.formato_dscto,
		payFormat: form.payFormat || DEFAULT_PAY_FORMAT,
		opcion_firma: form.opcion_firma,
		cotizacion_id: form.cotizacion_id,
		cotizacion_info: form.cotizacion_info
			? {
					cod_cotizacion: form.cotizacion_info.cod_cotizacion,
					precio_dolares: form.cotizacion_info.precio_dolares,
					igv: form.cotizacion_info.igv,
					tasa_cambio: form.cotizacion_info.tasa_cambio,
					proyecto_info: {
						nombre: quoteAssociatedLabel(form.cotizacion_info),
					},
				}
			: undefined,
		equipos: equipos.map((e) => ({
			cantidad: Math.ceil(Number(e.cantidad)),
			visible: !hiddenEquipoIds.includes(String(e.id)),
			equipo_info: {
				cod_producto: e.equipo_info?.cod_producto,
				descripcion: e.equipo_info?.descripcion,
				unidad: e.equipo_info?.unidad,
				tipo_de_producto: e.equipo_info?.tipo_de_producto,
				marca: e.equipo_info?.marca,
			},
		})),
		materiales: materiales.map((m) => ({
			cantidad: m.cantidad,
			material_info: {
				cod_producto: m.material_info?.cod_producto,
				descripcion: m.material_info?.descripcion,
				unidad: m.material_info?.unidad,
				tipo_de_producto: m.material_info?.tipo_de_producto,
			},
		})),
		hidden_mo_ids: hiddenMOIds,
	};
}

export function buildFinantialPdfPayload({
	form,
	analysis,
}: {
	form: FinantialFormState;
	analysis: FinantialAnalysis;
}): FinantialPdfPayload {
	return {
		tipo: "finantial",
		planta: form.planta,
		generacion: form.generacion,
		tarifa_red: form.tarifa_red,
		degra_1er: form.degra_1er,
		degra_2do: form.degra_2do,
		tarifa_crecimiento: form.tarifa_crecimiento,
		tasa_descuento: form.tasa_descuento,
		capex: analysis.capex,
		opex: analysis.opex,
		tiempo_retorno: analysis.tiempo_retorno ?? form.tiempo_retorno,
		lcoe: analysis.lcoe === null ? form.lcoe : analysis.lcoe,
		van: analysis.van ?? undefined,
		capex_total: analysis.capex_total,
		om_total: analysis.om_total,
		energia_total: analysis.energia_total,
		beneficio_acumulado: analysis.flowRows.at(-1)?.flujo_acumulado ?? undefined,
		cotizacion_id: form.cotizacion_id,
		cotizacion_info: form.cotizacion_info
			? {
					cod_cotizacion: form.cotizacion_info.cod_cotizacion,
					precio_dolares: form.cotizacion_info.precio_dolares,
					proyecto_info: {
						nombre: quoteAssociatedLabel(form.cotizacion_info),
					},
				}
			: undefined,
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
	};
}
