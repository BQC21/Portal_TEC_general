"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadQuoteProps } from "@/lib/types/components/General/buttons";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { formatCurrency } from "@/lib/utils/normalization";
import { QUOTE_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({ quotes }: Button2MassiveDownloadQuoteProps) {
	const [open, setOpen] = useState(false);

	const items = quotes.map((quote) => ({
		cod_cotizacion: quote.cod_cotizacion ?? "",
		proyecto: quote.proyecto_info?.nombre ?? "",
		igv: quote.igv ?? "",
		tasa_cambio: quote.tasa_cambio ?? "",
		precio_dolares: formatCurrency(Number(quote.precio_dolares), "USD"),
		created_at: formatDate(quote.created_at),
		updated_at: formatDate(quote.updated_at),
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
					title="Descarga masiva de cotizaciones"
					description="Exporta la lista de cotizaciones en XLSX o CSV."
					items={items}
					columns={QUOTE_EXPORT_COLUMNS}
					defaultFileName="cotizaciones"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
