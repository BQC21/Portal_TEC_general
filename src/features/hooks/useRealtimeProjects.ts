"use client";

import { useCallback, useEffect, useState } from "react";

import {
    createProject,
    deleteProject,
    getProjects,
    updateProject,
} from "@/features/services/projectQueries";

import type { 
    Project,
    ProjectFormData,
    UseProjectMutationsResult,
    UseProjectResult,
} from "@/lib/types/project-types";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Conexión con la lista de productos
export function useProjects(): UseProjectResult {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            const message =
            err instanceof Error ? err.message : "Error al cargar los productos";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchProjects();
    }, [fetchProjects]);

    /* 
        previene colision de suscripciones
    */
    useEffect(() => {
        const channelName = `products-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "proyectos" },
                () => {
                    void fetchProjects();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "proyectos" },
                () => {
                    void fetchProjects();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "proyectos" },
                () => {
                    void fetchProjects();
                }
            )
            .subscribe();

        // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
        return () => {
            void supabase.removeChannel(channel);
        };

    }, [fetchProjects]);

    return {
        projects,
        loading,
        error,
        refetch: fetchProjects,
    };
}

// Aplicar mutaciones a la lista de productos
export function useProjectMutations(): UseProjectMutationsResult {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // crear productos
    const create = useCallback(async (project: ProjectFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createProject(project);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al crear el proyecto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // actualizar producto
    const update = useCallback(async (id: string, project: ProjectFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await updateProject(id, project);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al actualizar el proyecto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // eliminar producto
    const remove = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            await deleteProject(id);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Error al eliminar el proyecto";

            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        create,
        update,
        remove,
    };
}