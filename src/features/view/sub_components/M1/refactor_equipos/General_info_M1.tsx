import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { General_info_M1_props_EQ } from "@/lib/types/components/sub_components/module_render";
import {
    shouldRenderBatteryProp,
    shouldRenderConnectionTypeAccesories,
    shouldRenderConnectionTypeBattery,
    shouldRenderConnectionTypeInversor,
    shouldRenderInversorProp,
    shouldRenderModuloProp,
} from "@/lib/utils/helpers/render/render_modals";
import { CONNECTION_TYPE_OPTIONS } from "@/lib/utils/options";

export function General_info_M1_EQ({
    form,
    updateField,
}: General_info_M1_props_EQ){
    return(
        <>
            <section className="space-y-5">
                <AddProductSectionTitle title="Propiedades Técnicas" />
                <div className="grid gap-5 md:grid-cols-2">
                    {/* Batería */}
                    {shouldRenderConnectionTypeBattery(form.tipo_de_producto) && (
                        <AddProductSelectField
                            label="Tipo de Conexión"
                            value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                            options={["---", "BAT"]}
                            onChange={(value) =>
                            updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                            }
                        />
                    )}
                    {shouldRenderBatteryProp(form.tipo_de_producto) && (
                    <>
                        <AddProductNumberField
                            label="DoD (%) degradación"
                            value={Number(form.dod)}
                            onChange={(value) => updateField("dod", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Amperaje de la batería (Ah)"
                            value={Number(form.impp_i_in)}
                            onChange={(value) => updateField("impp_i_in", String(value))}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Voltaje de la batería (V)"
                            value={Number(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", value)}
                            step={0.001}
                            min={0}
                        />
                    </>
                    )}

                    {/* Inversor */}
                    {shouldRenderConnectionTypeInversor(form.tipo_de_producto) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                        options={CONNECTION_TYPE_OPTIONS}
                        onChange={(value) =>
                            updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}
                    {shouldRenderInversorProp(form.tipo_de_producto) && (
                    <>
                        <AddProductNumberField
                            label="Potencia máxima(kw)"
                            value={Number(form.potencia_maxima)}
                            onChange={(value) => updateField("potencia_maxima", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Número de MPPT"
                            value={Number(form.mppt)}
                            onChange={(value) => updateField("mppt", value)}
                            step={1}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Número de cadenas"
                            value={Number(form.cadenas)}
                            onChange={(value) => updateField("cadenas", value)}
                            step={1}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Potencia AC del inversor (kw)"
                            value={Number(form.potencia_ac)}
                            onChange={(value) => updateField("potencia_ac", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Voltaje mínimo del inversor"
                            value={Number(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Voltaje máximo del inversor"
                            value={Number(form.voc_vmax)}
                            onChange={(value) => updateField("voc_vmax", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Corriente de entrada"
                            value={Number(form.impp_i_in)}
                            onChange={(value) => updateField("impp_i_in", String(value))}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="Corriente de salida"
                            value={Number(form.isc_i_out)}
                            onChange={(value) => updateField("isc_i_out", value)}
                            step={0.001}
                            min={0}
                        />
                    </>
                    )}

                    {/* Módulo */}
                    {shouldRenderModuloProp(form.tipo_de_producto) && (
                    <>
                        <AddProductNumberField
                            label="Potencia máxima del panel (kw)"
                            value={Number(form.potencia_maxima)}
                            onChange={(value) => updateField("potencia_maxima", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="VOC (Voltaje a circuito abierto) [V]"
                            value={Number(form.voc_vmax)}
                            onChange={(value) => updateField("voc_vmax", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="ISC (Corriente a corto circuito) [A]"
                            value={Number(form.isc_i_out)}
                            onChange={(value) => updateField("isc_i_out", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="VMPP (Voltaje punto de máxima potencia) [V]"
                            value={Number(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", value)}
                            step={0.001}
                            min={0}
                        />
                        <AddProductNumberField
                            label="IMPP (Corriente punto de máxima potencia) [A]"
                            value={Number(form.impp_i_in)}
                            onChange={(value) => updateField("impp_i_in", String(value))}
                            step={0.001}
                            min={0}
                        />
                    </>
                    )}

                    {/* Accesorio */}
                    {shouldRenderConnectionTypeAccesories(form.tipo_conexion) && (
                    <AddProductSelectField
                        label="Tipo de Conexión"
                        value={form.tipo_conexion || CONNECTION_TYPE_OPTIONS[0]}
                        options={CONNECTION_TYPE_OPTIONS}
                        onChange={(value) =>
                            updateField("tipo_conexion", value === CONNECTION_TYPE_OPTIONS[0] ? "" : value)
                        }
                    />
                    )}
                </div>
            </section>
        </>
    )
}
