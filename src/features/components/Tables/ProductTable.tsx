import { Button2Edit } from "@/features/components/Buttons/button2edit";
import { Button2Trash } from "@/features/components/Buttons/button2trash";

import type { Product } from "@/lib/types/product-types";

import { TABLE_HEADERS } from "@/lib/utils/headers";
import { formatDate, toSafeNumber, formatPen, formatUsd,
    isEmptyCellValue, getCellTextClass, displayCellValue, 
    isPriceOriginUSD, getPriceCellClass
} from "@/lib/utils/helpers";

import { sortGroupedByCodeSupplier } from "@/lib/utils/renders";

type ProductTableProps = {
    products: Product[];
    totalProducts: number;
    exchangeRate: number;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: string) => void;
};

export function ProductTable({ products, totalProducts, exchangeRate, onUpdateProduct, onDeleteProduct }: ProductTableProps) {
    // Ordenar productos por código de proveedor
    const sortedProducts = sortGroupedByCodeSupplier(products, "cod_prov");
    
    return (
        <section className="space-y-4 w-full">
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="min-w-full w-max border-separate border-spacing-0">
                        <colgroup>
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[180px]" />
                            <col className="w-[140px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[260px]" />
                            <col className="w-[140px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[120px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[140px]" />
                            <col className="w-[110px]" />
                        </colgroup>
                    <thead className="sticky top-0 z-10 bg-slate-100">
                        <tr className="bg-slate-200 text-center">
                            <th colSpan={7} className="border border-slate-300 px-4 py-5">Propiedades generales</th>
                            <th colSpan={4} className="border border-slate-300 px-4 py-5">Propiedades Batería</th>
                            <th colSpan={1} className="border border-slate-300 px-4 py-5">Propiedades Estructura</th>
                            <th colSpan={7} className="border border-slate-300 px-4 py-5">Propiedades Inversor</th>
                            <th colSpan={6} className="border border-slate-300 px-4 py-5">Propiedades Módulo fotovoltaico</th>
                            <th colSpan={1} className="border border-slate-300 px-4 py-5">Propiedades Smart meter</th>
                            <th colSpan={1} className="border border-slate-300 px-4 py-5">Propiedades Cableado</th>
                            <th colSpan={5} className="border border-slate-300 px-4 py-5">Precios</th>
                            <th colSpan={2} className="border border-slate-300 px-4 py-5">Fechas</th>
                            <th colSpan={2} className="border border-slate-300 px-4 py-5">Estado del producto</th>
                            <th></th>
                        </tr>
                        <tr className="bg-slate-100 text-left">
                            {TABLE_HEADERS.map((header) => (
                            <th
                                key={header}
                                className="border border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900"
                            >
                                {header}
                            </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map((product) => (
                        <tr key={product.id} className="bg-white">
                            {/* propiedades generales */}
                            <td className={`border border-slate-200 px-4 py-5 font-medium ${getCellTextClass(product.codigo)}`}>{displayCellValue(product.codigo)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.ruc, "text-slate-800")}`}>{displayCellValue(product.ruc)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.cod_prov, "text-slate-500")}`}>{displayCellValue(product.cod_prov)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.proveedor, "text-slate-800")}`}>{displayCellValue(product.proveedor)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo)}`}>{displayCellValue(product.tipo)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.marca)}`}>{displayCellValue(product.marca)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.descripcion)}`}>{displayCellValue(product.descripcion)}</td>
                            {/* propiedades de la batería */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_conexion_bateria)}`}>{displayCellValue(product.tipo_conexion_bateria)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.dod)}`}>{displayCellValue(product.dod)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.amperaje_bateria)}`}>{displayCellValue(product.amperaje_bateria)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.voltaje_bateria)}`}>{displayCellValue(product.voltaje_bateria)}</td>
                            {/* propiedades de la estructura */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.panel_array)}`}>{displayCellValue(product.panel_array)}</td>                            
                            {/* propiedades del inversor */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_conexion_inversor)}`}>{displayCellValue(product.tipo_conexion_inversor)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.potencia_dc_inversor)}`}>{displayCellValue(product.potencia_dc_inversor)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.potencia_ac_inversor)}`}>{displayCellValue(product.potencia_ac_inversor)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.mppt)}`}>{displayCellValue(product.mppt)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.i_entrada_inversor)}`}>{displayCellValue(product.i_entrada_inversor)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.i_salida_inversor)}`}>{displayCellValue(product.i_salida_inversor)}</td>                            
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.voltaje_maximo_inversor)}`}>{displayCellValue(product.voltaje_maximo_inversor)}</td>                                                        
                            {/* propiedades del modulo */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.potencia_modulo)}`}>{displayCellValue(product.potencia_modulo)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.voc)}`}>{displayCellValue(product.voc)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.vmpp)}`}>{displayCellValue(product.vmpp)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.isc)}`}>{displayCellValue(product.isc)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.impp)}`}>{displayCellValue(product.impp)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.panel_area)}`}>{displayCellValue(product.panel_area)}</td>                                                                                    
                            {/* propiedades del smart meter */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.tipo_conexion_smartmeter)}`}>{displayCellValue(product.tipo_conexion_smartmeter)}</td>                                                                                    
                            {/* propiedades del cableado */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.fuente_electrica)}`}>{displayCellValue(product.fuente_electrica)}</td>
                            {/* precios */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.priceInputCurrency)}`}>{displayCellValue(product.priceInputCurrency)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getPriceCellClass(product, product.precio_soles)}`}>{formatPen(product.precio_soles)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getPriceCellClass(product, product.precio_dolares)}`}>{formatUsd(product.precio_dolares)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getPriceCellClass(product, product.precio_soles_igv)}`}>{formatPen(product.precio_soles_igv)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getPriceCellClass(product, product.precio_dolares_igv)}`}>{formatUsd(product.precio_dolares_igv)}</td>
                            {/* fechas */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.created_at)}`}>{formatDate(product.created_at)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.updated_at)}`}>{formatDate(product.updated_at)}</td>
                            {/* estados */}
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.estado_equipo)}`}>{displayCellValue(product.estado_equipo)}</td>
                            <td className={`border border-slate-200 px-4 py-5 ${getCellTextClass(product.fecha_estimada_importacion)}`}>{formatDate(product.fecha_estimada_importacion)}</td>
                            {/* acciones */}
                            <td className="border border-slate-200 px-4 py-5">
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