import Button2Edit from "../../Buttons/shared/button2Edit";
import { Button2Delete } from "../../Buttons/shared/button2Delete";
import { EditEquipoModal } from "../../Modals/Equipos/EditEquipoModal";
import { DeleteEquipoModal } from "../../Modals/Equipos/DeleteEquipoModal";
import { displayCatalogCell, displayCatalogNumber, displayExchangeRate } from "@/lib/utils/helpers/manage_info/catalogCell";
import { EquiposTableProps } from "@/lib/types/components/General/tables";
import { TypeProperty } from "@/lib/utils/consts/typeProperties";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";
import { DATE_CELL_CLASS, getDateHeaderClass } from "@/lib/utils/helpers/render/tableDateColumn";
import { Equipos } from "@/lib/types/supabase/equipos-types";

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

const SPECIFIC_BASE_HEADERS = [
    "Acciones",
    "COD PRODUCTO",
    "TIPO DE PRODUCTO",
    "UNIDAD",
];

const PROPERTY_DIGITS: Record<string, number> = {
    potencia_maxima: 3,
    dod: 0,
};

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

function Actions({ equipo, onUpdateEquipos, onDeleteEquipos }: {
    equipo: Equipos;
    onUpdateEquipos: EquiposTableProps["onUpdateEquipos"];
    onDeleteEquipos: EquiposTableProps["onDeleteEquipos"];
}) {
    return (
        <td className="border border-slate-200 px-4 py-5">
            <div className="flex items-center gap-4 text-slate-500">
                <Button2Edit title="Editar equipo">
                    {(close) => (
                        <EditEquipoModal
                            equipo={equipo}
                            onUpdateEquipo={(updatedEquipo) => {
                                onUpdateEquipos(updatedEquipo);
                                close();
                            }}
                            onClose={close}
                        />
                    )}
                </Button2Edit>
                <Button2Delete title="Eliminar producto">
                    {(close) => (
                        <DeleteEquipoModal
                            equipo={equipo}
                            onDeleteEquipo={(equipoId) => {
                                onDeleteEquipos(equipoId);
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

function specificHeaders(properties: TypeProperty[]) {
    const seen = new Set<string>();
    const labels = properties.flatMap((property) => {
        if (!property.etiqueta || property.columna === "unidad" || seen.has(property.columna)) return [];
        seen.add(property.columna);
        return [property.etiqueta];
    });
    return [...SPECIFIC_BASE_HEADERS, ...labels];
}

function propertyColumns(properties: TypeProperty[]) {
    const seen = new Set<string>();
    return properties.filter((property) => {
        if (!property.columna || property.columna === "unidad" || seen.has(property.columna)) return false;
        seen.add(property.columna);
        return true;
    });
}

function readProperty(equipo: Equipos, column: string): unknown {
    if (column in equipo && column !== "extras") {
        return equipo[column as keyof Equipos];
    }
    return equipo.extras?.[column];
}

function displayProperty(equipo: Equipos, column: string) {
    const value = readProperty(equipo, column);
    const digits = PROPERTY_DIGITS[column];
    return digits === undefined ? displayCatalogCell(value) : displayCatalogNumber(value, digits);
}

function DataCell({ value, date = false }: { value: string; date?: boolean }) {
    return (
        <td className={`border border-slate-200 px-4 py-5 font-medium ${date ? DATE_CELL_CLASS : ""} ${cellClass(value)}`}>
            {value}
        </td>
    );
}

export function EquiposTable({
    equipos,
    totalEquipos,
    onUpdateEquipos,
    onDeleteEquipos,
    sheet,
    specificProperties = [],
}: EquiposTableProps) {
    const specificCols = propertyColumns(specificProperties);
    const headers = sheet === "generales"
        ? GENERAL_HEADERS
        : sheet === "especificas"
            ? specificHeaders(specificProperties)
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
                            {equipos.length > 0 ? (
                                equipos.map((equipo) => {
                                    return (
                                    <tr key={equipo.id} className="bg-white">
                                        <Actions equipo={equipo} onUpdateEquipos={onUpdateEquipos} onDeleteEquipos={onDeleteEquipos} />
                                        {sheet === "generales" && (
                                            <>
                                                <DataCell date value={formatDate(equipo.created_at)} />
                                                <DataCell date value={formatDate(equipo.updated_at)} />
                                                <DataCell value={displayCatalogCell(equipo.cod_prov)} />
                                                <DataCell value={displayCatalogCell(equipo.proveedor)} />
                                                <DataCell value={displayCatalogCell(equipo.cod_producto)} />
                                                <DataCell value={displayCatalogCell(equipo.tipo_de_producto)} />
                                                <DataCell value={displayCatalogCell(equipo.marca)} />
                                                <DataCell value={displayCatalogCell(equipo.descripcion)} />
                                            </>
                                        )}
                                        {sheet === "especificas" && (
                                            <>
                                                <DataCell value={displayCatalogCell(equipo.cod_producto)} />
                                                <DataCell value={displayCatalogCell(equipo.tipo_de_producto)} />
                                                <DataCell value={displayCatalogCell(equipo.unidad)} />
                                                {specificCols.map((property) => (
                                                    <DataCell
                                                        key={property.columna}
                                                        value={displayProperty(equipo, property.columna)}
                                                    />
                                                ))}
                                            </>
                                        )}
                                        {sheet === "precios" && (
                                            <>
                                                <DataCell value={displayCatalogCell(equipo.cod_producto)} />
                                                <DataCell value={displayCatalogCell(equipo.tipo_de_producto)} />
                                                <DataCell value={displayExchangeRate(equipo.precio_soles, equipo.precio_dolares)} />
                                                <DataCell value={displayCatalogNumber(equipo.precio_soles, 2)} />
                                                <DataCell value={displayCatalogNumber(equipo.precio_dolares, 2)} />
                                                <DataCell value={displayCatalogNumber(equipo.igv, 2)} />
                                                <DataCell value={displayCatalogNumber(equipo.precio_soles_igv, 2)} />
                                                <DataCell value={displayCatalogNumber(equipo.precio_dolares_igv, 2)} />
                                            </>
                                        )}
                                    </tr>
                                    );
                                })
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={headers.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay equipos registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {equipos.length} de {totalEquipos} equipos
            </p>
            <p className="text-lg text-slate-500">
                <strong>Nota:</strong> Los campos donde tengan barritas representan que no corresponden según el tipo de producto.
            </p>
        </section>
    );
}
