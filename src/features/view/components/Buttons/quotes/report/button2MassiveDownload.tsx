"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadReportProps } from "@/lib/types/components/General/buttons";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { formatCurrency } from "@/lib/utils/normalization";
import { REPORT_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ reports }: Button2MassiveDownloadReportProps) {
	const [open, setOpen] = useState(false);

	const items = reports.map((report) => ({
		cotizacion: report.cotizacion_info?.cod_cotizacion ?? "",
		proyecto: report.cotizacion_info?.proyecto_info?.nombre ?? "",
		cliente: report.cliente ?? "",
		porcentaje_eqmt: report.porcentaje_eqmt ?? "",
		porcentaje_inst: report.porcentaje_inst ?? "",
		precio_cotizacion: formatCurrency(Number(report.cotizacion_info?.precio_dolares), "USD"),
		created_at: formatDate(report.created_at),
		updated_at: formatDate(report.updated_at),
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
					title="Descarga masiva de reportes"
					description="Exporta la lista de reportes en XLSX o CSV."
					items={items}
					columns={REPORT_EXPORT_COLUMNS}
					defaultFileName="reportes"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
