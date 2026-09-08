"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadFinantialProps } from "@/lib/types/components/General/buttons";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { displayPayback } from "@/lib/utils/helpers/render/table_display_values";
import {
	FINANTIAL_EXPORT_COLUMNS,
	type FinantialExportRow,
} from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ finantials }: Button2MassiveDownloadFinantialProps) {
	const [open, setOpen] = useState(false);

	const items: FinantialExportRow[] = finantials.map((finantial) => ({
		cotizacion: finantial.cotizacion_info?.cod_cotizacion ?? "",
		proyecto: finantial.cotizacion_info?.proyecto_info?.nombre ?? "",
		planta: Number(finantial.planta) || 0,
		generacion: Number(finantial.generacion) || 0,
		tarifa_red: Number(finantial.tarifa_red) || 0,
		degra_1er: Number(finantial.degra_1er) || 0,
		degra_2do: Number(finantial.degra_2do) || 0,
		tarifa_crecimiento: Number(finantial.tarifa_crecimiento) || 0,
		tasa_descuento: Number(finantial.tasa_descuento) || 0,
		tiempo_retorno: displayPayback(finantial.tiempo_retorno),
		lcoe: finantial.lcoe ? `${finantial.lcoe} USD/MWh` : "",
		created_at: formatDate(finantial.created_at),
		updated_at: formatDate(finantial.updated_at),
	}));

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-brand-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
				title="Descarga masiva"
			>
				<MassiveDownloadIcon />
				<span>Descarga masiva</span>
			</button>

			{open && (
				<MassiveDownloadModal
					title="Descarga masiva de finanzas"
					description="Exporta la lista de análisis financieros en XLSX o CSV."
					items={items}
					columns={FINANTIAL_EXPORT_COLUMNS}
					defaultFileName="finanzas"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
