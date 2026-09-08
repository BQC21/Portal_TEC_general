"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadSupplierProps } from "@/lib/types/components/General/buttons";
import { SUPPLIER_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ supplier }: Button2MassiveDownloadSupplierProps) {
	const [open, setOpen] = useState(false);

	const items = supplier.map((item) => ({
		nombre: item.nombre ?? "",
		codigo: item.codigo ?? "",
		ruc: item.ruc ?? "",
		contacto: item.contacto ?? "",
		telefono: item.telefono ?? "",
		categoria: item.categoria ?? "",
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
					title="Descarga masiva de proveedores"
					description="Exporta la lista de proveedores en XLSX o CSV."
					items={items}
					columns={SUPPLIER_EXPORT_COLUMNS}
					defaultFileName="proveedores"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
