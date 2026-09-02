"use client";

import { useCallback } from "react";
import { AddEquipoReadonlyField } from "../../../components/Form_fields/AddEquipoReadOnlyField";
import { AddProductNumberField } from "../../../components/Form_fields/AddNumberField";
import { AddProductRadioField } from "../../../components/Form_fields/AddRadioField";
import { AddProductReadonlyField } from "../../../components/Form_fields/AddReadonlyField";
import { AddProductSelectField } from "../../../components/Form_fields/AddSelectField";
import { MONTH_LABELS, useMonthlyDemand } from "../../../hooks/modals/Sizing/useMonthlyDemand";
import { Data_info_M2Props } from "@/lib/types/components/sub_components/module_render";
import { compute_cobertura } from "@/lib/utils/helpers/computes/energy_requirements";
import {
    cantidadesPaletYUnidad,
    optionalInputMax,
    optionalInputMin,
    toPanelInteger,
    toPanelIntegerLabel,
} from "@/lib/utils/helpers/computes/PanelNumber";

export function Data_info_M2({ form, updateField, handleOpcionLlenadoChange, handleOpcionLlenadoChangePANELES, computedRequirements, getFieldValueLightClass, 
    getFieldValueDarkClass, shouldRender_M2_battery_properties, shouldRender_M2_configuration, 
    CONNECTION_TYPE_OPTIONS }: Data_info_M2Props) {

    const handleAnnualDemandChange = useCallback(
        (value: string) => updateField("demanda_electrica", value),
        [updateField],
    );

    const handleMonthlyDemandChange = useCallback(
        (value: number[]) => updateField("demanda_mensual", value),
        [updateField],
    );

    const { monthlyValues, updateMonth, annualTotal } = useMonthlyDemand
    (handleAnnualDemandChange, handleMonthlyDemandChange, form.demanda_mensual);

    const displayedAnnualDemand = annualTotal > 0
        ? String(annualTotal)
        : form.demanda_electrica;

    const isAutoPanels = form.opcion_llenado_paneles !== "MANUAL";
    const minPanelesAuto = toPanelInteger(computedRequirements.strings_minimos, "ceil");
    const maxPanelesAuto = toPanelInteger(computedRequirements.strings_maximos, "floor");
    const minPanelesManual = toPanelInteger(form.strings_min, "ceil");
    const maxPanelesManual = toPanelInteger(form.strings_max, "floor");
    const { palets, unidades } = cantidadesPaletYUnidad(toPanelInteger(form.strings));

    return (
        <>
            <div className="flex flex-col items-center justify-center w-full min-h-screen p-0 text-center">
                <section className="flex flex-col gap-4 items-center justify-center w-full">
                    <div className="grid grid-cols-1 gap-8 w-full justify-items-center md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.8fr)_minmax(0,1.8fr)_minmax(0,1.8fr)_minmax(0,1.8fr)] md:justify-items-center">
                        <div>
                            <h2 className="mb-10 text-2xl font-bold text-slate-900">Datos de entrada del sistema</h2>
                            <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Demanda eléctrica mensual</h2>
                            {MONTH_LABELS.map((month, index) => (
                                <AddProductNumberField
                                    key={month}
                                    label={`Demanda eléctrica - ${month} (kWh)`}
                                    required
                                    centered
                                    value={monthlyValues[index]}
                                    onChange={(value) => updateMonth(index, value)}
                                    step={0.01}
                                    min={0}
                                />
                            ))}
                            <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Demanda eléctrica anual</h2>

                            <AddEquipoReadonlyField
                                label="Demanda eléctrica total por año (kWh)"
                                value={Number(displayedAnnualDemand) > 0
                                    ? String(Number(displayedAnnualDemand).toFixed(0))
                                    : ""}
                                colorClass={getFieldValueLightClass(displayedAnnualDemand)}
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
                                        label="Energía requerida (kWh)"
                                        value={String(Math.ceil(Number(computedRequirements.energia)))}
                                        colorClass={getFieldValueLightClass(computedRequirements.energia)}
                                    />
                                    <AddEquipoReadonlyField
                                        label="Potencia DC requerida (KW)"
                                        value={String(Math.ceil(Number(computedRequirements.potenciaDC)))}
                                        colorClass={getFieldValueLightClass(computedRequirements.potenciaDC)}
                                    />
                                    <AddEquipoReadonlyField
                                        label="Potencia AC requerida (KW)"
                                        value={String(Math.ceil(Number(computedRequirements.potenciaAC)))}
                                        colorClass={getFieldValueLightClass(computedRequirements.potenciaAC)}
                                    />
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <AddProductNumberField
                                            label="Porcentaje de cobertura (%)"
                                            required
                                            centered
                                            value={Number(form.cobertura_porcentaje) > 0 ? Number(form.cobertura_porcentaje) : ""}
                                            onChange={(value) => updateField("cobertura_porcentaje", String(value))}
                                            step={1}
                                            min={0}
                                            max={100}
                                        />
                                    </div>
                                </>
                                ) : (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Energía requerida"    required    centered
                                                value={Number(form.energia_requerida) > 0 ? Number(Number(form.energia_requerida).toFixed(2)) : ""}
                                                onChange={(value) => updateField("energia_requerida", String(value))}
                                                step={0.01} min={0}
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Potencia DC requerida (KW)"    required    centered
                                                value={Number(form.potencia_dc_requerida) > 0 ? Number(Number(form.potencia_dc_requerida).toFixed(2)) : ""}
                                                onChange={(value) => updateField("potencia_dc_requerida", String(value))}
                                                step={0.01} min={0} 
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Potencia AC requerida (KW)"    required    centered
                                                value={Number(form.potencia_ac_requerida) > 0 ? Number(Number(form.potencia_ac_requerida).toFixed(2)) : ""}
                                                onChange={(value) => updateField("potencia_ac_requerida", String(value))}
                                                step={0.01} min={0} 
                                            />
                                        </div>
                                        <AddEquipoReadonlyField
                                            label="Porcentaje de cobertura (%)"
                                            value={String(compute_cobertura(Number(displayedAnnualDemand), Number(form.energia_requerida)))}
                                            colorClass={getFieldValueLightClass(computedRequirements.potenciaAC)}
                                        />
                                    </>                                            
                                )
                            }
                            {shouldRender_M2_configuration(form.tipo_instalacion) && (
                                <AddProductSelectField
                                    label="Configuración"
                                    required
                                    value={form.configuracion}
                                    options={CONNECTION_TYPE_OPTIONS}
                                    onChange={(value) => updateField("configuracion", value)}
                                />
                            )}
                            <AddProductReadonlyField
                                label="Porcentaje de rendimiento del módulo (%)"
                                value="80"
                            />
                        </div>
                            
                        <div>
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
                                {/* <AddEquipoReadonlyField
                                    label="Unidad"
                                    value={computedRequirements.selectedEquipment?.unidad ?? ""}
                                    colorClass={"field-equipment-code"}
                                /> */}
                                
                                <AddEquipoReadonlyField
                                    label="VMPP del módulo seleccionado"
                                    value={String(Number(computedRequirements.selectedEquipment?.vmpp_vmin).toFixed(3))}
                                    colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.vmpp_vmin))}
                                />
                                <AddEquipoReadonlyField
                                    label="IMPP del módulo seleccionado"
                                    value={String(Number(computedRequirements.selectedEquipment?.impp_i_in).toFixed(3))}
                                    colorClass={getFieldValueDarkClass(computedRequirements.selectedEquipment?.impp_i_in)}
                                />
                                <AddEquipoReadonlyField
                                    label="VOC del módulo seleccionado"
                                    value={String(Number(computedRequirements.selectedEquipment?.voc_vmax).toFixed(3))}
                                    colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.voc_vmax))}
                                />
                                <AddEquipoReadonlyField
                                    label="ISC del módulo seleccionado"
                                    value={String(Number(computedRequirements.selectedEquipment?.isc_i_out).toFixed(3))}
                                    colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.isc_i_out))}
                                />  
                                <AddEquipoReadonlyField
                                    label="Potencia del módulo seleccionado"
                                    value={String(Number(computedRequirements.selectedEquipment?.potencia_maxima).toFixed(3))}
                                    colorClass={getFieldValueDarkClass(String(computedRequirements.selectedEquipment?.potencia_maxima))}
                                />

                                {/* Handlers */}
                                <AddProductRadioField
                                    label="Llenado automático"  checked={isAutoPanels}
                                    onChange={() => handleOpcionLlenadoChangePANELES("AUTOMÁTICO")}
                                />
                                <AddProductRadioField
                                    label="Llenado manual"  checked={form.opcion_llenado_paneles == "MANUAL"}
                                    onChange={() => handleOpcionLlenadoChangePANELES("MANUAL")}
                                />
                                {isAutoPanels ? (
                                <>
                                    <AddEquipoReadonlyField
                                        label="Mínimo de Paneles"
                                        value={toPanelIntegerLabel(computedRequirements.strings_minimos, "ceil")}
                                        colorClass={getFieldValueLightClass(computedRequirements.strings_minimos)}
                                    />
                                    <AddEquipoReadonlyField
                                        label="Máximo de Paneles"
                                        value={toPanelIntegerLabel(computedRequirements.strings_maximos, "floor")}
                                        colorClass={getFieldValueLightClass(computedRequirements.strings_maximos)}
                                    />

                                    {/* Considerar si se trata de paneles o  conjuntos*/}
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <AddProductNumberField
                                            label="Número exacto de Paneles"
                                            required
                                            centered
                                            value={Number(form.strings) > 0 ? toPanelInteger(form.strings) : ""}
                                            onChange={(value) => updateField("strings", String(toPanelInteger(value)))}
                                            min={optionalInputMin(minPanelesAuto)}
                                            step={1}
                                            max={optionalInputMax(maxPanelesAuto, minPanelesAuto)}
                                        />
                                    </div>
                                </>
                                ) : (
                                    <>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Mínimo de Paneles"    required    centered
                                                value={minPanelesManual > 0 ? minPanelesManual : ""}
                                                onChange={(value) => updateField("strings_min", String(toPanelInteger(value, "ceil")))}
                                                step={1} min={0}
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Máximo de Paneles"    required    centered
                                                value={maxPanelesManual > 0 ? maxPanelesManual : ""}
                                                onChange={(value) => updateField("strings_max", String(toPanelInteger(value, "floor")))}
                                                step={1} min={0}
                                            />
                                        </div>
                                        {/* Considerar si se trata de paneles o  conjuntos*/}
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <AddProductNumberField
                                                label="Número exacto de Paneles"
                                                required
                                                centered
                                                value={Number(form.strings) > 0 ? toPanelInteger(form.strings) : ""}
                                                onChange={(value) => updateField("strings", String(toPanelInteger(value)))}
                                                min={optionalInputMin(minPanelesManual)}
                                                step={1}
                                                max={optionalInputMax(maxPanelesManual, minPanelesManual)}
                                            />
                                        </div>
                                    </>                                            
                                )
                            }
                                    <AddEquipoReadonlyField
                                        label="Número de palets"
                                        value={String(palets)}
                                        colorClass={"text-slate-800 bg-[#50A0FF]"}
                                    />
                                    <AddEquipoReadonlyField
                                        label="Unidades individuales"
                                        value={String(unidades)}
                                        colorClass={"text-slate-800 bg-[#50A0FF]"}
                                    />
                            </>
                            )}
                        </div>
                            
                        <div>
                            {computedRequirements.selectedInverter && (
                                <>
                                <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Inversor seleccionado</h2>
                                {((Number(computedRequirements.selectedEquipment?.potencia_maxima) * Number(form.strings)) > 
                                    computedRequirements.selectedInverter?.potencia_maxima) && (
                                    <h2 className="mt-10 mb-10 text-1xl font-bold text-red-900">Inversor no recomendado por cuestiones de sobredimensionamiento ⚠️</h2>
                                )}

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
                                <AddEquipoReadonlyField
                                    label="Número máximo de cadenas a usarse"
                                    value={String(Number(computedRequirements.selectedInverter?.cadenas).toFixed(0))}
                                    colorClass={getFieldValueDarkClass(String(computedRequirements.selectedInverter?.cadenas ?? 0))}
                                />
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <AddProductNumberField
                                        label="Número de MPPTs a usarse"
                                        required
                                        centered
                                        value={Number(form.mppt_number) > 0 ? Number(form.mppt_number) : ""}
                                        onChange={(value) => updateField("mppt_number", String(value))}
                                        min={0}  step={1}
                                        max={optionalInputMax(Math.floor(Number(computedRequirements.selectedInverter?.mppt)))}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <AddProductNumberField
                                        label="Número de Cadenas a usarse"
                                        required
                                        centered
                                        value={Number(form.cadena_number) > 0 ? Number(form.cadena_number) : ""}
                                        onChange={(value) => updateField("cadena_number", String(value))}
                                        min={0}  step={1}
                                        max={optionalInputMax(Math.floor(Number(computedRequirements.selectedInverter?.cadenas)))}
                                    />
                                </div>



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
                                                value={String(Number(computedRequirements.selectedBattery?.vmpp_vmin).toFixed(0))}
                                                colorClass={getFieldValueDarkClass(String(computedRequirements.selectedBattery?.vmpp_vmin))}
                                            />
                                            <AddEquipoReadonlyField
                                                label="DoD de la batería seleccionada"
                                                value={String(Number(computedRequirements.selectedBattery?.dod).toFixed(0))}
                                                colorClass={getFieldValueDarkClass(String(computedRequirements.selectedBattery?.dod))}
                                            />




                                            <h2 className="mt-10 mb-10 text-2xl font-bold text-slate-900">Almacenamiento energético</h2>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <AddProductNumberField
                                                    label="Días de autonomía"
                                                    centered
                                                    value={Number(form.autonomia) > 0 ? Number(form.autonomia) : ""}
                                                    onChange={(value) => updateField("autonomia", String(value))}
                                                    min={0}
                                                    step={1}
                                                    max={2}
                                                />
                                            </div>
                                            <AddProductReadonlyField
                                                label="Capacidad (Ah) del sistema"
                                                value={String(Number(computedRequirements.ah_sistema).toFixed(0))}
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
