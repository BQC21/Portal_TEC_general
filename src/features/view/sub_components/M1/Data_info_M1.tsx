import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextAreaField } from "@/features/view/components/Form_fields/AddTextAreaField";
import { Data_info_M1_props } from "@/lib/types/components/module_render";

export function Data_info_M1({
    form,
    setForm,
    form_proveedor, 
    form_marca,
    form_tipo,
    setForm_proveedor,
    setForm_marca,
    setForm_tipo,
    selectedSupplier,
    selectedBrand,
    selectedType,
    supplier,
    brand,
    type,
    useSuplierSelection,
    useBrandSelection,
    useTypeSelection,
    updateField,
}: Data_info_M1_props) {
    return(
        <>
            <section className="space-y-5">
                <AddProductSectionTitle title="Información Básica" />
                    <div className="grid gap-5 md:grid-cols-2">
                        <AddProductSelectField
                            label="PROVEEDOR"
                            required
                            value={form_proveedor.nombre ?? ""}
                            options={[
                                "Seleccione proveedor",
                                ...supplier
                                    .filter((s) => s.categoria === "Materiales" || s.categoria === "Ambas")
                                    .map((s) => s.nombre ?? ""),
                            ]}
                            onChange={(value) => useSuplierSelection(value, supplier, setForm_proveedor, setForm)}
                        />
                        {selectedSupplier && (
                            <>
                            <AddProductReadonlyField
                                label="COD PROV"
                                value={form.cod_prov}
                            />
                            <AddProductSelectField
                                label="MARCA"
                                required
                                value={form_marca.nombre ?? ""}
                                options={["Seleccione marca", ...brand.map((b) => b.nombre ?? "")]}
                                onChange={(value) => useBrandSelection(value, brand, setForm_marca, setForm)}
                            />
                            {selectedBrand && (
                                <>
                                <AddProductSelectField
                                    label="TIPO DE PRODUCTO"
                                    required
                                    value={form_tipo.nombre ?? ""}
                                    options={["Seleccione tipo de producto", ...type.map((t) => t.nombre ?? "")]}
                                    onChange={(value) => useTypeSelection(value, type, setForm_tipo, setForm)}
                                />
                                {selectedType && (
                                    <>
                                    <AddProductReadonlyField
                                        label="UNIDAD"
                                        value={form.unidad}
                                    />
                                    <div className="md:col-span-2">
                                        <AddProductTextAreaField
                                            label="Descripción"
                                            required
                                            placeholder="Descripción detallada del producto"
                                            value={form.descripcion}
                                            onChange={(value) => updateField("descripcion", value)}
                                        />
                                    </div>
                                    </>
                                    
                                )}
                                </>
                            )}
                            </>
                        )}
                    </div>
            </section>
        </>
    )
}