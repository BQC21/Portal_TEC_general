import { displayCatalogCell, displayCatalogNumber, displayExchangeRate } from "@/lib/utils/helpers/manage_info/catalogCell";
import Button2Edit from "../../Buttons/shared/button2Edit";
import { Button2Delete } from "../../Buttons/shared/button2Delete";
import { EditMaterialModal } from "../../Modals/Materiales/EditMaterialModal";
import { DeleteMaterialModal } from "../../Modals/Materiales/DeleteMaterialModal";
import { MaterialesTableProps } from "@/lib/types/components/General/tables";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { DATE_CELL_CLASS, getDateHeaderClass } from "@/lib/utils/helpers/render/tableDateColumn";
import { Materiales } from "@/lib/types/supabase/materiales-types";

const GENERAL_HEADERS = [
    "Acciones",
    "Fecha creada",
    "Fecha actualizada",
    "COD PROV",
    "PROVEEDOR",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "MARCA",
    "DESCRIPCIÓN",
];

const SPECIFIC_HEADERS = [
    "Acciones",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "PARTE ELÉCTRICA",
    "UNIDAD",
];

const PRICE_HEADERS = [
    "Acciones",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "Tasa de cambio",
    "PRECIO S/",
    "PRECIO $",
    "IGV",
    "PRECIO + IGV S/",
    "PRECIO + IGV $",
];

function cellClass(value: string) {
    return value === "- - -" ? "text-slate-600" : "text-slate-900";
}

function Actions({ material, onUpdateMateriales, onDeleteMateriales }: {
    material: Materiales;
    onUpdateMateriales: MaterialesTableProps["onUpdateMateriales"];
    onDeleteMateriales: MaterialesTableProps["onDeleteMateriales"];
}) {
    return (
        <td className="border border-slate-200 px-4 py-5">
            <div className="flex items-center gap-4 text-slate-500">
                <Button2Edit title="Editar material">
                    {(close) => (
                        <EditMaterialModal
                            material={material}
                            onUpdateMaterial={(updatedMaterial) => {
                                onUpdateMateriales(updatedMaterial);
                                close();
                            }}
                            onClose={close}
                        />
                    )}
                </Button2Edit>
                <Button2Delete title="Eliminar material">
                    {(close) => (
                        <DeleteMaterialModal
                            material={material}
                            onDeleteMaterial={(materialId) => {
                                onDeleteMateriales(materialId);
                                close();
                            }}
                            onClose={close}
                        />
                    )}
                </Button2Delete>
            </div>
        </td>
    );
}

function DataCell({ value, date = false }: { value: string; date?: boolean }) {
    return (
        <td className={`border border-slate-200 px-4 py-5 font-medium ${date ? DATE_CELL_CLASS : ""} ${cellClass(value)}`}>
            {value}
        </td>
    );
}

export function MaterialesTable({
    materiales,
    totalMateriales,
    onUpdateMateriales,
    onDeleteMateriales,
    sheet,
}: MaterialesTableProps) {
    const headers = sheet === "generales"
        ? GENERAL_HEADERS
        : sheet === "especificas"
            ? SPECIFIC_HEADERS
            : PRICE_HEADERS;

    return (
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {headers.map((header) => (
                                    <th key={header} className={`border border-slate-200 px-4 py-4 text-[1.02rem] font-bold ${getDateHeaderClass(header)}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {materiales.length > 0 ? (
                                materiales.map((material) => (
                                    <tr key={material.id} className="bg-white">
                                        <Actions
                                            material={material}
                                            onUpdateMateriales={onUpdateMateriales}
                                            onDeleteMateriales={onDeleteMateriales}
                                        />
                                        {sheet === "generales" && (
                                            <>
                                                <DataCell date value={formatDate(material.created_at)} />
                                                <DataCell date value={formatDate(material.updated_at)} />
                                                <DataCell value={displayCatalogCell(material.cod_prov)} />
                                                <DataCell value={displayCatalogCell(material.proveedor)} />
                                                <DataCell value={displayCatalogCell(material.cod_producto)} />
                                                <DataCell value={displayCatalogCell(material.tipo_de_producto)} />
                                                <DataCell value={displayCatalogCell(material.marca)} />
                                                <DataCell value={displayCatalogCell(material.descripcion)} />
                                            </>
                                        )}
                                        {sheet === "especificas" && (
                                            <>
                                                <DataCell value={displayCatalogCell(material.cod_producto)} />
                                                <DataCell value={displayCatalogCell(material.tipo_de_producto)} />
                                                <DataCell value={displayCatalogCell(material.parte_electrica)} />
                                                <DataCell value={displayCatalogCell(material.unidad)} />
                                            </>
                                        )}
                                        {sheet === "precios" && (
                                            <>
                                                <DataCell value={displayCatalogCell(material.cod_producto)} />
                                                <DataCell value={displayCatalogCell(material.tipo_de_producto)} />
                                                <DataCell value={displayExchangeRate(material.precio_soles, material.precio_dolares)} />
                                                <DataCell value={displayCatalogNumber(material.precio_soles, 2)} />
                                                <DataCell value={displayCatalogNumber(material.precio_dolares, 2)} />
                                                <DataCell value={displayCatalogNumber(material.igv, 0)} />
                                                <DataCell value={displayCatalogNumber(material.precio_soles_igv, 2)} />
                                                <DataCell value={displayCatalogNumber(material.precio_dolares_igv, 2)} />
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={headers.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay materiales registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {materiales.length} de {totalMateriales} materiales
            </p>
            <p className="text-lg text-slate-500">
                <strong>Nota:</strong> Los campos donde tengan barritas representan que no corresponden según el tipo de producto.
            </p>
        </section>
    );
}
