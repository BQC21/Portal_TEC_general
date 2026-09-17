import Button2Edit from "@/features/view/components/Buttons/shared/button2Edit";
import { Button2Delete } from "@/features/view/components/Buttons/shared/button2Delete";
import EditZoneModal from "@/features/view/components/Modals/sizing/zone/EditZoneModal";
import { DeleteZoneModal } from "@/features/view/components/Modals/sizing/zone/DeleteZoneModal";
import type { Zone } from "@/lib/types/supabase/zone-types";
import { ZoneTableProps } from "@/lib/types/components/General/tables";

import { TABLE_HEADERS_ZONE } from "@/lib/utils/headers";
import { formatDate } from "@/lib/utils/helpers/manage_info/date_manage";

export default function ProjectTable({ zones, 
    totalZones, 
    onUpdateZone, 
    onDeleteZone }: ZoneTableProps) {
    
    return(
        <section className="space-y-4 w-full">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full w-max border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-100 text-left">
                                {TABLE_HEADERS_ZONE.map((header) => (
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
                            {zones.length > 0 ? (
                                zones.map((zone) => (
                                    <tr key={zone.id} className="bg-white">
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{zone.zona}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{zone.latitude}</td>
                                        <td className={`border border-slate-200 px-4 py-5 font-medium`}>{zone.longitude}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{zone.gti_respaldo}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{zone.gti_respaldo_diario}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{zone.ghi_respaldo}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{zone.ghi_respaldo_diario}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{zone.hsp_peor_mes}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{formatDate(zone.created_at)}</td>
                                        <td className={`w-[100px] border border-slate-200 px-4 py-5 font-medium`}>{formatDate(zone.updated_at)}</td>
                                        <td className="border border-slate-200 px-4 py-5">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Button2Edit title="Actualizar zona" label="Actualizar Zona">
                                                    {(close) => (
                                                        <EditZoneModal
                                                            existingZone={zone}
                                                            onUpdateZone={async (formData) => {
                                                                const updatedZone: Zone = { ...zone, ...formData };
                                                                await onUpdateZone(updatedZone);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Edit>
                                                <Button2Delete title="Eliminar zona">
                                                    {(close) => (
                                                        <DeleteZoneModal
                                                            zone={zone}
                                                            onDeleteZone={(zoneId) => {
                                                                onDeleteZone(zoneId);
                                                                close();
                                                            }}
                                                            onClose={close}
                                                        />
                                                    )}
                                                </Button2Delete>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white">
                                    <td colSpan={TABLE_HEADERS_ZONE.length} className="px-4 py-10 text-center text-slate-500">
                                        No hay zonas registrados todavía.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-lg text-slate-500">
                Mostrando {totalZones} zonas
            </p>
        </section>
    )
}