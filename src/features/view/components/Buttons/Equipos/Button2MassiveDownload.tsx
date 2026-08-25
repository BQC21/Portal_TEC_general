"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadEquiposProps } from "@/lib/types/components/General/buttons";
import { EQUIPOS_EXPORT_COLUMNS } from "@/lib/utils/helpers/massive/massiveDownload";

export default function Button2MassiveDownload({ equipos }: Button2MassiveDownloadEquiposProps) {
	const [open, setOpen] = useState(false);

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
					title="Descarga masiva de equipos"
					description="Exporta el catálogo de equipos principales en XLSX o CSV."
					items={equipos}
					columns={EQUIPOS_EXPORT_COLUMNS}
					defaultFileName="equipos"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
