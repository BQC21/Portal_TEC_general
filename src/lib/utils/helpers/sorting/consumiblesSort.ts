function getConsumibleGroup(tipo?: string) {
    if (tipo === "PROTECCIÓN") return { order: 0, rowClass: "bg-yellow-100" };
    if (tipo === "CANALIZACIÓN" || tipo === "CABLE") return { order: 1, rowClass: "bg-blue-100" };
    return { order: 2, rowClass: "bg-green-100" }; // resto
}