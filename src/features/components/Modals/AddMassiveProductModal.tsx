"use client";

import { useState } from "react";
import { AddProductCloseIcon } from "../Icons/AddProductCloseIcon";
import { ProductFormData } from "@/lib/types/product-types";
import {
    parseExcelFile,
    type ExcelParseResult,
} from "@/lib/utils/excelParser";

// --- Tipo de variables ---
type AddMassiveProductModalProps = {
    onMassiveAddProduct: (products: ProductFormData[]) => Promise<void>;
    isMassiveUploading?: boolean;
    onClose: () => void;
};

type ModalStep = "file-selection" | "preview" | "confirming";

export function AddMassiveProductModal({
    onMassiveAddProduct,
    isMassiveUploading = false,
    onClose,
}: AddMassiveProductModalProps) {
  const [step, setStep] = useState<ModalStep>("file-selection");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ExcelParseResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParseError(null);
    setIsParsing(true);

    try {
      const result = await parseExcelFile(file);
      setParseResult(result);
      if (result.products.length > 0) {
        setStep("preview");
      } else {
        setParseError("No se encontraron productos válidos en el archivo.");
      }
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Error desconocido al procesar el archivo"
      );
    } finally {
      setIsParsing(false);
    }
  }

  async function handleConfirmUpload() {
    if (!parseResult || parseResult.products.length === 0) {
      return;
    }

    try {
      await onMassiveAddProduct(parseResult.products);
      setStep("file-selection");
      setSelectedFile(null);
      setParseResult(null);
      setParseError(null);
    } catch (error) {
      setParseError(
        error instanceof Error
          ? error.message
          : "Error al subir los productos"
      );
    }
  }

  function handleReset() {
    setStep("file-selection");
    setSelectedFile(null);
    setParseResult(null);
    setParseError(null);
  }

  // ====== STEP 1: FILE SELECTION ======
  if (step === "file-selection") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[95vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Subida masiva de productos
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Cerrar modal"
            >
              <AddProductCloseIcon />
            </button>
          </div>

          <div className="flex flex-col gap-6 px-6 py-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">
                Paso 1: Selecciona el archivo Excel
              </h3>
              <p className="text-sm text-slate-600">
                Nombre esperado:{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                  COT_7kW_GOODWE_CATAPA_CHICLAYO_XXXXXXX.xlsx
                </code>
              </p>
              <p className="text-sm text-slate-600">
                El archivo debe contener las hojas:{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                  EQUIPOS PRINCIPALES PRECIOS
                </code>{" "}
                y{" "}
                <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                  MATERIALES ELÉCTRICOS PRECIOS
                </code>
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                disabled={isParsing}
                className="hidden"
                id="excel-file-input"
              />
              <label
                htmlFor="excel-file-input"
                className="cursor-pointer block"
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">
                    {isParsing
                      ? "Procesando archivo..."
                      : "Arrastra el archivo aquí o haz clic"}
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-emerald-600 font-medium">
                      ✓ {selectedFile.name}
                    </p>
                  )}
                </div>
              </label>
            </div>

            {parseError && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-sm font-semibold text-red-700">Error:</p>
                <p className="text-sm text-red-600">{parseError}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 px-6 py-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isParsing}
              className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====== STEP 2: PREVIEW ======
  if (step === "preview" && parseResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
        <div className="max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Paso 2: Previsualización
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Cerrar modal"
            >
              <AddProductCloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Resumen */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold">Total de filas</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {parseResult.totalRows}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-600 font-semibold">Válidas</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {parseResult.validRows}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <p className="text-sm text-red-600 font-semibold">Inválidas</p>
                  <p className="text-2xl font-bold text-red-900">
                    {parseResult.invalidRows}
                  </p>
                </div>
              </div>

              {/* Errores detallados */}
              {parseResult.errorDetails.length > 0 && (
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                  <h3 className="text-sm font-semibold text-amber-900 mb-3">
                    Filas con errores ({parseResult.errorDetails.length}):
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {parseResult.errorDetails.map((detail) => (
                      <div
                        key={`error-${detail.rowNumber}`}
                        className="text-xs text-amber-800 bg-white rounded p-2 border border-amber-100"
                      >
                        <p className="font-semibold">Fila {detail.rowNumber}:</p>
                        <ul className="list-disc pl-4 mt-1">
                          {detail.errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Productos válidos */}
              {parseResult.products.length > 0 && (
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Primeras 5 filas válidas:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200">
                          <th className="px-2 py-2 text-left">Código</th>
                          <th className="px-2 py-2 text-left">Proveedor</th>
                          <th className="px-2 py-2 text-left">Tipo</th>
                          <th className="px-2 py-2 text-left">Marca</th>
                          <th className="px-2 py-2 text-left">Descripción</th>
                          <th className="px-2 py-2 text-right">Precio ($)</th>
                          <th className="px-2 py-2 text-left">Moneda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.products.slice(0, 5).map((product, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50"
                            }
                          >
                            <td className="px-2 py-2">{product.code}</td>
                            <td className="px-2 py-2">
                              {product.supplier.substring(0, 15)}...
                            </td>
                            <td className="px-2 py-2">{product.type}</td>
                            <td className="px-2 py-2">{product.brand}</td>
                            <td className="px-2 py-2 max-w-xs truncate">
                              {product.description.substring(0, 20)}...
                            </td>
                            <td className="px-2 py-2 text-right">
                              {product.priceUsd.toFixed(2)}
                            </td>
                            <td className="px-2 py-2">
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                  product.priceInputCurrency === "USD"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {product.priceInputCurrency}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parseResult.products.length > 5 && (
                      <p className="text-xs text-slate-600 mt-2">
                        ... y {parseResult.products.length - 5} más
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 px-6 py-6">
            <button
              type="button"
              onClick={handleReset}
              disabled={isMassiveUploading}
              className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cambiar archivo
            </button>
            <button
              type="button"
              onClick={handleConfirmUpload}
              disabled={isMassiveUploading || parseResult.products.length === 0}
              className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isMassiveUploading
                ? "Subiendo..."
                : `Confirmar subida (${parseResult.products.length} productos)`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}