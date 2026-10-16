"use client";

import { useEffect, useRef } from "react";
import { updateQuoteSalePrice } from "@/features/model/services/QuoteQueries";
import { useMateriales } from "@/features/ViewModel/hooks/services/useRealtimeMateriales";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { Quote } from "@/lib/types/supabase/quote-types";
import { quoteSalePatches } from "@/lib/utils/helpers/computes/quote_sale_price";

type UseSyncQuoteSalePricesParams = {
    quotes: Quote[];
    quotesLoading: boolean;
    projectEquipos: Project_Equipos[];
    equiposLoading: boolean;
    projectMateriales: Project_Materiales[];
    materialesLoading: boolean;
    refetchQuotes: () => Promise<void>;
};

export function useSyncQuoteSalePrices({
    quotes,
    quotesLoading,
    projectEquipos,
    equiposLoading,
    projectMateriales,
    materialesLoading,
    refetchQuotes,
}: UseSyncQuoteSalePricesParams) {
    const { materiales, loading: catalogLoading } = useMateriales();
    const generation = useRef(0);
    const written = useRef(new Map<string, string>());

    useEffect(() => {
        if (quotesLoading || equiposLoading || materialesLoading || catalogLoading) return;

        const patches = quoteSalePatches({
            quotes,
            existingEquipos: projectEquipos,
            existingMateriales: projectMateriales,
            materialesCatalog: materiales,
        }).filter((patch) => {
            const signature = `${patch.precio_dolares}|${patch.gm ?? ""}`;
            return written.current.get(patch.id) !== signature;
        });
        if (patches.length === 0) return;

        const current = ++generation.current;
        void (async () => {
            const results = await Promise.allSettled(
                patches.map(async (patch) => {
                    await updateQuoteSalePrice(patch.id, {
                        precio_dolares: patch.precio_dolares,
                        gm: patch.gm,
                    });
                    written.current.set(patch.id, `${patch.precio_dolares}|${patch.gm ?? ""}`);
                }),
            );
            if (generation.current !== current) return;

            const failed = results.find((result) => result.status === "rejected");
            if (failed?.status === "rejected") {
                console.error("No se pudo actualizar el precio de cotización", failed.reason);
            }
            if (results.some((result) => result.status === "fulfilled")) {
                await refetchQuotes();
            }
        })();
    }, [
        quotes,
        quotesLoading,
        projectEquipos,
        equiposLoading,
        projectMateriales,
        materialesLoading,
        materiales,
        catalogLoading,
        refetchQuotes,
    ]);
}
