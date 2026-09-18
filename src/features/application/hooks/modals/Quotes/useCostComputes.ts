import { useMemo } from "react";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { useMateriales } from "@/features/application/hooks/services/useRealtimeMateriales";
import { computeQuoteCostTotals } from "@/lib/utils/helpers/computes/quote_cost_totals";

export function useCostComputes(
    projectEquipos: Project_Equipos[],
    projectMateriales: Project_Materiales[],
    manualCosts: ManualCosts,
    gm_general: number,
    markup: number,
    gm_viaticos: number,
    tasa_cambio: number,
    depre_tool: number,
    applyResourceChecklists = false,
) {
    const { materiales } = useMateriales();

    return useMemo(
        () => computeQuoteCostTotals({
            projectEquipos,
            projectMateriales,
            manualCosts,
            gm_general,
            markup,
            gm_viaticos,
            tasa_cambio,
            depre_tool,
            materialesCatalog: materiales,
            applyResourceChecklists,
        }),
        [
            projectEquipos,
            projectMateriales,
            manualCosts,
            gm_general,
            markup,
            gm_viaticos,
            tasa_cambio,
            depre_tool,
            materiales,
            applyResourceChecklists,
        ],
    );
}
