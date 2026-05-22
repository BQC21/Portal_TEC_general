// import { Button2Edit } from "@/features/components/Buttons/sizing/button2edit";
// import { Button2Trash } from "@/features/components/Buttons/sizing/button2trash";

import type { Project } from "@/lib/types/project-types";

import { TABLE_HEADERS_PROJECT } from "@/lib/utils/headers";

import{
    formatDate,
} from "@/lib/utils/helpers"

type ProjectTableProps = {
    projects: Project[];
    totalProjects: number;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
};


export default function ProjectTable({ projects, 
    totalProjects, 
    onUpdateProject, 
    onDeleteProject }: ProjectTableProps) {
    
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_PROJECT.map((header) => (
                                <th
                                    key={header}
                                    className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"
                                >
                                    {header}
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{project.nombre}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{project.descripcion}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(project.created_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{formatDate(project.updated_at)}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{project.estado_proyecto}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit
                                                    product={project}
                                                    onUpdateProduct={onUpdateProject}
                                                />
                                                <Button2Trash
                                                    onDeleteProduct={() => onDeleteProject(project.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_PROJECT.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay proyectos registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalProjects} proyectos
            </p>
        </section>
    )
}