import { useMemo } from "react";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { Quote } from "@/lib/types/supabase/quote-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { isQuoteLinkedToProject } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { resolveQuoteDisplayResources } from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";
import {
    computeQuoteCostTotals,
    sumQuoteCostTotals,
} from "@/lib/utils/helpers/computes/quote_cost_totals";
import {
    mergeManualCosts,
    mergeProjectEquipos,
    mergeProjectMateriales,
    productDescriptions,
} from "@/lib/utils/helpers/quotes/unitedQuotes";
import { EMPTY_GROSS_MARGIN, EMPTY_PRECIO_FINAL, EMPTY_RECURSOS, EMPTY_VIATICOS } from "@/lib/utils/empty";

type UseUnitedQuoteAggregationParams = {
    quotes: Quote[];
    selectedIds: string[];
    existingProjectEquipos: Project_Equipos[];
    existingProjectMateriales: Project_Materiales[];
};

export function useUnitedQuoteAggregation({
    quotes,
    selectedIds,
    existingProjectEquipos,
    existingProjectMateriales,
}: UseUnitedQuoteAggregationParams) {
    const { materiales } = useMateriales();

    return useMemo(() => {
        const selectedQuotes = selectedIds
            .map((id) => quotes.find((quote) => String(quote.id) === String(id)))
            .filter((quote): quote is Quote => Boolean(quote));

        if (selectedQuotes.length === 0) {
            return {
                selectedQuotes,
                mergedEquipos: [] as Project_Equipos[],
                mergedMateriales: [] as Project_Materiales[],
                mergedManualCosts: undefined as ManualCosts | undefined,
                equiposDescriptions: [] as string[],
                materialesDescriptions: [] as string[],
                recursos: EMPTY_RECURSOS,
                viaticos: EMPTY_VIATICOS,
                precioFinal: EMPTY_PRECIO_FINAL,
                grossMargin: EMPTY_GROSS_MARGIN,
                seedQuote: undefined as Quote | undefined,
            };
        }

        const parts = selectedQuotes.map((quote) => {
            const { equipos, materiales: quoteMateriales } = resolveQuoteDisplayResources({
                hasSelectedQuote: true,
                isIndependent: !isQuoteLinkedToProject(quote),
                quote,
                existingEquipos: existingProjectEquipos,
                existingMateriales: existingProjectMateriales,
            });

            return {
                quote,
                equipos,
                materiales: quoteMateriales,
                ...computeQuoteCostTotals({
                    projectEquipos: equipos,
                    projectMateriales: quoteMateriales,
                    manualCosts: quote.costos_manuales,
                    gm_general: Number(quote.gm_general),
                    markup: Number(quote.markup),
                    gm_viaticos: Number(quote.gm_viaticos),
                    tasa_cambio: Number(quote.tasa_cambio),
                    depre_tool: Number(quote.depre_tool),
                    materialesCatalog: materiales,
                    applyResourceChecklists: !isQuoteLinkedToProject(quote),
                }),
            };
        });

        const mergedEquipos = mergeProjectEquipos(parts.flatMap((part) => part.equipos));
        const mergedMateriales = mergeProjectMateriales(parts.flatMap((part) => part.materiales));
        const mergedManualCosts = mergeManualCosts(parts.map((part) => part.quote.costos_manuales));
        const totals = sumQuoteCostTotals(parts);
        const descriptions = productDescriptions(mergedEquipos, mergedMateriales);

        return {
            selectedQuotes,
            mergedEquipos,
            mergedMateriales,
            mergedManualCosts,
            ...descriptions,
            ...totals,
            seedQuote: selectedQuotes[0],
        };
    }, [
        quotes,
        selectedIds,
        existingProjectEquipos,
        existingProjectMateriales,
        materiales,
    ]);
}
