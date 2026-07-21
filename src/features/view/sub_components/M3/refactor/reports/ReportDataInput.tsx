import { AddProductDateField } from "@/features/view/components/Form_fields/AddDateField";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { Quote_selectedProps } from "@/lib/types/components/module_render";
import { formatDate, formatDate_DMY } from "@/lib/utils/helpers/manage_info/date_manage";

export function ReportDataInput({
    form, 
    updateField,
}: Quote_selectedProps){
    return(
        <>
            <h2 className="mt-2 mb-2 text-1xl font-bold text-red-900">Ingrese datos</h2>
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
                value={formatDate_DMY(form.fecha)}
                onChange={(value) => updateField("fecha", value ? new Date(value) : undefined)}
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
        </>
    )
}