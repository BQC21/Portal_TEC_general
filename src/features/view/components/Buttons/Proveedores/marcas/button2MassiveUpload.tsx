"use client";

import { useState } from "react";

import { MassiveUploadIcon } from "@/features/view/components/Icons/MassiveUploadIcon";
import { MassiveUploadModal } from "@/features/view/components/Modals/Massive/MassiveUpload";
import { Button2MassiveUploadProps } from "@/lib/types/components/General/buttons";
import { BRAND_TABLE } from "@/lib/utils/namingTolerance";
import {
	BRAND_UPLOAD_COLUMNS,
	BRAND_UPLOAD_HEADERS,
} from "@/lib/utils/helpers/templates/massiveUpload";
import { transformBrandRows } from "@/lib/utils/helpers/massive/massiveUpload";

export default function Button2MassiveUpload({ onSuccess }: Button2MassiveUploadProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-brand-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
				title="Subida masiva"
			>
				<MassiveUploadIcon />
				<span>Subida masiva</span>
			</button>

			{open && (
				<MassiveUploadModal
					title="Subida masiva de marcas"
					description="Selecciona un archivo XLSX con la estructura de la hoja de marcas."
					tableName={BRAND_TABLE}
					expectedHeaders={BRAND_UPLOAD_HEADERS}
					columns={BRAND_UPLOAD_COLUMNS}
					transformRows={transformBrandRows}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
				/>
			)}
		</>
	);
}
