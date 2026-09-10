export function isQuoteLinkedToProject(quote: {
    proyecto_id?: string | null;
    proyecto_info?: { id?: string } | null;
}) {
    return Boolean(quote.proyecto_id) || Boolean(quote.proyecto_info?.id);
}
export function quoteAssociatedLabel(quote: {
    proyecto_info?: { nombre?: string };
    nombre_cotizacion?: string | null;
}) {
    // en caso exista un proyecto asociado
    const projectName = quote.proyecto_info?.nombre?.trim();
    if (projectName) return projectName;
    // en caso es una cotización independiente y tiene nombre
    const custom = quote.nombre_cotizacion?.trim();
    if (custom) return custom;
    // en caso es una cotización independiente y NO tiene nombre 
    return "---";
}