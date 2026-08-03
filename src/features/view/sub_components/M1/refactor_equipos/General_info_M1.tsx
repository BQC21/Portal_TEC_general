import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { General_info_M1_props_EQ } from "@/lib/types/components/sub_components/module_render";
import { shouldRenderBatteryProp, shouldRenderConnectionTypeAccesories, shouldRenderConnectionTypeBattery, shouldRenderConnectionTypeInversor, shouldRenderInversorProp, shouldRenderModuloProp } from "@/lib/utils/helpers/render/render_modals";
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
                        <AddProductTextField
                            label="DoD (%) degradación"
                            placeholder="80"
                            value={String(form.dod)}
                            onChange={(value) => updateField("dod", Number(value))}
                        />
                        <AddProductTextField
                            label="Amperaje de la batería (Ah)"
                            placeholder=""
                            value={form.impp_i_in}
                            onChange={(value) => updateField("impp_i_in", value)}
                        />
                        <AddProductTextField
                            label="Voltaje de la batería (V)"
                            placeholder=""
                            value={String(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", Number(value))}
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
                        <AddProductTextField
                            label="Potencia máxima(kw)"
                            placeholder=""
                            value={String(form.potencia_maxima)}
                            onChange={(value) => updateField("potencia_maxima", Number(value))}
                        />
                        <AddProductTextField
                            label="Número de MPPT"
                            placeholder=""
                            value={String(form.mppt)}
                            onChange={(value) => updateField("mppt", Number(value))}
                        />
                        <AddProductTextField
                            label="Potencia AC del inversor (kw)"
                            placeholder=""
                            value={String(form.potencia_ac)}
                            onChange={(value) => updateField("potencia_ac", Number(value))}
                        />
                        <AddProductTextField
                            label="Voltaje mínimo del inversor"
                            placeholder=""
                            value={String(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", Number(value))}
                        />
                        <AddProductTextField
                            label="Voltaje máximo del inversor"
                            placeholder=""
                            value={String(form.voc_vmax)}
                            onChange={(value) => updateField("voc_vmax", Number(value))}
                        />
                        <AddProductTextField
                            label="Corriente de entrada"
                            placeholder=""
                            value={String(form.impp_i_in)}
                            onChange={(value) => updateField("impp_i_in", value)}
                        />
                        <AddProductTextField
                            label="Corriente de salida"
                            placeholder=""
                            value={String(form.isc_i_out)}
                            onChange={(value) => updateField("isc_i_out", Number(value))}
                        />
                    </>
                    )}

                    {/* Módulo */}
                    {shouldRenderModuloProp(form.tipo_de_producto) && (
                    <>
                        <AddProductTextField
                            label="Potencia máxima del panel (kw)"
                            placeholder=""
                            value={String(form.potencia_maxima)}
                            onChange={(value) => updateField("potencia_maxima", Number(value))}
                        />
                        <AddProductTextField
                            label="VOC (Voltaje a circuito abierto) [V]"
                            placeholder=""
                            value={String(form.voc_vmax)}
                            onChange={(value) => updateField("voc_vmax", Number(value))}
                        />
                        <AddProductTextField
                            label="ISC (Corriente a corto circuito) [A]"
                            placeholder=""
                            value={String(form.isc_i_out)}
                            onChange={(value) => updateField("isc_i_out", Number(value))}
                        />
                        <AddProductTextField
                            label="VMPP (Voltaje punto de máxima potencia) [V]"
                            placeholder=""
                            value={String(form.vmpp_vmin)}
                            onChange={(value) => updateField("vmpp_vmin", Number(value))}
                        />
                        <AddProductTextField
                            label="IMPP (Corriente punto de máxima potencia) [A]"
                            placeholder=""
                            value={String(form.impp_i_in)}
                            onChange={(value) => updateField("impp_i_in", value)}
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