import { Product } from "@/lib/types/product-types";
import { TABLE_HEADERS } from "@/lib/utils/headers"
import * as XLSX from "xlsx";

/**
    * Añade la extensión apropiada al nombre de archivo.
 */
export function addExtension(name: string, fmt: string) {
    const normalized = fmt.toLowerCase();
    const ext = normalized === "csv" ? ".csv" : normalized === "xlsx" ? ".xlsx" : `.${normalized}`;
    // Si el usuario ya puso la extensión, no la duplicamos
    return name.toLowerCase().endsWith(ext) ? name : `${name}${ext}`;
}

/**
 * Transforma la lista de productos a filas (array de strings) para CSV
 */
export function productsToRows(products: Product[]) {
    const headers = TABLE_HEADERS as unknown as Array<{ key: keyof Product; label: string }>;

    // Para CSV: cada fila es un array de valores en el mismo orden que headers
    const csvRows: string[][] = products.map((p) =>
        headers.map((h) => {
            const value = p[h.key] ?? "";
            // Escape comillas y comas en CSV
            const escaped = String(value).replace(/"/g, '""');
            return escaped;
        })
    );

    // Para xlsx: usar valores crudos (no escapados) para mantener tipos
    const xlsxRows: Array<Array<string | number | null>> = products.map((p) =>
        headers.map((h) => {
            const value = p[h.key];
            if (value === null || value === undefined) return null;
            // Intenta convertir números donde corresponda
            const num = Number(value as unknown);
            return !Number.isNaN(num) && String(value).trim() !== "" ? num : String(value);
        })
    );

    return { csvRows, xlsxRows, headers };
}

/**
 * Genera una cadena CSV a partir de las filas. Incluye headers si includeHeaders=true.
 */
export function generateCSV(products: Product[], includeHeadersFlag: boolean) {
    const { csvRows, headers } = productsToRows(products);
    const lines: string[] = [];

    if (includeHeadersFlag) {
        // Encabezado con labels
        const headerLine = headers.map((h) => `"${String(h.label).replace(/"/g, '""')}"`).join(",");
        lines.push(headerLine);
    }

    // Construir cada línea escapando valores entre comillas
    csvRows.forEach((row) => {
        const line = row.map((val) => `"${val}"`).join(",");
        lines.push(line);
    });

    return lines.join("\r\n");
}

/**
 * Genera una cadena XLSX a partir de las filas. Incluye headers si includeHeaders=true.
 */

export function generateXLSX(products: Product[], includeHeadersFlag: boolean) {
    const { xlsxRows, headers } = productsToRows(products) as {
        xlsxRows: Array<Array<string | number | null>>;
        headers: Array<{ key: keyof Product; label: string }>;
    };

    const rows: Array<Array<string | number | null>> = [];
    if (includeHeadersFlag) {
        rows.push(headers.map((h) => h.label));
    }
    rows.push(...xlsxRows);

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generar un ArrayBuffer con el libro y convertirlo a Blob
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
    return new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}


/**
 * Crea un blob con el contenido y fuerza la descarga en el navegador.
 * nameWithExt debe incluir la extensión correcta.
 */
export function triggerDownload(content: string | Blob, mimeType: string, nameWithExt: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Crear enlace temporal y hacer click programático
    const a = document.createElement("a");
    a.href = url;
    a.download = nameWithExt;
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Liberar URL objeto
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Construye el archivo según formato y llama a triggerDownload.
 */
export async function prepareAndDownloadFile(products: Product[], fmt: string, 
    nameNoExt: string, includeHeadersFlag: boolean) {
    const normalizedFmt = fmt.toLowerCase();

    // Determinar nombre final con extensión
    const finalName = addExtension(nameNoExt, normalizedFmt);

    if (normalizedFmt === "csv") {
        const Content = generateCSV(products, includeHeadersFlag);
        triggerDownload(Content, "text/csv;charset=utf-8;", finalName);
    } else if (normalizedFmt === "xlsx") {
        const Content = generateXLSX(products, includeHeadersFlag);
        triggerDownload(Content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", finalName);
    } 
}