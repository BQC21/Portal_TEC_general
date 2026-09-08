"use client";

import { useState } from "react";

import { MassiveDownloadIcon } from "@/features/view/components/Icons/MassiveDownloadIcon";
import { MassiveDownloadModal } from "@/features/view/components/Modals/Massive/MassiveDownloadModal";
import { Button2MassiveDownloadProjectProps } from "@/lib/types/components/General/buttons";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { PROJECT_EXPORT_COLUMNS } from "@/lib/utils/helpers/templates/massiveDownload";

export default function Button2MassiveDownload({
	projects,
	projects_equipos,
	projects_materiales,
}: Button2MassiveDownloadProjectProps) {
	const [open, setOpen] = useState(false);

	const items = projects.map((project) => {
		const equiposDescriptions = projects_equipos
			.filter((item) => item.proyecto_id === project.id)
			.map((item) => item.equipo_info?.descripcion)
			.filter((description): description is string => Boolean(description));
		const materialesDescriptions = projects_materiales
			.filter((item) => item.proyecto_id === project.id)
			.map((item) => item.material_info?.descripcion)
			.filter((description): description is string => Boolean(description));

		return {
			nombre: project.nombre ?? "",
			zona: project.zona_info?.zona ?? "",
			tipo_instalacion: project.tipo_instalacion ?? "",
			equipos: equiposDescriptions.length > 0 ? equiposDescriptions.join("\n") : "-",
			materiales: materialesDescriptions.length > 0 ? materialesDescriptions.join("\n") : "-",
			enlace: project.enlace ?? "",
			created_at: formatDate(project.created_at),
			updated_at: formatDate(project.updated_at),
			estado_proyecto: project.estado_proyecto ?? "",
		};
	});

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
					title="Descarga masiva de proyectos"
					description="Exporta la lista de proyectos en XLSX o CSV."
					items={items}
					columns={PROJECT_EXPORT_COLUMNS}
					defaultFileName="proyectos"
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
