"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadZoneProps } from "@/lib/types/components/General/buttons";
import { ZONE_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ zones }: Button2MassiveDownloadZoneProps) {
	const [open, setOpen] = useState(false);

	const items = zones.map((zone) => ({
		zona: zone.zona ?? "",
		latitude: zone.latitude ?? "",
		longitude: zone.longitude ?? "",
		gti_respaldo: zone.gti_respaldo ?? "",
		gti_respaldo_diario: zone.gti_respaldo_diario ?? "",
		ghi_respaldo: zone.ghi_respaldo ?? "",
		ghi_respaldo_diario: zone.ghi_respaldo_diario ?? "",
		hsp_peor_mes: zone.hsp_peor_mes ?? "",
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
					title="Descarga masiva de zonas"
					description="Exporta la lista de zonas en XLSX o CSV."
					items={items}
					columns={ZONE_EXPORT_COLUMNS}
					defaultFileName="zonas"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
