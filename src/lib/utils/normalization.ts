import {CurrencyCode} from "@/lib/types/components/General/options"
import {PRICE_CURRENCY_OPTIONS} from "@/lib/utils/options"
import { EMPTY_VENTA } from "./empty";
import { MOActivity } from "../types/components/sub_components/module_render";
import { createInitialMOActivities, createInitialPdfVisibility } from "./helpers/computes/report_computes";
import { ReportPdfVisibility } from "../types/supabase/report-types";
import { EatingItem, ManualCosts, MontoItem } from "../types/components/Quotes/manual_resources";
import { INITIAL_MANUAL_RESOURCE_COSTS } from "./initialValues";

// -------------------------
// Funciones para Normalización y Formateo de Datos
// -------------------------

// función para convertir un valor a número de forma segura
export function toSafeNumber(value: unknown): number {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : 0;
	}

	if (value === null || value === undefined) return 0;

	let s = String(value).trim();
	if (s === "") return 0;

	// Remove common currency symbols and whitespace
	s = s.replace(/[\s\$/S€£¥¢₱₲]/g, "");

	// If value contains a slash (e.g. "20/20"), take the first segment
	if (s.includes("/")) {
		s = s.split("/")[0];
	}

	// Handle comma as decimal separator. If both '.' and ',' exist, assume ',' are thousand separators.
	if (s.includes(",")) {
		if (s.includes(".")) {
			s = s.replace(/,/g, "");
		} else {
			s = s.replace(/,/g, ".");
		}
	}

	// Extract the first numeric-like substring
	const m = s.match(/-?\d+(?:\.\d+)?/);
	const parsed = m ? Number(m[0]) : Number.NaN;

	if (!Number.isFinite(parsed)) return 0;

	// Prevent numeric field overflow by capping excessively large values
	const MAX_SAFE_UPLOAD_NUMBER = 1_000_000_000; // 1 billion
	if (Math.abs(parsed) > MAX_SAFE_UPLOAD_NUMBER) {
		// Keep a bounded value instead of letting DB error on insert
		console.warn(`toSafeNumber: value '${String(value)}' parsed as ${parsed} 
			exceeds max ${MAX_SAFE_UPLOAD_NUMBER}, capping.`);
		return Math.sign(parsed) * MAX_SAFE_UPLOAD_NUMBER;
	}

	return parsed;
}

// función para normalizar el código de moneda, 
export function normalizeCurrencyCode(value: unknown): CurrencyCode {
	if ((PRICE_CURRENCY_OPTIONS as readonly string[]).includes(String(value))) {
		return value as CurrencyCode;
	}
	return "PEN";
}

// ---- Formateo de números
export const parseNumber = (v: unknown): number | undefined => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
    const s = String(v).trim();
    if (s === "") return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
};

// Parsear números enteros (undefined -> null)
export function toNullableInteger(value: unknown): number | null {
    const parsed = parseNumber(value);
    return parsed === undefined ? null : parsed;
}

// ---------
// ARREGLOS
// ---------

// normalizar arreglo de strings
export function normalizeAssociationIds(ids: unknown, fallbackId?: unknown): string[] {
    const fromArray = Array.isArray(ids)
        ? ids.map((id) => String(id ?? "").trim()).filter(Boolean)
        : [];
    if (fromArray.length > 0) {
        return Array.from(new Set(fromArray));
    }
    const fallback = String(fallbackId ?? "").trim();
    return fallback ? [fallback] : [];
}

// Arreglo de numeros enteros
export function toIntegerIdArray(ids: string[]): number[] {
    return ids
        .map((id) => toNullableInteger(id))
        .filter((id): id is number => id != null);
}

// Convierte un valor numérico (number o string de PostgREST) 
// sin redondear a 2 decimales. 
export function toDecimalNumber(value: unknown): number {
    if (value === null || value === undefined || value === "") return 0;
    const n = typeof value === "number" ? value : Number(String(value).trim());
    return Number.isFinite(n) ? n : 0;
}

// Conversión de valor EMPTY a NULL
export function emptyToNull(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    const s = String(value);
    return s.trim() === "" ? null : s;
}

// Conversión de número a formato de moneda
export const formatCurrency = (value: number, currency: CurrencyCode): string => {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: currency,
    }).format(value);
};

// formatear la demanda mensual para que se muestre como
// arreglo en la tabla de proyectos 
export function formatDemandaMensual(value: number[] | string | null | undefined) {
    if (Array.isArray(value)) {
        return value.join(", ");
    }

    if (typeof value === "string") {
        return value.split(/,\s*|\s+/).join(", ");
    }

    return "";
}

// -----------------
// UNIÓN DE QUOTES
// -----------------

export function addPair(
    a: { total: number; igv: number },
    b: { total: number; igv: number },
) {
    return { total: a.total + b.total, igv: a.igv + b.igv };
}

export function addSoles(
    a: { soles: number; igv: number },
    b: { soles: number; igv: number },
) {
    return { soles: a.soles + b.soles, igv: a.igv + b.igv };
}

export function addVenta(
    a: typeof EMPTY_VENTA,
    b: typeof EMPTY_VENTA,
) {
    return {
        ventaSoles: a.ventaSoles + b.ventaSoles,
        ventaSolesIgv: a.ventaSolesIgv + b.ventaSolesIgv,
        ventaDolares: a.ventaDolares + b.ventaDolares,
        ventaDolaresIgv: a.ventaDolaresIgv + b.ventaDolaresIgv,
    };
}

// ----------------
// Contenido de modals
// ----------------

