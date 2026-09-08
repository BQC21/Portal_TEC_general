"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadBrandProps } from "@/lib/types/components/General/buttons";
import { BRAND_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ brand }: Button2MassiveDownloadBrandProps) {
	const [open, setOpen] = useState(false);

	const items = brand.map((item) => ({
		nombre: item.nombre ?? "",
		categoria: item.categoria ?? "",
		proveedores: (item.proveedores_info ?? [])
			.map((supplier) => supplier.nombre)
			.filter(Boolean)
			.join(", "),
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
					title="Descarga masiva de marcas"
					description="Exporta la lista de marcas en XLSX o CSV."
					items={items}
					columns={BRAND_EXPORT_COLUMNS}
					defaultFileName="marcas"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
