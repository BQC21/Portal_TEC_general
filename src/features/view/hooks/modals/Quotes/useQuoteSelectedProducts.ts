import { useCallback, useEffect, useRef, useState } from "react";
import { Equipos } from "@/lib/types/supabase/equipos-types";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import {
    quoteLiveResourcesKey,
    resolveQuoteEquipos,
    resolveQuoteMateriales,
} from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";

type UseQuoteSelectedProductsParams = {
    proyectoId: string | undefined;
    existingProjectEquipos: Project_Equipos[];
    existingProjectMateriales: Project_Materiales[];
    savedEquipos?: Project_Equipos[];
    savedMateriales?: Project_Materiales[];
};

export function useQuoteSelectedProducts({
    proyectoId,
    existingProjectEquipos,
    existingProjectMateriales,
    savedEquipos,
    savedMateriales,
}: UseQuoteSelectedProductsParams) {
    const [projectEquipos, setProjectEquipos] = useState<Project_Equipos[]>(() =>
        resolveQuoteEquipos(savedEquipos, proyectoId, existingProjectEquipos),
    );
    const [projectMateriales, setProjectMateriales] = useState<Project_Materiales[]>(() =>
        resolveQuoteMateriales(savedMateriales, proyectoId, existingProjectMateriales),
    );

    const hydratedProjectId = useRef(String(proyectoId ?? ""));
    const hydratedKey = useRef(
        quoteLiveResourcesKey(
            existingProjectEquipos.filter((item) => String(item.proyecto_id) === String(proyectoId ?? "")),
            existingProjectMateriales.filter((item) => String(item.proyecto_id) === String(proyectoId ?? "")),
        ),
    );
    const localEdited = useRef(false);

    useEffect(() => {
        const nextProjectId = String(proyectoId ?? "");
        if (!nextProjectId) {
            hydratedProjectId.current = "";
            hydratedKey.current = "";
            localEdited.current = false;
            setProjectEquipos([]);
            setProjectMateriales([]);
            return;
        }

        const liveEquipos = existingProjectEquipos.filter(
            (item) => String(item.proyecto_id) === nextProjectId,
        );
        const liveMateriales = existingProjectMateriales.filter(
            (item) => String(item.proyecto_id) === nextProjectId,
        );
        const nextKey = quoteLiveResourcesKey(liveEquipos, liveMateriales);
        const nextEquipos = resolveQuoteEquipos(savedEquipos, nextProjectId, existingProjectEquipos);
        const nextMateriales = resolveQuoteMateriales(
            savedMateriales,
            nextProjectId,
            existingProjectMateriales,
        );

        const projectChanged = nextProjectId !== hydratedProjectId.current;
        if (projectChanged) {
            hydratedProjectId.current = nextProjectId;
            hydratedKey.current = nextKey;
            localEdited.current = false;
            setProjectEquipos(nextEquipos);
            setProjectMateriales(nextMateriales);
            return;
        }

        if (!localEdited.current && nextKey !== hydratedKey.current) {
            hydratedKey.current = nextKey;
            setProjectEquipos(nextEquipos);
            setProjectMateriales(nextMateriales);
        }
    }, [
        proyectoId,
        existingProjectEquipos,
        existingProjectMateriales,
        savedEquipos,
        savedMateriales,
    ]);

    const markEdited = useCallback(() => {
        localEdited.current = true;
    }, []);

    const onUpdateEquipoCantidad = useCallback((id: string | number, cantidad: number) => {
        markEdited();
        setProjectEquipos((current) =>
            current.map((item) =>
                String(item.id) === String(id) ? { ...item, cantidad: String(cantidad) } : item,
            ),
        );
    }, [markEdited]);

    const onAddEquipo = useCallback((equipo: Equipos, cantidad = 1) => {
        markEdited();
        setProjectEquipos((current) => {
            if (current.some((item) => String(item.equipo_id) === String(equipo.id))) {
                return current;
            }

            const nextItem: Project_Equipos = {
                id: `local-equipo-${equipo.id}-${Date.now()}`,
                equipo_id: String(equipo.id),
                equipo_info: equipo,
                proyecto_id: String(proyectoId ?? ""),
                fecha_agregado: new Date(),
                cantidad: String(cantidad),
            };

            return [...current, nextItem];
        });
    }, [markEdited, proyectoId]);

    const onRemoveEquipo = useCallback((id: string | number) => {
        markEdited();
        setProjectEquipos((current) => current.filter((item) => String(item.id) !== String(id)));
    }, [markEdited]);

    const onUpdateMaterialCantidad = useCallback((id: string | number, cantidad: number) => {
        markEdited();
        setProjectMateriales((current) =>
            current.map((item) =>
                String(item.id) === String(id) ? { ...item, cantidad: String(cantidad) } : item,
            ),
        );
    }, [markEdited]);

    const onAddMaterial = useCallback((material: Materiales, cantidad = 1) => {
        markEdited();
        setProjectMateriales((current) => {
            if (current.some((item) => String(item.material_id) === String(material.id))) {
                return current;
            }

            const nextItem: Project_Materiales = {
                id: `local-material-${material.id}-${Date.now()}`,
                material_id: String(material.id),
                material_info: material,
                proyecto_id: String(proyectoId ?? ""),
                fecha_agregado: new Date(),
                cantidad: String(cantidad),
            };

            return [...current, nextItem];
        });
    }, [markEdited, proyectoId]);

    const onReplaceMaterial = useCallback((id: string | number, material: Materiales) => {
        markEdited();
        setProjectMateriales((current) => {
            const currentItem = current.find((item) => String(item.id) === String(id));
            if (!currentItem) return current;

            if (current.some((item) => String(item.id) !== String(id) && String(item.material_id) === String(material.id))) {
                return current.filter((item) => String(item.id) !== String(id));
            }

            return current.map((item) =>
                String(item.id) === String(id)
                    ? {
                        ...item,
                        material_id: String(material.id),
                        material_info: material,
                    }
                    : item,
            );
        });
    }, [markEdited]);

    const onRemoveMaterial = useCallback((id: string | number) => {
        markEdited();
        setProjectMateriales((current) => current.filter((item) => String(item.id) !== String(id)));
    }, [markEdited]);

    const equiposDescriptions = projectEquipos
        .map((item) => item.equipo_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    const materialesDescriptions = projectMateriales
        .map((item) => item.material_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    return {
        projectEquipos,
        projectMateriales,
        equiposDescriptions,
        materialesDescriptions,
        onUpdateEquipoCantidad,
        onAddEquipo,
        onRemoveEquipo,
        onUpdateMaterialCantidad,
        onAddMaterial,
        onReplaceMaterial,
        onRemoveMaterial,
    };
}
