import { QuoteCostTotals } from "@/lib/types/components/Quotes/finantial_computes";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { Quote } from "@/lib/types/supabase/quote-types";
import { computeQuoteCostTotals, sumQuoteCostTotals } from "@/lib/utils/helpers/computes/quote_cost_totals";
import { isQuoteLinkedToProject } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { getUnitedQuoteInfo, isUnitedQuote } from "@/lib/utils/helpers/quotes/unitedQuotes";
import {
    resolveQuoteEquipos,
    resolveQuoteMateriales,
} from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";
import { withAutomaticStructureQuantities } from "@/lib/utils/helpers/project_modals/structureQuantities";
import { INITIAL_MANUAL_RESOURCE_COSTS } from "@/lib/utils/initialValues";

export type QuoteSalePatch = {
    id: string;
    precio_dolares: number;
    gm?: number;
};

function moneyKey(value: number): string | null {
    if (!Number.isFinite(value)) return null;
    return value.toFixed(2);
}

function gmPercentKey(value: number): string | null {
    if (!Number.isFinite(value) || value <= 0) return null;
    return (value * 100).toFixed(2);
}

export function liveQuoteCostTotals(params: {
    quote: Quote;
    existingEquipos: Project_Equipos[];
    existingMateriales: Project_Materiales[];
    materialesCatalog: Materiales[];
}): QuoteCostTotals & { equipos: Project_Equipos[]; materiales: Project_Materiales[] } {
    const { quote, existingEquipos, existingMateriales, materialesCatalog } = params;
    const isIndependent = !isQuoteLinkedToProject(quote) && !isUnitedQuote(quote);
    const manualCosts = quote.costos_manuales ?? INITIAL_MANUAL_RESOURCE_COSTS;
    const equipos = withAutomaticStructureQuantities(
        resolveQuoteEquipos(
            manualCosts.Recursos?.equipos_seleccionados,
            quote.proyecto_id,
            existingEquipos,
        ),
        Boolean(manualCosts.Recursos?.estructuras_cantidad_manual),
    );
    const materiales = resolveQuoteMateriales(
        manualCosts.Recursos?.materiales_seleccionados,
        quote.proyecto_id,
        existingMateriales,
    );

    return {
        equipos,
        materiales,
        ...computeQuoteCostTotals({
            projectEquipos: equipos,
            projectMateriales: materiales,
            manualCosts,
            gm_general: Number(quote.gm_general),
            markup: Number(quote.markup),
            gm_viaticos: Number(quote.gm_viaticos),
            tasa_cambio: Number(quote.tasa_cambio),
            depre_tool: Number(quote.depre_tool),
            materialesCatalog,
            applyResourceChecklists: isIndependent,
        }),
    };
}

function totalsOfQuote(
    quote: Quote,
    quotes: Quote[],
    existingEquipos: Project_Equipos[],
    existingMateriales: Project_Materiales[],
    materialesCatalog: Materiales[],
    visiting: Set<string>,
): QuoteCostTotals | null {
    if (visiting.has(quote.id)) return null;
    visiting.add(quote.id);

    if (!isUnitedQuote(quote)) {
        const totals = liveQuoteCostTotals({
            quote,
            existingEquipos,
            existingMateriales,
            materialesCatalog,
        });
        visiting.delete(quote.id);
        return totals;
    }

    const childIds = getUnitedQuoteInfo(quote)?.quote_ids ?? [];
    const children = childIds
        .map((id) => quotes.find((item) => String(item.id) === String(id)))
        .filter((item): item is Quote => Boolean(item));
    if (children.length === 0) {
        visiting.delete(quote.id);
        return null;
    }

    const parts = children
        .map((child) => totalsOfQuote(
            child,
            quotes,
            existingEquipos,
            existingMateriales,
            materialesCatalog,
            visiting,
        ))
        .filter((part): part is QuoteCostTotals => Boolean(part));
    visiting.delete(quote.id);
    if (parts.length === 0) return null;
    return sumQuoteCostTotals(parts);
}

export function quoteSalePatches(params: {
    quotes: Quote[];
    existingEquipos: Project_Equipos[];
    existingMateriales: Project_Materiales[];
    materialesCatalog: Materiales[];
}): QuoteSalePatch[] {
    const { quotes, existingEquipos, existingMateriales, materialesCatalog } = params;
    const patches: QuoteSalePatch[] = [];

    for (const quote of quotes) {
        const totals = totalsOfQuote(
            quote,
            quotes,
            existingEquipos,
            existingMateriales,
            materialesCatalog,
            new Set(),
        );
        if (!totals) continue;

        const nextPrice = totals.precioFinal.dolares;
        const nextPriceKey = moneyKey(nextPrice);
        if (nextPriceKey == null) continue;

        const nextGm = Number(totals.grossMargin.gm.gm);
        const nextGmKey = gmPercentKey(nextGm);
        const storedGmKey = gmPercentKey(Number(quote.gm));
        const priceChanged = moneyKey(Number(quote.precio_dolares)) !== nextPriceKey;
        const gmChanged = nextGmKey != null && nextGmKey !== storedGmKey;
        if (!priceChanged && !gmChanged) continue;

        patches.push({
            id: quote.id,
            precio_dolares: Number(nextPriceKey),
            ...(gmChanged ? { gm: Number(nextGm.toFixed(6)) } : {}),
        });
    }

    return patches;
}
