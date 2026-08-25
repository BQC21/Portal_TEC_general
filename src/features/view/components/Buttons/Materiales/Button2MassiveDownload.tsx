"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadMaterialesProps } from "@/lib/types/components/General/buttons";
import { MATERIALES_EXPORT_COLUMNS } from "@/lib/utils/helpers/massive/massiveDownload";

export default function Button2MassiveDownload({ materiales }: Button2MassiveDownloadMaterialesProps) {
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
					title="Descarga masiva de materiales"
					description="Exporta el catálogo de materiales eléctricos en XLSX o CSV."
					items={materiales}
					columns={MATERIALES_EXPORT_COLUMNS}
					defaultFileName="materiales"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
