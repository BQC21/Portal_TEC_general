import * as XLSX from "xlsx";
import { ProductFormData, CurrencyCode } from "@/lib/types/product-types";

// Mapeo de columnas Excel a campos ProductFormData
const COLUMN_MAPPING: Record<string, keyof ProductFormData> = {
    "COD PROV": "supplierCode",
    "PROVEEDOR": "supplier",
    "COD PRODUCTO": "code",
    "TIPO DE PRODUCTO": "type",
    "MARCA": "brand",
    "DESCRIPCIÓN": "description",
    "TIPO DE CONEXIÓN": "connectionType",
    "POTENCIA MÁXIMA": "maxPower",
    "# DE MPPT": "mpptNumber",
    "POTENCIA AC": "potenciaAC",
    "VOC/VMAX": "voc",
    "VMPP/VMIN": "vmpp",
    "ISC/IMAX IN": "isc",
    "IMPP/IMAX OUT": "impp",
    "UNIDAD": "unit",
    "PRECIO S/": "pricePen",
    "PRECIO $": "priceUsd",
    "IGV": "igv",
    "PRECIO + IGV S/": "precio_soles_igv",
    "PRECIO + IGV $": "precio_dolares_igv",
    "PARTE ELÉCTRICA": "powerSource",
};

// Hojas esperadas del Excel
const EXPECTED_SHEETS = [
    "EQUIPOS PRINCIPALES PRECIOS",
    "MATERIALES ELÉCTRICOS PRECIOS",
];

export interface ParsedRow {
  isValid: boolean;
  product?: ProductFormData;
  errors: string[];
  rowNumber: number;
}

export interface ExcelParseResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  products: ProductFormData[];
  errorDetails: ParsedRow[];
}

/**
 * Detecta la moneda según el color de la celda de precio en dólares
 * Si la celda tiene color distinto de blanco, es USD; si no, es PEN
 */
function detectPriceCurrency(
  worksheet: XLSX.WorkSheet,
  cellRef: string
): CurrencyCode {
  const cell = worksheet[cellRef];
  if (!cell) return "PEN";

  // Revisar si la celda tiene fill/color (distinto de blanco o sin color)
  if (cell.s?.fill?.fgColor || cell.s?.fill?.patternType) {
    return "USD";
  }

  return "PEN";
}

/**
 * Parsea una fila del Excel y la convierte en ProductFormData
 */
