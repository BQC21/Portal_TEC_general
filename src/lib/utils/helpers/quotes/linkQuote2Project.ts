export function isQuoteLinkedToProject(quote: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string } | null;
}) {
    return Boolean(quote.proyecto_id) || Boolean(quote.proyecto_info?.id);
}
export function quoteAssociatedLabel(quote: {
    proyecto_info?: { nombre?: string };
    nombre?: string | null;
}) {
    const projectName = quote.proyecto_info?.nombre?.trim();
    if (projectName) return projectName;
    const custom = quote.nombre?.trim();
    if (custom) return custom;
    return "---";
}