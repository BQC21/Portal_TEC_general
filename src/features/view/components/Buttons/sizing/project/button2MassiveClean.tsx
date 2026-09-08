"use client";

import { useState } from "react";

import { MassiveCleanIcon } from "@/features/view/components/Icons/MassiveCleanIcon";
import { MassiveCleanModal } from "@/features/view/components/Modals/Massive/MassiveCleanModal";
import { Button2MassiveCleanProps } from "@/lib/types/components/General/buttons";
import {
	PROJECTS_EQUIPOS_TABLE,
	PROJECTS_MATERIALES_TABLE,
	PROJECTS_TABLE,
} from "@/lib/utils/namingTolerance";

export default function Button2MassiveClean({ currentCount, onSuccess }: Button2MassiveCleanProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-rose-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
				title="Limpieza masiva"
			>
				<MassiveCleanIcon />
				<span>Limpieza masiva</span>
			</button>

			{open && (
				<MassiveCleanModal
					currentCount={currentCount}
					onClose={() => setOpen(false)}
					onSuccess={onSuccess}
					tableName={PROJECTS_TABLE}
					relatedTableNames={[PROJECTS_EQUIPOS_TABLE, PROJECTS_MATERIALES_TABLE]}
					title="Limpieza masiva de proyectos"
					description="Esta acción elimina todas las filas de proyectos y sus equipos y materiales asociados."
					entityLabel="proyectos"
				/>
			)}
		</>
	);
}
