import type { Product, ProductFormData } from "@/lib/types/supabase/product-types";
import * as XLSX from "xlsx-js-style";

type ExportCellValue = string | number | null;

const EXPORT_COLUMNS: Array<{ key: keyof ProductFormData; label: string }> = [
    { key: "ruc", label: "RUC" },
    { key: "proveedor", label: "Proveedor" },
    { key: "cod_prov", label: "Código Proveedor" },
    { key: "codigo", label: "Código" },
    { key: "tipo", label: "Tipo" },
    { key: "marca", label: "Marca" },
    { key: "unidad", label: "Unidad" },
    { key: "descripcion", label: "Descripción" },
    { key: "tipo_conexion_bateria", label: "Tipo de conexión de la batería" },
    { key: "dod", label: "DoD (%)" },
    { key: "amperaje_bateria", label: "Amperaje de la batería" },
    { key: "voltaje_bateria", label: "Voltaje de la batería" },
    { key: "panel_array", label: "Nro. paneles por estructura" },
    { key: "tipo_conexion_inversor", label: "Tipo de Conexión del inversor" },
    { key: "potencia_dc_inversor", label: "Potencia DC Máxima del inversor (KW)" },
    { key: "potencia_ac_inversor", label: "Potencia AC por inversor (KW)" },
    { key: "mppt", label: "Número de MPPT" },
    { key: "i_entrada_inversor", label: "Corriente de entrada del inversor (A)" },
    { key: "i_salida_inversor", label: "Corriente de salida del inversor (A)" },
    { key: "voltaje_minimo_inversor", label: "Voltaje mínimo del inversor (V)" },
    { key: "voltaje_maximo_inversor", label: "Voltaje máximo del inversor (V)" },
    { key: "potencia_modulo", label: "Potencia del módulo fotovoltaico" },
    { key: "voc", label: "VOC (V)" },
    { key: "vmpp", label: "VMPP (V)" },
    { key: "isc", label: "ISC (A)" },
    { key: "impp", label: "IMPP (A)" },
    { key: "panel_area", label: "Área por módulo" },
    { key: "tipo_conexion_smartmeter", label: "Tipo de conexión del smart meter" },
    { key: "fuente_electrica", label: "Fuente eléctrica" },
    { key: "priceInputCurrency", label: "Fuente de divisas" },
    { key: "precio_soles", label: "Precio S/." },
    { key: "precio_dolares", label: "Precio $" },
    { key: "precio_soles_igv", label: "Precio S/. con IGV" },
    { key: "precio_dolares_igv", label: "Precio $ con IGV" },
    { key: "created_at", label: "Fecha creada" },
    { key: "updated_at", label: "Fecha actualizada" },
    { key: "estado_equipo", label: "Estado del equipo" },
    { key: "fecha_estimada_importacion", label: "Fecha estimada de importación" },
];

/**
    * Añade la extensión apropiada al nombre de archivo.
 */
export function addExtension(name: string, fmt: string) {
    const normalized = fmt.toLowerCase();
    const ext = normalized === "csv" ? ".csv" : normalized === "xlsx" ? ".xlsx" : `.${normalized}`;
    // Si el usuario ya puso la extensión, no la duplicamos
    return name.toLowerCase().endsWith(ext) ? name : `${name}${ext}`;
}

function formatExportCell(value: unknown): ExportCellValue {
    // Si es nulo o indefinido
    if (value === null || value === undefined || value === "---") {
        return "---";
    }

    if (typeof value === "string" && value.trim() === "") {
        return "---";
    }

    // Si es fecha
    if (value instanceof Date) {
        return value.toISOString().split("T")[0];
    }

    return String(value);
}

function computeColumnWidths(rows: ExportCellValue[][], headers: string[]) {
    return headers.map((header, columnIndex) => {
        const maxCellLength = rows.reduce((maxLength, row) => {
            const cellValue = row[columnIndex];
            const cellLength = cellValue === null ? 3 : String(cellValue).length;
            return Math.max(maxLength, cellLength);
        }, header.length);

        return { wch: Math.min(maxCellLength + 2, 40) };
    });
}

function applyHeaderStyle(worksheet: XLSX.WorkSheet, headers: string[]) {
    headers.forEach((_, columnIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: columnIndex });
        const cell = worksheet[cellAddress];

        if (cell) {
            cell.s = {
                fill: { patternType: "solid", fgColor: { rgb: "1F4E78" } },
                font: { bold: true, color: { rgb: "FFFFFF" } },
                alignment: { horizontal: "center", vertical: "center" },
            };
        }
    });
}

/**
 * Transforma la lista de productos a filas exportables con los campos reales de ProductFormData.
 */
export function productsToRows(products: Product[]) {
    const headers = EXPORT_COLUMNS; // encabezados

    const rows: ExportCellValue[][] = products.map((product) =>
        headers.map((column) => formatExportCell(product[column.key]))
    ); // construir filas

    return { rows, headers };
}

/**
 * Genera una cadena CSV a partir de las filas. Incluye headers si includeHeaders=true.
 */
export function generateCSV(products: Product[], includeHeadersFlag: boolean) {
    const { rows, headers } = productsToRows(products);

    // construye la tabla para exportar
    const aoaRows: ExportCellValue[][] = includeHeadersFlag
        ? [headers.map((column) => column.label), ...rows]
        : rows;

    const worksheet = XLSX.utils.aoa_to_sheet(aoaRows); // convierte a hoja de datos
    return XLSX.utils.sheet_to_csv(worksheet); // convierte a CSV
}

/**
 * Genera una cadena XLSX a partir de las filas. Incluye headers si includeHeaders=true.
 */

export function generateXLSX(products: Product[], includeHeadersFlag: boolean) {
    const { rows, headers } = productsToRows(products);

    const workbookRows: ExportCellValue[][] = includeHeadersFlag
        ? [headers.map((column) => column.label), ...rows]
        : rows;

    const worksheet = XLSX.utils.aoa_to_sheet(workbookRows); // convierte a hoja de datos

    if (includeHeadersFlag) {
        applyHeaderStyle(worksheet, headers.map((column) => column.label));
    }

    worksheet["!cols"] = computeColumnWidths(rows, headers.map((column) => column.label));

    const workbook = XLSX.utils.book_new(); // crea el workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // inserte el worksheet dentro del workbook

    // Generar un ArrayBuffer con el libro y convertirlo a Blob
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true }) as ArrayBuffer;
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