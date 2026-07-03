"use client";

import { useCallback } from "react";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddEquipoReadonlyField } from "../../components/Form_fields/AddEquipoReadOnlyField";
import { AddProductNumberField } from "../../components/Form_fields/AddNumberField";
import { AddProductRadioField } from "../../components/Form_fields/AddRadioField";
import { AddProductReadonlyField } from "../../components/Form_fields/AddReadonlyField";
import { AddProductSelectField } from "../../components/Form_fields/AddSelectField";
import { computedRequirements } from "@/lib/types/components/computes";
import { SelectedEquipmentItem } from "@/lib/types/supabase/product-types";
import { MONTH_LABELS, useMonthlyDemand } from "../../hooks/modals/useMonthlyDemand";

export type Data_info_M2Props = {
    form: ProjectFormState;
    updateField: (field: string, value: string) => void;
    handleOpcionLlenadoChange: (value: string) => void;
    computedRequirements: computedRequirements;
    getFieldValueLightClass: (value: string) => string;
    getFieldValueDarkClass: (value: string) => string;
    shouldRender_M2_battery_properties: (value: string) => boolean;
    shouldRender_M2_configuration: (value: string) => boolean;
    CONNECTION_TYPE_OPTIONS: string[];
    selectedEquipment: SelectedEquipmentItem;
    selectedInverter: SelectedEquipmentItem;
    selectedBattery: SelectedEquipmentItem;
}

