"use client";

import { AddProductCloseIcon } from "@/features/components/Icons/AddProductCloseIcon";
import { AddProductReadonlyField } from "@/features/components/Form_fields/AddProductReadonlyField";
import type { Project } from "@/lib/types/project-types";

type DeleteProjectModalProps = {
    project: Project;
    onDeleteProject: (projectId: string) => void;
    onClose: () => void;
};

export default function DeleteProjectModal({ project, onDeleteProject, onClose }: DeleteProjectModalProps) {
    async function handleDeleteProject(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onDeleteProject(project.id);
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Eliminar Proyecto</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label="Cerrar modal"
                    >
                        <AddProductCloseIcon />
                    </button>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <p className="text-lg text-slate-500">¿Está seguro que desea eliminar el siguiente proyecto?</p>
                </div>
                <form onSubmit={handleDeleteProject} className="max-h-[calc(95vh-88px)] overflow-y-auto px-6 py-6">
                    <AddProductReadonlyField label="Nombre del proyecto" value={project.nombre} />
                    <AddProductReadonlyField label="Descripción" value={project.descripcion} />
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
                        <button type="submit" className="rounded-xl bg-red-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-red-700">Eliminar Proyecto</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
