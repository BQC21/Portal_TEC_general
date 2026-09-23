import { TABLE_HEADERS_BRAND } from "@/lib/utils/headers";
import { Tables_TypeProps } from "@/lib/types/components/sub_components/module_render";

export function Tables_Type({
    selectedBrandTable,
    setSelectedBrandTable,
}: Tables_TypeProps) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Marcas asociadas</h2>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    {TABLE_HEADERS_BRAND[0]}
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    {TABLE_HEADERS_BRAND[1]}
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBrandTable.length > 0 ? (
                                selectedBrandTable.map((item) => (
                                    <tr key={`${item.row}-${item.id}`} className="bg-white">
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            {item.nombre}
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5 font-medium">
                                            {item.categoria}
                                        </td>
                                        <td className="border-b border-slate-200 px-4 py-5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedBrandTable((current) =>
                                                        current.filter((row) => row.id !== item.id),
                                                    );
                                                }}
                                                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={3} className="px-4 py-10 text-center text-slate-500">
                                        No hay marcas seleccionadas todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
