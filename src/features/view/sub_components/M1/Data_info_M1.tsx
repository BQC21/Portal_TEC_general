import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextAreaField } from "@/features/view/components/Form_fields/AddTextAreaField";
import { Data_info_M1_props } from "@/lib/types/components/sub_components/module_render";
import { Unidad } from "@/lib/utils/options";

function matchesProductCategory(
    categoria: string | undefined,
    productCategory: Data_info_M1_props["productCategory"],
) {
    return categoria === productCategory || categoria === "Ambas";
}

export function Data_info_M1({
    form,
    setForm,
    cascadeOptions,
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
    productCategory,
    showProductCode = false,
    useSuplierSelection,
    useBrandSelection,
    useTypeSelection,
    updateField,
}: Data_info_M1_props) {
    // --------------------
    // FILTRADOS EN CASCADA
    // --------------------
    
    const filteredSuppliers = supplier.filter((item) =>
        matchesProductCategory(item.categoria, productCategory),
    );
    const filteredBrands = brand.filter((item) => {
        const matchesCategory = matchesProductCategory(item.categoria, productCategory);
        if (!cascadeOptions) return matchesCategory;
        return matchesCategory && cascadeOptions.brands.includes(item.nombre ?? "");
    });
    const filteredTypes = type.filter((item) => {
        const matchesCategory = matchesProductCategory(item.categoria, productCategory);
        if (!cascadeOptions) return matchesCategory;
        return matchesCategory && cascadeOptions.types.includes(item.nombre ?? "");
    });

    return (
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
                            ...filteredSuppliers.map((item) => item.nombre ?? ""),
                        ]}
                        onChange={(value) =>
                            useSuplierSelection(value, supplier, setForm_proveedor, setForm)
                        }
                    />
                    {selectedSupplier && (
                        <>
                            <AddProductReadonlyField
                                label="COD PROV"
                                value={form.cod_prov}
                            />
                            {showProductCode && (
                                <AddProductReadonlyField
                                    label="Código del Producto"
                                    value={form.cod_producto}
                                />
                            )}
                            <AddProductSelectField
                                label="MARCA"
                                required
                                value={form_marca.nombre ?? ""}
                                options={[
                                    "Seleccione marca",
                                    ...filteredBrands.map((item) => item.nombre ?? ""),
                                ]}
                                onChange={(value) =>
                                    useBrandSelection(value, brand, setForm_marca, setForm)
                                }
                            />
                            {selectedBrand && (
                                <>
                                    <AddProductSelectField
                                        label="TIPO DE PRODUCTO"
                                        required
                                        value={form_tipo.nombre ?? ""}
                                        options={[
                                            "Seleccione tipo de producto",
                                            ...filteredTypes.map((item) => item.nombre ?? ""),
                                        ]}
                                        onChange={(value) =>
                                            useTypeSelection(value, type, setForm_tipo, setForm)
                                        }
                                    />
                                    {selectedType && (
                                        <>
                                            {selectedType == "MÓDULO FV" && (
                                                <AddProductSelectField
                                                    label="UNIDAD"
                                                    required
                                                    options={Unidad}
                                                    value={form.unidad}
                                                    onChange={(value) =>
                                                        updateField("unidad", value)
                                                    }
                                                />
                                            )}
                                                {selectedType != "MÓDULO FV" && (
                                                    <AddProductReadonlyField
                                                        label="UNIDAD"
                                                        value={form.unidad}
                                                    />
                                            )}
                                            <div className="md:col-span-2">
                                                <AddProductTextAreaField
                                                    label="Descripción"
                                                    required
                                                    placeholder="Descripción detallada del producto"
                                                    value={form.descripcion}
                                                    onChange={(value) =>
                                                        updateField("descripcion", value)
                                                    }
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
    );
}
