import { AddProductDateField } from "@/features/view/components/Form_fields/AddDateField";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductRadioField } from "@/features/view/components/Form_fields/AddRadioField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { Quote_selectedProps } from "@/lib/types/components/sub_components/module_render";
import { DSCTOOptions } from "@/lib/utils/options";

export function ReportDataInput({
    form, 
    updateField,
}: Quote_selectedProps){

    // Handler para cambiar la opción de llenado (AUTOMÁTICO | MANUAL)
    function handleOpcionDSCTOChange(value: DSCTOOptions) {
        updateField("opcion_dscto", value);
    }

    return(
        <div className="grid gap-2">
            <h2 className="mt-2 mb-1 text-xl font-bold text-red-900">Ingrese datos</h2>
            <AddProductTextField
                label = "Nombre del cliente"
                value = {form.cliente || ""}
                onChange = {(value) => updateField("cliente", String(value))}
            />
            <AddProductTextField
                label = "RUC / DNI"
                value = {form.ruc_dni || ""}
                onChange = {(value) => updateField("ruc_dni", String(value))}
            />
            <AddProductReadonlyField
                label="Nombre del proyecto"
                value={String(form.cotizacion_info?.proyecto_info?.nombre)}
            />
            <AddProductDateField
                label="Fecha de cotización"
                value={form.fecha? 
                    `${form.fecha.getFullYear()}-${String(form.fecha.getMonth() + 1).padStart(2, "0")}-${String(form.fecha.getDate()).padStart(2, "0")}`
                    : ""} // {/* TS lee los meses desde 0 a 11*/}
                onChange={(value) => {
                    if (!value) {
                        updateField("fecha", undefined);
                        return;
                    }
                    const [year, month, day] = value.split("-").map(Number);
                    updateField("fecha", new Date(year, month - 1, day));
                }}
            />
            <AddProductTextField
                label = "Lugar del proyecto"
                value = {form.lugar || ""}
                onChange = {(value) => updateField("lugar", String(value))}
            />
            <AddProductTextField
                label = "Encargado de atención"
                value = {form.atencion || ""}
                onChange = {(value) => updateField("atencion", String(value))}
            />
            <AddProductNumberField
                label="Porcentaje de distribución por equipos y materiales eléctricos"
                required
                value={Number(form.porcentaje_eqmt) > 0 ? Number(form.porcentaje_eqmt) : ""}
                onChange={(value) => updateField("porcentaje_eqmt", String(value))}
                step={1} min={1} max={100}
            />
            <AddProductNumberField
                label="Porcentaje de distribución por puesta en marcha"
                required
                value={Number(form.porcentaje_inst) > 0 ? Number(form.porcentaje_inst) : ""}
                onChange={(value) => updateField("porcentaje_inst", String(value))}
                step={1} min={1} max={100}
            />
            {/* Adicionales */}
            <AddProductTextField
                label = "Validez de oferta"
                required
                value = {form.validez_oferta || ""}
                onChange = {(value) => updateField("validez_oferta", String(value))}
            />
            <AddProductTextField
                label = "Plazo de entrega"
                required
                value = {form.plazo_entrega || ""}
                onChange = {(value) => updateField("plazo_entrega", String(value))}
            />
            {/* Handlers */}
            <AddProductRadioField
                label="Incluir tasa de descuento"  checked={form.opcion_dscto == "CON DSCTO"}
                onChange={() => handleOpcionDSCTOChange("CON DSCTO")}
            />
            <AddProductRadioField
                label="No considerar tasa de descuento"  checked={form.opcion_dscto == "SIN DSCTO"}
                onChange={() => handleOpcionDSCTOChange("SIN DSCTO")}
            />

            {form.opcion_dscto == "CON DSCTO" && (
                <AddProductNumberField
                    label="Tasa de descuento (%)"
                    value={Number(form.tasa_dscto) > 0 ? Number(form.tasa_dscto) : ""}
                    onChange={(value) => updateField("tasa_dscto", String(value))}
                    step={1}
                    min={0}
                    max={100}
                />
            )}
        </div>
    )
}