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
    // en caso exista un proyecto asociado
    const projectName = quote.proyecto_info?.nombre?.trim();
    if (projectName) return projectName;
    // en caso es una cotización unida o independiente y tiene nombre
    const custom = quote.nombre_cotizacion?.trim();
    if (custom) return custom;
    // en caso es una cotización independiente y NO tiene nombre 
    return "---";
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
    proyecto_info?: { nombre?: string };
    nombre_cotizacion?: string | null;
}) {
    return `(${quote.cod_cotizacion ?? ""}) - ${quoteAssociatedLabel(quote)}`;
}