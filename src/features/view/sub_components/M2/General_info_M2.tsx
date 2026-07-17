import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddProductSelectField } from "../../components/Form_fields/AddSelectField";
import { AddProductTextField } from "../../components/Form_fields/AddTextField";
import { AddProductUrlField } from "../../components/Form_fields/AddUrlField";
import { STATUS_PROJECT_OPTIONS } from "@/lib/utils/options";
import { INSTALL_TYPE_OPTIONS } from "@/lib/utils/options";
import { Zone, ZoneFormState } from "@/lib/types/supabase/zone-types";
import { SetStateAction } from "react";
import { AddProductReadonlyField } from "../../components/Form_fields/AddReadonlyField";
import { ZoneSelection } from "../../hooks/modals/Sizing/useZoneSelection";
import { General_info_M2Props } from "@/lib/types/components/module_render";

export function General_info_M2({ form, updateField, form_zone, zones, setForm_zone, setForm, 
    ANGLE_OPTIONS, selectedZone, selectedAngle }: General_info_M2Props) {
    return (
        <>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <AddProductTextField
                    label="Nombre del proyecto"
                    required
                    placeholder=" "
                    value={form.nombre}
                    onChange={(value) => updateField("nombre", value)}
                />
                <AddProductSelectField
                    label="Estado del proyecto"
                    required
                    value={form.estado_proyecto}
                    options={STATUS_PROJECT_OPTIONS}
                    onChange={(value) => updateField("estado_proyecto", value)}
                />
                <AddProductSelectField
                    label="Tipo de instalación"
                    required
                    value={form.tipo_instalacion}
                    options={INSTALL_TYPE_OPTIONS}
                    onChange={(value) => updateField("tipo_instalacion", value)}
                />
                <AddProductUrlField
                    label="Enlace al proyecto"
                    placeholder=" "
                    value={form.enlace}
                    onChange={(value) => updateField("enlace", value)}
                />
            </section>
        </div>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <AddProductSelectField
                    label="Zona"
                    required
                    value={form_zone.zona ?? ""}
                    options={["Seleccione zona", ...zones.map((zone) => zone.zona)]}
                    onChange={(value) => ZoneSelection(value, zones, 
                        setForm_zone, setForm)}
                />
                <AddProductSelectField
                    label="Orientación de la radiación"
                    required
                    value={String(form.angulo)}
                    options={ANGLE_OPTIONS}
                    onChange={(value) => updateField("angulo", value)}
                />

                {selectedZone && (
                    <>
                        <span>
                            <AddProductReadonlyField
                                label="Latitud de la zona"
                                value={form_zone.latitude ?? "---"}
                            />
                        </span>
                        <span>
                            <AddProductReadonlyField
                                label="Longitud de la zona"
                                value={form_zone.longitude ?? "---"}
                            />
                        </span>
                        {selectedAngle == "Coplanar" ? (
                                <span>
                                <AddProductReadonlyField
                                    label="GHI anual de la zona"
                                    value={form_zone.ghi_respaldo ?? "---"}
                                />
                            </span>
                            ) : selectedAngle == "Inclinado" ? (
                            <span>
                                <AddProductReadonlyField
                                    label="GTI anual de la zona"
                                    value={form_zone.gti_respaldo ?? "---"}
                                />
                            </span>
                            ) : 
                            <span>
                                <p>Seleccione la orientación de los módulos</p>
                            </span>
                        }
                        {/* <span>
                        {!NRELerror && ghi_nrel !== null ? (
                            <span>
                                <AddProductReadonlyField
                                    label="GHI (NREL) - kWh/m²/año"
                                    value={nrelValue(ghi_nrel)}
                                />
                            </span>
                        ) : (
                            <>
                                <span>
                                    <AddProductReadonlyField
                                        label="GHI anual de la zona"
                                        value={form_zone.ghi_respaldo ?? "---"}
                                    />
                                </span>
                                <p className="max-w-xs text-sm text-yellow-600">
                                    En caso haya problemas con la API, los datos han sido registrados según Global Solar ATLAS.
                                </p>
                            </>
                        )}
                        </span> */}
                    </>
                )}
            </section>
        </div>
    </>
    );
}