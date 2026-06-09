"use client";

import { createJoinProjectEquipos, deleteJoinProjectEquipos, getJoinProjectEquipos, updateJoinProjectEquipos } from "@/features/controller/services/projectEquiposQueries";
import { createClient } from "@/lib/supabase/client";
import { Project_Equipos, Project_EquiposFormData, useProject_EquiposMutationResult, UseProject_EquiposResult } from "@/lib/types/project_equipos_join";
import { PROJECTS_EQUIPOS_TABLE } from "@/lib/utils/namingTolerance";
import { useCallback, useEffect, useState } from "react";

const supabase = createClient();

export function useProjectEquipos(): UseProject_EquiposResult{
    const [projects_equipos, setProjectsEquipos] = useState<Project_Equipos[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects_Equipos = useCallback(async () => {
        try{
            setLoading(true);
            setError(null);

            const data = await getJoinProjectEquipos();
            setProjectsEquipos(data);
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
        void fetchProjects_Equipos();
    }, [fetchProjects_Equipos]);
    /* 
        previene colision de suscripciones
    */
    useEffect(() => {
        const channelName = `projects-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`; 
        const channel = supabase
            .channel(channelName)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: PROJECTS_EQUIPOS_TABLE },
                () => {
                    void fetchProjects_Equipos();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: PROJECTS_EQUIPOS_TABLE },
                () => {
                    void fetchProjects_Equipos();
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: PROJECTS_EQUIPOS_TABLE },
                () => {
                    void fetchProjects_Equipos();
                }
            )
            .subscribe();

        // Cierra el canal realtime para evitar listeners duplicados y fugas de memoria.
        return () => {
            void supabase.removeChannel(channel);
        };

    }, [fetchProjects_Equipos]);

    return {
        projects_equipos,
        loading,
        error,
        refetch: fetchProjects_Equipos
    }
}

export function useProjectEquiposMutations(): useProject_EquiposMutationResult{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(async (project_equipos: Project_EquiposFormData) => {
        try {
            setLoading(true);
            setError(null);

            return await createJoinProjectEquipos(project_equipos);
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
        id: string, project_equipos: Project_EquiposFormData) => {
            try {
                setLoading(true);
                setError(null);

                return await updateJoinProjectEquipos(id, project_equipos)
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

                return await deleteJoinProjectEquipos(id);
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
