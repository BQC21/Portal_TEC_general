import { AddProductReadonlyField } from "@/features/view/components/Form_fields/AddReadonlyField";
import { AddProductSectionTitle } from "@/features/view/components/Form_fields/AddSectionTitle";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { AddProductTextAreaField } from "@/features/view/components/Form_fields/AddTextAreaField";
import { Data_info_M1_props } from "@/lib/types/components/sub_components/module_render";
import {
    filterBrandsForSupplier,
    filterTypesForBrand,
    matchesProductCategory,
} from "@/lib/utils/helpers/modals/catalogCascade";
import { Unidad_Consumible, Unidad_ModFV } from "@/lib/utils/options";

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
    const filteredSuppliers = supplier.filter((item) =>
        matchesProductCategory(item.categoria, productCategory),
    );
    const filteredBrands = filterBrandsForSupplier(
        brand,
        productCategory,
        form.proveedor_id,
        form.proveedor || form_proveedor.nombre,
        cascadeOptions?.brands,
        form_marca.nombre,
    );
    const filteredTypes = filterTypesForBrand(
        type,
        productCategory,
        form.marca_id,
        form.marca || form_marca.nombre,
        cascadeOptions?.types,
        form_tipo.nombre,
    );

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
                            useSuplierSelection(value, filteredSuppliers, setForm_proveedor, setForm)
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
                                    useBrandSelection(value, filteredBrands, setForm_marca, setForm)
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
                                            useTypeSelection(value, filteredTypes, setForm_tipo, setForm)
                                        }
                                    />
                                    {selectedType && (
                                        <>
                                            {selectedType == "MÓDULO FV" && (
                                                <AddProductSelectField
                                                    label="UNIDAD"
                                                    required
                                                    options={Unidad_ModFV}
                                                    value={form.unidad}
                                                    onChange={(value) =>
                                                        updateField("unidad", value)
                                                    }
                                                />
                                            )}
                                            {selectedType == "CABLE" || 
                                            selectedType == "CANALIZACIÓN" ||
                                            selectedType == "CONSUMIBLE"  && (
                                                <AddProductSelectField
                                                label="UNIDAD"
                                                required
                                                options={Unidad_Consumible}
                                                value={form.unidad}
                                                onChange={(value) =>
                                                    updateField("unidad", value)
                                                }
                                            />
                                            )}
                                            {selectedType != "MÓDULO FV" && 
                                            selectedType != "CABLE" &&
                                            selectedType != "CANALIZACIÓN" &&
                                            selectedType != "CONSUMIBLE"&& (
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
