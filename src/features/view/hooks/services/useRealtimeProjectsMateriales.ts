"use client";

import { createJoinProjectMateriales, deleteJoinProjectMateriales, 
    getJoinProjectMateriales, updateJoinProjectMateriales } from "@/features/controller/services/projectMaterialesQueries";
import { createClient } from "@/lib/supabase/client";
import { Project_Materiales, Project_MaterialesFormData, useProject_MaterialesMutationResult, UseProject_MaterialesResult } from "@/lib/types/supabase/project_materiales_join";
import { PROJECTS_MATERIALES_TABLE } from "@/lib/utils/namingTolerance";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useProjectMateriales(): UseProject_MaterialesResult{
    const [projects_materiales, setProjectsMateriales] = useState<Project_Materiales[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects_Materiales = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);

            const data = await getJoinProjectMateriales();
            setProjectsMateriales(data);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 
                "Error al cargar las relaciones";

            setError(message);            
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect( () => {
        void fetchProjects_Materiales();
    }, [fetchProjects_Materiales]);
    /* 
        previene colision de suscripciones
    */
    useEffect(() => {
        const channelName = `projects-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: PROJECTS_MATERIALES_TABLE },
                () => {
                    void fetchProjects_Materiales();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: PROJECTS_MATERIALES_TABLE },
                () => {
                    void fetchProjects_Materiales();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: PROJECTS_MATERIALES_TABLE },
                () => {
                    void fetchProjects_Materiales();
                }
            )
            .subscribe();

        // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
        return () => {
            void supabase.removeChannel(channel);
        };

    }, [fetchProjects_Materiales]);

    return {
        projects_materiales,
        loading,
        error,
        refetch: fetchProjects_Materiales
    }
}

export function useProjectMaterialesMutations(): useProject_MaterialesMutationResult{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (project_materiales: Project_MaterialesFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createJoinProjectMateriales(project_materiales);
        } catch (err) {
            const message =
                err instanceof Error ? 
                err.message : "Error al crear la relación";

            setError(message);
            throw err;        
        } finally {
            setLoading(false);
        }
    }, [])

    const update = useCallback(async (
        id: string, project_materiales: Project_MaterialesFormData) => {
            try {
                setLoading(true);
                setError(null);

                return await updateJoinProjectMateriales(id, project_materiales)
            } catch (err) {
            const message =
                err instanceof Error ? 
                err.message : "Error al actualizar la relación";

            setError(message);
            throw err;
            } finally {
                setLoading(false)
            }
        }, []);

    const remove = useCallback(async (
        id: string) => {
            try {
                setLoading(true);
                setError(null);

                return await deleteJoinProjectMateriales(id);
            } catch (err) {
            const message =
                err instanceof Error ? 
                err.message : "Error al borrar la relación";

            setError(message);
            throw err;
            } finally {
                setLoading(false)
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