function parseRow(
  row: Record<string, unknown>,
  rowIndex: number,
  worksheet: XLSX.WorkSheet,
  headerMap: Record<string, string>
): ParsedRow {
  const errors: string[] = [];
  const parsed: Partial<ProductFormData> = {
    fecha_creada: new Date(),
    fecha_actualizada: new Date(),
    estado_equipo: "En stock", // Forzado por regla
    fecha_estimada_importacion: null, // Forzado por regla
  };

  // Mapear columnas
  for (const [excelCol, productField] of Object.entries(COLUMN_MAPPING)) {
    const value = row[excelCol];

    if (value === undefined || value === null || value === "") {
      // Campos opcionales que pueden estar vacíos
      if (
        ![
          "connectionType",
          "potenciaAC",
          "dod",
          "arraysPerMppt",
          "beta_percent",
        ].includes(productField as string)
      ) {
        if (
          [
            "supplierCode",
            "supplier",
            "code",
            "type",
            "brand",
            "description",
            "unit",
          ].includes(productField as string)
        ) {
          errors.push(`Campo obligatorio faltante: ${excelCol}`);
        }
      }
      continue;
    }

    // Asignar según tipo de campo
    if (
      [
        "pricePen",
        "priceUsd",
        "igv",
        "precio_soles_igv",
        "precio_dolares_igv",
      ].includes(productField as string)
    ) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push(`${excelCol} debe ser número, recibido: ${value}`);
      } else {
        (parsed as Record<string, unknown>)[productField] = numValue;
      }
    } else if (
      [
        "maxPower",
        "mpptNumber",
        "voc",
        "vmpp",
        "isc",
        "impp",
        "potenciaAC",
      ].includes(productField as string)
    ) {
      // Campos técnicos numéricos
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        (parsed as Record<string, unknown>)[productField] = numValue.toString();
      }
    } else {
      // Campos de texto
      (parsed as Record<string, unknown>)[productField] = String(value).trim();
    }
  }

  // Detectar moneda por color de celda (PRECIO $)
  const priceUsdColIndex = Object.keys(headerMap).indexOf("PRECIO $");
  if (priceUsdColIndex !== -1) {
    const cellRef = XLSX.utils.encode_cell({
      r: rowIndex,
      c: priceUsdColIndex,
    });
    const currency = detectPriceCurrency(worksheet, cellRef);
    parsed.priceInputCurrency = currency;
  } else {
    parsed.priceInputCurrency = "PEN"; // Default
  }

  // Validar campos mínimos
  if (!parsed.supplier) errors.push("Falta: PROVEEDOR");
  if (!parsed.code) errors.push("Falta: COD PRODUCTO");
  if (!parsed.type) errors.push("Falta: TIPO DE PRODUCTO");
  if (!parsed.brand) errors.push("Falta: MARCA");
  if (!parsed.description) errors.push("Falta: DESCRIPCIÓN");

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      rowNumber: rowIndex + 2, // +2 porque row 0 es header, +1 para mostrar en 1-based
    };
  }

  // Asignar RUC dummy si falta (será completado por regla de negocio)
  if (!parsed.ruc) {
    parsed.ruc = "";
  }

  return {
    isValid: true,
    product: parsed as ProductFormData,
    errors: [],
    rowNumber: rowIndex + 2,
  };
}

/**
 * Parsea un archivo Excel y retorna productos válidos
 */
export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const result: ExcelParseResult = {
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    products: [],
    errorDetails: [],
  };

  // Validar nombre de archivo
  if (!file.name.startsWith("COT_7kW_GOODWE_CATAPA_CHICLAYO")) {
    throw new Error(
      "El archivo debe ser: COT_7kW_GOODWE_CATAPA_CHICLAYO_XXXXXXX.xlsx"
    );
  }

  try {
    // Leer archivo
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { cellFormula: true, cellStyles: true });

    // Procesar cada hoja esperada
    for (const sheetName of EXPECTED_SHEETS) {
      if (!workbook.SheetNames.includes(sheetName)) {
        console.warn(`Hoja no encontrada: ${sheetName}`);
        continue;
      }

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      // Convertir a JSON con encabezados
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (
        | string[]
        | unknown[]
      )[];

      if (data.length < 2) {
        continue; // Sin datos
      }

      // Extraer encabezados (primera fila)
      const headers = data[0] as string[];
      const headerMap: Record<string, string> = {};
      for (let i = 0; i < headers.length; i++) {
        headerMap[headers[i]?.trim() || ""] = i.toString();
      }

      // Procesar datos (desde fila 2)
      for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const rowData = data[rowIndex];
        if (!Array.isArray(rowData)) continue;

        // Construir objeto de fila usando encabezados
        const rowObj: Record<string, unknown> = {};
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
          const headerName = (headers[colIndex] || "").trim();
          rowObj[headerName] = rowData[colIndex];
        }

        // Saltar filas vacías
        if (Object.values(rowObj).every((v) => v === undefined || v === null || v === "")) {
          continue;
        }

        result.totalRows++;

        // Parsear fila
        const parsed = parseRow(rowObj, rowIndex, worksheet, headerMap);
        if (parsed.isValid && parsed.product) {
          result.validRows++;
          result.products.push(parsed.product);
        } else {
          result.invalidRows++;
          result.errorDetails.push(parsed);
        }
      }
    }

    return result;
  } catch (error) {
    throw new Error(
      `Error al parsear Excel: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
