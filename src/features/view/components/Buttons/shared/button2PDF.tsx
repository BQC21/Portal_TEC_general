"use client";

import { useState } from "react";

import { useGenerateReportPdf } from "@/features/controller/hooks/api/useGenerateReportPdf";
import { Button2PDFProps } from "@/lib/types/components/General/buttons";

export default function Button2PDF({ disabled, getPayload }: Button2PDFProps) {
	const [requested, setRequested] = useState(false);
	const { loading, error, generate } = useGenerateReportPdf();

	async function handleGenerate() {
		setRequested(true);
		await generate(getPayload());
	}

	return (
		<div>
			<button
				type="button"
				onClick={() => void handleGenerate()}
				disabled={loading || disabled}
				className="rounded-xl bg-red-500 text-white border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-red-300 disabled:opacity-50"
			>
				{loading ? "Generando PDF..." : "Generar PDF"}
			</button>

			{requested && error && <p className="mt-2 text-sm text-red-600">{error}</p>}
		</div>
	);
}
