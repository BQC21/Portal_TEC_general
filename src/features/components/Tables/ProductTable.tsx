import { Button2Edit } from "@/features/components/Buttons/button2edit";
import { Button2Trash } from "@/features/components/Buttons/button2trash";
import type { Product } from "@/features/types/product-types";

const TABLE_HEADERS = [
    "Código Proveedor",
    "Proveedor",
    "Código",
    "Tipo",
    "Marca",
    "Descripción",
    "Tipo de Conexión",
    "Potencia Máxima (KW)",
    "Número de MPPT",
    "DoD (%)",
    "Arrays por MPPT",
    "VOC (V)",
    "VMPP (V)",
    "ISC (A)",
    "IMPP (A)",
    "Fuente eléctrica",
    "Precio S/.",
    "Precio $",
    "Precio S/. con IGV",
    "Precio $ con IGV",
    "Acciones",
];

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

export function ProductTable({ products, totalProducts, exchangeRate, onUpdateProduct, onDeleteProduct }: ProductTableProps) {
    return (
        <section className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
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
                        <td className="px-4 py-5 text-slate-500">{product.supplierCode || "-"}</td>
                        <td className="px-4 py-5 text-slate-800">{product.supplier}</td>
                        <td className="px-4 py-5 font-medium text-slate-900">{product.code}</td>
                        <td className="px-4 py-5 text-slate-900">{product.type}</td>
                        <td className="px-4 py-5 text-slate-900">{product.brand}</td>
                        <td className="px-4 py-5 text-slate-900">{product.description}</td>
                        <td className="px-4 py-5 text-slate-900">{product.connectionType}</td>
                        <td className="px-4 py-5 text-slate-900">{product.maxPower}</td>
                        <td className="px-4 py-5 text-slate-900">{product.mpptNumber}</td>
                        <td className="px-4 py-5 text-slate-900">{product.dod}</td>
                        <td className="px-4 py-5 text-slate-900">{product.arraysPerMppt}</td>
                        <td className="px-4 py-5 text-slate-900">{product.voc}</td>
                        <td className="px-4 py-5 text-slate-900">{product.vmpp}</td>
                        <td className="px-4 py-5 text-slate-900">{product.isc}</td>
                        <td className="px-4 py-5 text-slate-900">{product.impp}</td>
                        <td className="px-4 py-5 text-slate-900">{product.powerSource}</td>
                        <td className="px-4 py-5 text-slate-900">{formatPen(product.pricePen)}</td>
                        <td className="px-4 py-5 text-slate-900">{formatUsd(product.priceUsd)}</td>
                        <td className="px-4 py-5 text-slate-900">{formatPen(product.precio_soles_igv)}</td>
                        <td className="px-4 py-5 text-slate-900">{formatUsd(product.precio_dolares_igv)}</td>
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
        </section>
    );
}