export function Data_info_M2({ form, updateField, handleOpcionLlenadoChange, computedRequirements, getFieldValueLightClass, 
    getFieldValueDarkClass, shouldRender_M2_battery_properties, shouldRender_M2_configuration, 
    CONNECTION_TYPE_OPTIONS }: Data_info_M2Props) {

    const handleAnnualDemandChange = useCallback(
        (value: string) => updateField("demanda_electrica", value),
        [updateField],
    );

    const { monthlyValues, updateMonth, annualTotal } = useMonthlyDemand(handleAnnualDemandChange);

    const displayedAnnualDemand = annualTotal > 0
        ? String(annualTotal)
        : form.demanda_electrica;

    return (
        <>
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-3 py-5 sm:px-6 lg:px-8">
                        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,2.7fr)_minmax(0,2.5fr)_minmax(0,2.5fr)_minmax(0,2.5fr)]">
                                <div>
                                    <h2 className="mb-10 text-2xl font-bold text-slate-900">Datos de entrada del sistema</h2>
                                    <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Demanda eléctrica mensual</h2>
                                    {MONTH_LABELS.map((month, index) => (
                                        <AddProductNumberField
                                            key={month}
                                            label={`Demanda eléctrica - ${month} (kWh)`}
                                            required
                                            value={monthlyValues[index]}
                                            onChange={(value) => updateMonth(index, value)}
                                            step={1}
                                            min={0}
                                        />
                                    ))}
                                    <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Demanda eléctrica anual</h2>

                                    <AddEquipoReadonlyField
                                        label="Demanda eléctrica total por año (kWh)"
                                        value={Number(displayedAnnualDemand) > 0
                                            ? String(Number(displayedAnnualDemand).toFixed(2))
                                            : ""}
                                        colorClass={getFieldValueLightClass(displayedAnnualDemand)}
                                    />

                                    {shouldRender_M2_configuration(form.tipo_instalacion) && (
                                        <AddProductSelectField
                                            label="Configuración"
                                            required
                                            value={form.configuracion}
                                            options={CONNECTION_TYPE_OPTIONS}
                                            onChange={(value) => updateField("configuracion", value)}
                                        />
                                    )}
                                    <AddProductNumberField
                                        label="Porcentaje de cobertura (%)"
                                        required
                                        value={Number(form.cobertura_porcentaje) > 0 ? Number(form.cobertura_porcentaje) : ""}
                                        onChange={(value) => updateField("cobertura_porcentaje", String(value))}
                                        step={5}
                                        min={30}
                                        max={40}
                                    />
                                    <AddProductReadonlyField
                                        label="Porcentaje de rendimiento del módulo (%)"
                                        value="80"
                                    />
                                </div>





                                
                                <div>
                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Requerimientos energéticos</h2>
                                    {/* Handlers */}
                                    <AddProductRadioField
                                        label="Llenado automático"  checked={form.opcion_llenado == "AUTOMÁTICO"}
                                        onChange={() => handleOpcionLlenadoChange("AUTOMÁTICO")}
                                    />
                                    <AddProductRadioField
                                        label="Llenado manual"  checked={form.opcion_llenado == "MANUAL"}
                                        onChange={() => handleOpcionLlenadoChange("MANUAL")}
                                    />
                                    {form.opcion_llenado == "AUTOMÁTICO" ? (
                                        <>
                                            <AddEquipoReadonlyField
                                                label="Energía requerida"
                                                value={computedRequirements.energia}
                                                colorClass={getFieldValueLightClass(computedRequirements.energia)}
                                            />
                                            <AddEquipoReadonlyField
                                                label="Potencia DC requerida (KW)"
                                                value={String(Number(computedRequirements.potenciaDC).toFixed(2))}
                                                colorClass={getFieldValueLightClass(computedRequirements.potenciaDC)}
                                            />
                                            <AddEquipoReadonlyField
                                                label="Potencia AC requerida (KW)"
                                                value={String(Number(computedRequirements.potenciaAC).toFixed(2))}
                                                colorClass={getFieldValueLightClass(computedRequirements.potenciaAC)}
                                            />
                                        </>
                                        ) : (
                                            <>
                                                <AddProductNumberField
                                                    label="Energía requerida"    required
                                                    value={Number(form.energia_requerida) > 0 ? Number(form.energia_requerida) : ""}
                                                    onChange={(value) => updateField("energia_requerida", String(value))}
                                                    step={1} min={0}
                                                />
                                                <AddProductNumberField
                                                    label="Potencia DC requerida (KW)"    required
                                                    value={Number(form.potencia_dc_requerida) > 0 ? Number(form.potencia_dc_requerida) : ""}
                                                    onChange={(value) => updateField("potencia_dc_requerida", String(value))}
                                                    step={1} min={0} 
                                                />
                                                <AddProductNumberField
                                                    label="Potencia AC requerida (KW)"    required
                                                    value={Number(form.potencia_ac_requerida) > 0 ? Number(form.potencia_ac_requerida) : ""}
                                                    onChange={(value) => updateField("potencia_ac_requerida", String(value))}
                                                    step={1} min={0} 
                                                />
                                            </>                                            
                                        )
                                    }

                                    {computedRequirements.selectedEquipment && (
                                        <>
                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Módulo seleccionado</h2>
                                        <AddEquipoReadonlyField
                                            label="Código del módulo seleccionado"
                                            value={computedRequirements.selectedEquipment?.codigo ?? ""}
                                            colorClass={"field-equipment-code"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Marca del módulo seleccionado"
                                            value={computedRequirements.selectedEquipment?.marca ?? ""}
                                            colorClass={"field-equipment-code"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="VMPP del módulo seleccionado"
                                            value={String(Number(computedRequirements.selectedEquipment?.vmpp_vmin).toFixed(2))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.vmpp_vmin))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="IMPP del módulo seleccionado"
                                            value={String(Number(computedRequirements.selectedEquipment?.impp_i_in).toFixed(2))}
                                            colorClass={getFieldValueDarkClass(computedRequirements.selectedEquipment?.impp_i_in)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="VOC del módulo seleccionado"
                                            value={String(Number(computedRequirements.selectedEquipment?.voc_vmax).toFixed(2))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.voc_vmax))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="ISC del módulo seleccionado"
                                            value={String(Number(computedRequirements.selectedEquipment?.isc_i_out).toFixed(2))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.isc_i_out))}
                                        />  
                                        <AddEquipoReadonlyField
                                            label="Potencia del módulo seleccionado"
                                            value={String(Number(computedRequirements.selectedEquipment?.potencia_maxima).toFixed(2))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.potencia_maxima))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Mínimo de Módulos"
                                            value={String(Number(computedRequirements.strings_minimos).toFixed(0))}
                                            colorClass={getFieldValueLightClass(computedRequirements.strings_minimos)}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Máximo de Módulos"
                                            value={String(Number(computedRequirements.strings_maximos).toFixed(0))}
                                            colorClass={getFieldValueLightClass(computedRequirements.strings_maximos)}
                                        />
                                        <AddProductNumberField
                                            label="Número exacto de Módulos"
                                            required
                                            value={Number(form.strings) > 0 ? Number(form.strings) : ""}
                                            onChange={(value) => updateField("strings", String(value))}
                                            min={Math.ceil(Number(computedRequirements.strings_minimos)) > 0 ?
                                                    Math.ceil(Number(computedRequirements.strings_minimos)) : 0
                                            }
                                            step={1}
                                            max={Math.floor(Number(computedRequirements.strings_maximos)) > 0 ?
                                                    Math.floor(Number(computedRequirements.strings_maximos)) : 0
                                            }
                                        />
                                    </>
                                    )}
                                </div>





                                <div>
                                    {computedRequirements.selectedInverter && (
                                        <>
                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Inversor seleccionado</h2>
                                        <AddEquipoReadonlyField
                                            label="Código del inversor seleccionado"
                                            value={computedRequirements.selectedInverter?.codigo ?? ""}
                                            colorClass={"field-equipment-code"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Marca del inversor seleccionado"
                                            value={computedRequirements.selectedInverter?.marca ?? ""}
                                            colorClass={"field-equipment-code"}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Potencia DC máxima del inversor seleccionado"
                                            value={String(Number(computedRequirements.selectedInverter?.potencia_maxima).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.potencia_maxima))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Potencia AC del inversor seleccionado"
                                            value={String(Number(computedRequirements.selectedInverter?.potencia_ac).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.potencia_ac))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Corriente de entrada del inversor"
                                            value={String(Number(computedRequirements.selectedInverter?.impp_i_in).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.impp_i_in))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Corriente de salida del inversor"
                                            value={String(Number(computedRequirements.selectedInverter?.isc_i_out).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.isc_i_out))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Voltaje máximo del inversor por MPPT"
                                            value={String(Number(computedRequirements.selectedInverter?.voc_vmax).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.voc_vmax))}
                                        />
                                        <AddEquipoReadonlyField
                                            label="Número máximo de MPPTs a usarse"
                                            value={String(Number(computedRequirements.selectedInverter?.mppt).toFixed(0))}
                                            colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.mppt ?? 0))}
                                        />
                                        <AddProductNumberField
                                            label="Número de MPPTs a usarse"
                                            required
                                            value={Number(form.mppt_number) > 0 ? Number(form.mppt_number) : ""}
                                            onChange={(value) => updateField("mppt_number", String(value))}
                                            min={0}  step={1}
                                            max={Math.floor(Number(computedRequirements.selectedInverter?.mppt)) > 0 ? 
                                                    Math.floor(Number(computedRequirements.selectedInverter?.mppt)) : 0}
                                        />




                                        <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Protecciones eléctricas</h2>
                                        <AddProductReadonlyField
                                            label="Protección ITM AC mínima"
                                            value={String(Number(computedRequirements.itm_ac_min).toFixed(0))}
                                            colorClass={getFieldValueLightClass(computedRequirements.itm_ac_min)}
                                        />
                                        <AddProductReadonlyField
                                            label="Protección ITM DC mínima"
                                            value={String(Number(computedRequirements.itm_dc_min).toFixed(0))}
                                            colorClass={getFieldValueLightClass(computedRequirements.itm_dc_min)}
                                        />
                                        <AddProductReadonlyField
                                            label="Protección SPD"
                                            value={String(Number(computedRequirements.spd_min).toFixed(0))}
                                            colorClass={getFieldValueLightClass(computedRequirements.spd_min)}
                                        />
                                    </>
                                    )}
                                </div>




                                <div>
                                    {shouldRender_M2_battery_properties(form.tipo_instalacion) && (
                                        <>
                                            {computedRequirements.selectedBattery && (
                                                <>
                                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Características de la batería seleccionada</h2>
                                                    <AddEquipoReadonlyField
                                                        label="Código de la batería seleccionada"
                                                        value={computedRequirements.selectedBattery?.codigo ?? ""}
                                                        colorClass={"field-equipment-code"}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Marca de la batería seleccionado"
                                                        value={computedRequirements.selectedBattery?.marca ?? ""}
                                                        colorClass={"field-equipment-code"}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Capacidad de la batería seleccionada"
                                                        value={String(Number(computedRequirements.selectedBattery?.impp_i_in).toFixed(0))}
                                                        colorClass={getFieldValueDarkClass(String(computedRequirements.selectedBattery?.impp_i_in))}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="Voltaje de la batería seleccionada"
                                                        value={String(Number(computedRequirements.selectedBattery?.vmpp_vmin).toFixed(1))}
                                                        colorClass={getFieldValueDarkClass(String(computedRequirements.selectedBattery?.vmpp_vmin))}
                                                    />
                                                    <AddEquipoReadonlyField
                                                        label="DoD de la batería seleccionada"
                                                        value={String(Number(computedRequirements.selectedBattery?.dod).toFixed(0))}
                                                        colorClass={getFieldValueDarkClass(String(computedRequirements.selectedBattery?.dod))}
                                                    />




                                                    <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Almacenamiento energético</h2>
                                                    <AddProductNumberField
                                                        label="Días de autonomía"
                                                        value={Number(form.autonomia) > 0 ? Number(form.autonomia) : ""}
                                                        onChange={(value) => updateField("autonomia", String(value))}
                                                        min={0}
                                                        step={1}
                                                        max={2}
                                                    />
                                                    <AddProductReadonlyField
                                                        label="Capacidad (Ah) del sistema"
                                                        value={String(Number(computedRequirements.ah_sistema).toFixed(2))}
                                                        colorClass={getFieldValueLightClass(computedRequirements.ah_sistema)}
                                                    />
                                                    <AddProductReadonlyField
                                                        label="Número de baterías necesarias"
                                                        value={String(Number(computedRequirements.num_baterias).toFixed(0))}
                                                        colorClass={getFieldValueLightClass(computedRequirements.num_baterias)}
                                                    />
                                                </>
                                            )}
                                    </>
                                )}
                                </div>
                            </div>
                        </section>
                    </div>
        </>
    );
}
