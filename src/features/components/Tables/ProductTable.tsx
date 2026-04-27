import { Button2Edit } from "@/features/components/Buttons/button2edit";
import { Button2Trash } from "@/features/components/Buttons/button2trash";
import type { Product } from "@/lib/types/product-types";
import { formatDate } from "@/lib/utils/helpers";
import { TABLE_HEADERS } from "@/lib/utils/headers";

type ProductTableProps = {
    products: Product[];
    totalProducts: number;
    exchangeRate: number;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
};

function toSafeNumber(value: unknown): number {
    const parsed =
        typeof value === "number"
        ? value
        : typeof value === "string"
            ? Number(value)
            : Number.NaN;

    return Number.isFinite(parsed) ? parsed : 0;
}

function formatPen(value: unknown) {
    return `S/. ${toSafeNumber(value).toFixed(2)}`;
}

function formatUsd(value: unknown) {
    return `$ ${toSafeNumber(value).toFixed(2)}`;
}

// leer si la celda está vacía
function isEmptyCellValue(value: unknown): boolean {
    return value === null || value === undefined || (typeof value === "string" && value.trim() === "");
}
// Condicionar el coloreado de la celda
function getCellTextClass(value: unknown, filledClass = "text-slate-900"): string {
    return isEmptyCellValue(value) ? "text-slate-600" : filledClass;
}
// Mostrar el contenido
function displayCellValue(value: unknown): string {
    return isEmptyCellValue(value) ? "---" : String(value);
}

function isPriceOriginUSD(product: Product): boolean {
    return product.priceInputCurrency === "USD";
}

function getPriceCellClass(product: Product, priceValue: number): string {
    const isCellUSD = priceValue === product.priceUsd || priceValue === product.precio_dolares_igv;
    const isHighlighted = isCellUSD ? isPriceOriginUSD(product) : !isPriceOriginUSD(product);

    return isHighlighted ? "font-semibold text-slate-950" : "text-slate-700";
}

export function ProductTable({ products, totalProducts, exchangeRate, onUpdateProduct, onDeleteProduct }: ProductTableProps) {
    return (
        <section className="space-y-4 w-full">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
                <thead>
                <tr className="bg-slate-100 text-left">
                    {TABLE_HEADERS.map((header) => (
                    <th
                        key={header}
                        className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"
                    >
                        {header}
                    </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {products.length > 0 ? (
                    products.map((product) => (
                    <tr key={product.id} className="bg-white">
                        <td className={`px-4 py-5 ${getCellTextClass(product.ruc, "text-slate-800")}`}>{displayCellValue(product.ruc)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.supplierCode, "text-slate-500")}`}>{displayCellValue(product.supplierCode)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.supplier, "text-slate-800")}`}>{displayCellValue(product.supplier)}</td>
                        <td className={`px-4 py-5 font-medium ${getCellTextClass(product.code)}`}>{displayCellValue(product.code)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.type)}`}>{displayCellValue(product.type)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.brand)}`}>{displayCellValue(product.brand)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.description)}`}>{displayCellValue(product.description)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.connectionType)}`}>{displayCellValue(product.connectionType)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.maxPower)}`}>{displayCellValue(product.maxPower)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.mpptNumber)}`}>{displayCellValue(product.mpptNumber)}</td>
                        {/*<td className={`px-4 py-5 ${getCellTextClass(product.dod)}`}>{displayCellValue(product.dod)}</td>
                        {/* <td className={`px-4 py-5 ${getCellTextClass(product.beta_percent)}`}>{displayCellValue(product.beta_percent)}</td>
                        {/* <td className={`px-4 py-5 ${getCellTextClass(product.arraysPerMppt)}`}>{displayCellValue(product.arraysPerMppt)}</td> */}
                        <td className={`px-4 py-5 ${getCellTextClass(product.potenciaAC)}`}>{displayCellValue(product.potenciaAC)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.voc)}`}>{displayCellValue(product.voc)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.vmpp)}`}>{displayCellValue(product.vmpp)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.isc)}`}>{displayCellValue(product.isc)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.impp)}`}>{displayCellValue(product.impp)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.panel_array)}`}>{displayCellValue(product.panel_array)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.panel_area)}`}>{displayCellValue(product.panel_area)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.powerSource)}`}>{displayCellValue(product.powerSource)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.priceInputCurrency)}`}>{displayCellValue(product.priceInputCurrency)}</td>
                        <td className={`px-4 py-5 ${getPriceCellClass(product, product.pricePen)}`}>{formatPen(product.pricePen)}</td>
                        <td className={`px-4 py-5 ${getPriceCellClass(product, product.priceUsd)}`}>{formatUsd(product.priceUsd)}</td>
                        <td className={`px-4 py-5 ${getPriceCellClass(product, product.precio_soles_igv)}`}>{formatPen(product.precio_soles_igv)}</td>
                        <td className={`px-4 py-5 ${getPriceCellClass(product, product.precio_dolares_igv)}`}>{formatUsd(product.precio_dolares_igv)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.fecha_creada)}`}>{formatDate(product.fecha_creada)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.fecha_actualizada)}`}>{formatDate(product.fecha_actualizada)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.estado_equipo)}`}>{displayCellValue(product.estado_equipo)}</td>
                        <td className={`px-4 py-5 ${getCellTextClass(product.fecha_estimada_importacion)}`}>{formatDate(product.fecha_estimada_importacion)}</td>

                        <td className="px-4 py-5">
                            <div className="flex items-center gap-4 text-slate-500">
                                <Button2Edit
                                    product={product}
                                    exchangeRate={exchangeRate}
                                    onUpdateProduct={onUpdateProduct}
                                />
                                <Button2Trash 
                                    product={product}
                                    onDeleteProduct={onDeleteProduct}
                                />
                            </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr className="bg-white">
                        <td colSpan={TABLE_HEADERS.length} className="px-4 py-10 text-center text-slate-500">
                            No hay productos registrados todavía.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
        <p className="text-lg text-slate-500">
            Mostrando {products.length} de {totalProducts} productos
        </p>
        <p className="text-lg text-slate-500">
            <strong>Nota:</strong> Los campos donde tengan barritas representan que no corresponden según el tipo de producto. 
        </p>
        </section>
    );
}