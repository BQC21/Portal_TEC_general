import { formatVersionLabel } from "@/lib/utils/helpers/manage_info/version";
import { isUnitedQuote } from "@/lib/utils/helpers/quotes/unitedQuotes";

export function isQuoteLinkedToProject(quote: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string } | null;
}) {
    return Boolean(quote.proyecto_id) || Boolean(quote.proyecto_info?.id);
}
export function quoteAssociatedLabel(quote?: {
    proyecto_info?: { nombre?: string } | null;
    nombre_cotizacion?: string | null;
} | null) {
    if (!quote) return "---";
    const custom = quote.nombre_cotizacion?.trim();
    if (custom) return custom;
    const projectName = quote.proyecto_info?.nombre?.trim();
    if (projectName) return projectName;
    return "---";
}

export type QuoteIndependence = "independiente" | "unidas" | "asociado";

export function quoteIndependence(quote?: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string; nombre?: string } | null;
    nombre_cotizacion?: string | null;
    costos_manuales?: { union?: { quote_ids?: string[] } } | null;
} | null): QuoteIndependence {
    if (isUnitedQuote(quote)) return "unidas";
    if (!isQuoteLinkedToProject(quote ?? {})) return "independiente";
    return "asociado";
}

export function defaultQuoteOrientation(quote?: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string; nombre?: string; angulo?: string | null } | null;
    nombre_cotizacion?: string | null;
    costos_manuales?: { union?: { quote_ids?: string[] } } | null;
} | null) {
    if (quoteIndependence(quote) !== "asociado") return "---";
    const angle = quote?.proyecto_info?.angulo?.trim();
    return angle || "---";
}

export function quoteIndependenceLabel(quote?: Parameters<typeof quoteIndependence>[0]) {
    const kind = quoteIndependence(quote);
    if (kind === "unidas") return "Cotizaciones unidas";
    if (kind === "independiente") return "Independiente";
    return "Asociado";
}

export function resolvedQuoteName(quote?: {
    proyecto_info?: { nombre?: string } | null;
    nombre_cotizacion?: string | null;
} | null) {
    return quoteAssociatedLabel(quote).replace(/^---$/, "");
}

export function quoteHeadingLabel(quote?: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string; nombre?: string } | null;
    nombre_cotizacion?: string | null;
    costos_manuales?: { union?: { quote_ids?: string[] } } | null;
} | null) {
    const name = quoteAssociatedLabel(quote);
    if (isUnitedQuote(quote)) {
        return name !== "---" ? `Cotizaciones unidas --- ${name}` : "Cotizaciones unidas";
    }
    if (!isQuoteLinkedToProject(quote ?? {})) {
        return name !== "---" ? `Cotización independiente --- ${name}` : "Cotización independiente";
    }
    return `Proyecto --- ${name}`;
}

export function quoteOptionLabel(quote: {
    cod_cotizacion?: string | null;
    proyecto_info?: { nombre?: string } | null;
    nombre_cotizacion?: string | null;
}) {
    return `(${quote.cod_cotizacion ?? ""}) - ${quoteAssociatedLabel(quote)}`;
}

export function quoteReportOptionLabel(quote: {
    cod_cotizacion?: string | null;
    proyecto_id?: string | null;
    proyecto_info?: { id?: string; nombre?: string; version?: string | null } | null;
    nombre_cotizacion?: string | null;
    version?: string | null;
}) {
    const version = isQuoteLinkedToProject(quote)
        ? quote.proyecto_info?.version
        : quote.version;
    return `${quoteOptionLabel(quote)} - ${formatVersionLabel(version)}`;
}