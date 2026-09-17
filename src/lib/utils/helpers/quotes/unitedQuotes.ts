import { ManualCosts, QuoteUnionInfo } from "@/lib/types/components/Quotes/manual_resources";
import { Quote } from "@/lib/types/supabase/quote-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { INITIAL_MANUAL_RESOURCE_COSTS } from "@/lib/utils/initialValues";

export function emptySelectedIds(count: number) {
    return Array.from({ length: count }, () => "");
}

export function isUnitedQuote(quote?: {
    costos_manuales?: { union?: { quote_ids?: string[] } | null } | null;
} | null): boolean {
    const ids = quote?.costos_manuales?.union?.quote_ids;
    return Array.isArray(ids) && ids.length > 0;
}

export function getUnitedQuoteInfo(quote?: {
    costos_manuales?: ManualCosts | null;
} | null): QuoteUnionInfo | undefined {
    const union = quote?.costos_manuales?.union;
    if (!union || !Array.isArray(union.quote_ids) || union.quote_ids.length === 0) {
        return undefined;
    }
    return {
        quote_ids: union.quote_ids.map(String),
        cantidad: Number(union.cantidad) || union.quote_ids.length,
    };
}

export function eligibleQuotesForUnion(quotes: Quote[], excludeId?: string): Quote[] {
    return quotes.filter((quote) => {
        if (excludeId && String(quote.id) === String(excludeId)) return false;
        return !isUnitedQuote(quote);
    });
}

function mergeNumericQuantity(a: unknown, b: unknown): string {
    return String((Number(a) || 0) + (Number(b) || 0));
}

export function mergeProjectEquipos(items: Project_Equipos[]): Project_Equipos[] {
    const byId = new Map<string, Project_Equipos>();
    for (const item of items) {
        const key = String(item.equipo_id || item.equipo_info?.id || item.id);
        if (!key) continue;
        const current = byId.get(key);
        if (!current) {
            byId.set(key, {
                ...item,
                id: `union-equipo-${key}`,
                cantidad: String(Number(item.cantidad) || 0),
            });
            continue;
        }
        byId.set(key, {
            ...current,
            equipo_info: current.equipo_info ?? item.equipo_info,
            cantidad: mergeNumericQuantity(current.cantidad, item.cantidad),
        });
    }
    return Array.from(byId.values());
}

export function mergeProjectMateriales(items: Project_Materiales[]): Project_Materiales[] {
    const byId = new Map<string, Project_Materiales>();
    for (const item of items) {
        const key = String(item.material_id || item.material_info?.id || item.id);
        if (!key) continue;
        const current = byId.get(key);
        if (!current) {
            byId.set(key, {
                ...item,
                id: `union-material-${key}`,
                cantidad: String(Number(item.cantidad) || 0),
            });
            continue;
        }
        byId.set(key, {
            ...current,
            material_info: current.material_info ?? item.material_info,
            cantidad: mergeNumericQuantity(current.cantidad, item.cantidad),
        });
    }
    return Array.from(byId.values());
}

function withFreshIds<T extends { id: string }>(items: T[] | undefined): T[] {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
    }));
}

export function mergeManualCosts(costsList: ManualCosts[]): ManualCosts {
    if (costsList.length === 0) return INITIAL_MANUAL_RESOURCE_COSTS;

    return {
        Recursos: {
            consumible: costsList.flatMap((costs) => withFreshIds(costs.Recursos.consumible)),
            epp: costsList.flatMap((costs) => withFreshIds(costs.Recursos.epp)),
            tooling: costsList.flatMap((costs) => withFreshIds(costs.Recursos.tooling)),
            personal: costsList.flatMap((costs) => withFreshIds(costs.Recursos.personal)),
            sctr: costsList.flatMap((costs) => withFreshIds(costs.Recursos.sctr)),
            considerar_epp_reutilizable: costsList.every(
                (costs) => costs.Recursos.considerar_epp_reutilizable !== false,
            ),
            estructuras_cantidad_manual: costsList.some(
                (costs) => costs.Recursos.estructuras_cantidad_manual,
            ),
            considerar_equipos_principales: costsList.every(
                (costs) => costs.Recursos.considerar_equipos_principales !== false,
            ),
            considerar_estructuras: costsList.every(
                (costs) => costs.Recursos.considerar_estructuras !== false,
            ),
            considerar_consumibles: costsList.every(
                (costs) => costs.Recursos.considerar_consumibles !== false,
            ),
            consumibles_ocultos: [],
        },
        Viaticos: {
            gastos_viaje: costsList.flatMap((costs) => withFreshIds(costs.Viaticos.gastos_viaje)),
            courier: costsList.flatMap((costs) => withFreshIds(costs.Viaticos.courier)),
        },
    };
}

export function withUnionInfo(costs: ManualCosts, union: QuoteUnionInfo): ManualCosts {
    return {
        ...costs,
        union,
    };
}

export function productDescriptions(
    equipos: Project_Equipos[],
    materiales: Project_Materiales[],
): { equiposDescriptions: string[]; materialesDescriptions: string[] } {
    return {
        equiposDescriptions: equipos
            .map((item) => {
                const description = item.equipo_info?.descripcion?.trim();
                if (!description) return "";
                const cantidad = Number(item.cantidad);
                return Number.isFinite(cantidad) && cantidad > 0
                    ? `${cantidad} × ${description}`
                    : description;
            })
            .filter(Boolean),
        materialesDescriptions: materiales
            .map((item) => {
                const description = item.material_info?.descripcion?.trim();
                if (!description) return "";
                const cantidad = Number(item.cantidad);
                return Number.isFinite(cantidad) && cantidad > 0
                    ? `${cantidad} × ${description}`
                    : description;
            })
            .filter(Boolean),
    };
}
