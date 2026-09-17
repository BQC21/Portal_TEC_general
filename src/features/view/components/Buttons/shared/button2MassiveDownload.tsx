"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadProps } from "@/lib/types/components/General/buttons";

export default function Button2MassiveDownload<T>({
	title,
	description,
	items,
	columns,
	defaultFileName,
}: Button2MassiveDownloadProps<T>) {
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
					title={title}
					description={description}
					items={items}
					columns={columns}
					defaultFileName={defaultFileName}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