export function normalizeMaterialTipo(tipo?: string | null) {
    return (tipo ?? "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// --------------------
// Visibilidad de PDFs
// --------------------

export function asStringList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.map((item) => String(item)).filter(Boolean);
}

export function asMoActivities(value: unknown): MOActivity[] {
    if (!Array.isArray(value) || value.length === 0) {
        return createInitialMOActivities();
    }
    return value
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const raw = item as Partial<MOActivity>;
            const id = raw.id == null ? "" : String(raw.id);
            const descripcion = raw.descripcion == null ? "" : String(raw.descripcion);
            if (!id) return null;
            return {
                id,
                descripcion,
                visible: raw.visible !== false,
            };
        })
        .filter((item): item is MOActivity => item !== null);
}

export function normalizePdfVisibility(value: unknown): ReportPdfVisibility {
    const defaults = createInitialPdfVisibility();
    if (!value || typeof value !== "object") return defaults;
    const raw = value as Partial<ReportPdfVisibility>;
    return {
        hiddenEquipoIds: asStringList(raw.hiddenEquipoIds),
        hiddenMaterialIds: asStringList(raw.hiddenMaterialIds),
        showEquipmentsInPdf: Boolean(raw.showEquipmentsInPdf),
        showElectricalMaterialsInPdf: Boolean(raw.showElectricalMaterialsInPdf),
        showCanalizationMaterialsInPdf: Boolean(raw.showCanalizationMaterialsInPdf),
        showMOInPdf: Boolean(raw.showMOInPdf),
        moActivities: asMoActivities(raw.moActivities),
        enviado: Boolean(raw.enviado),
    };
}

// ---------------------
// -- Costos manuales --
// ---------------------

export function normalizeEatingItems(saved: unknown, defaults: EatingItem[]): EatingItem[] {
    if (Array.isArray(saved)) {
        return saved.length > 0 ? saved : defaults;
    }

    if (saved && typeof saved === "object" && "monto" in saved) {
        const legacy = saved as MontoItem;
        return [{
            id: crypto.randomUUID(),
            descripcion: "Alimentación",
            monto: legacy.monto ?? 0,
            personas: legacy.personas ?? 0,
            dias: legacy.dias ?? 0,
        }];
    }

    return defaults;
}

export function normalizeMontoItems(saved: unknown, defaults: MontoItem[]): MontoItem[] {
    if (Array.isArray(saved)) {
        return saved.length > 0 ? saved : defaults;
    }

    if (saved && typeof saved === "object" && "monto" in saved) {
        const legacy = saved as MontoItem;
        return [{
            id: crypto.randomUUID(),
            descripcion: legacy.descripcion || "Gastos de viaje",
            monto: legacy.monto ?? 0,
            personas: legacy.personas ?? 0,
            dias: legacy.dias ?? 0,
        }];
    }

    return defaults;
}

export function normalizeManualCosts(costs?: ManualCosts | null): ManualCosts {
    const defaults = INITIAL_MANUAL_RESOURCE_COSTS;
    const saved = costs ?? defaults;

    return {
        Recursos: {
            ...defaults.Recursos,
            ...saved.Recursos,
            consumible: Array.isArray(saved.Recursos?.consumible)
                ? saved.Recursos.consumible
                : defaults.Recursos.consumible,
            epp: Array.isArray(saved.Recursos?.epp) ? saved.Recursos.epp : defaults.Recursos.epp,
            tooling: Array.isArray(saved.Recursos?.tooling) ? saved.Recursos.tooling : defaults.Recursos.tooling,
            personal: Array.isArray(saved.Recursos?.personal) ? saved.Recursos.personal : defaults.Recursos.personal,
            sctr: Array.isArray(saved.Recursos?.sctr) ? saved.Recursos.sctr : defaults.Recursos.sctr,
            considerar_epp_reutilizable:
                saved.Recursos?.considerar_epp_reutilizable ??
                defaults.Recursos.considerar_epp_reutilizable,
            estructuras_cantidad_manual:
                saved.Recursos?.estructuras_cantidad_manual ??
                defaults.Recursos.estructuras_cantidad_manual,
            considerar_equipos_principales:
                saved.Recursos?.considerar_equipos_principales !== false,
            considerar_estructuras:
                saved.Recursos?.considerar_estructuras !== false,
            considerar_consumibles:
                saved.Recursos?.considerar_consumibles !== false,
            consumibles_ocultos: Array.isArray(saved.Recursos?.consumibles_ocultos)
                ? saved.Recursos.consumibles_ocultos.map(String)
                : [],
            orientacion: typeof saved.Recursos?.orientacion === "string"
                ? saved.Recursos.orientacion
                : undefined,
            equipos_seleccionados: saved.Recursos?.equipos_seleccionados,
            materiales_seleccionados: saved.Recursos?.materiales_seleccionados,
        },
        Viaticos: {
            ...defaults.Viaticos,
            ...saved.Viaticos,
            // eating: normalizeEatingItems(saved.Viaticos?.eating, defaults.Viaticos.eating),
            // traveling: {
            //     ...defaults.Viaticos.traveling,
            //     ...saved.Viaticos?.traveling,
            // },
            // mobility: {
            //     ...defaults.Viaticos.mobility,
            //     ...saved.Viaticos?.mobility,
            // },
            // hotel: {
            //     ...defaults.Viaticos.hotel,
            //     ...saved.Viaticos?.hotel,
            // },
            gastos_viaje: normalizeMontoItems(
                saved.Viaticos?.gastos_viaje,
                defaults.Viaticos.gastos_viaje,
            ),
            courier: saved.Viaticos?.courier?.length
                ? saved.Viaticos.courier
                : defaults.Viaticos.courier,
        },
        union: saved.union && Array.isArray(saved.union.quote_ids)
            ? {
                quote_ids: saved.union.quote_ids.map(String),
                cantidad: Number(saved.union.cantidad) || saved.union.quote_ids.length,
            }
            : undefined,
    };
}
