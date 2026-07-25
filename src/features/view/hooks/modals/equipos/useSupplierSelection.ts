import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { Supplier, SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { INITIAL_SUPPLIER_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function useSuplierSelection(
    value: string,
    supplier: Supplier[],
    setForm_proveedor: (value: SetStateAction<SupplierFormstate>) => void,
    setForm: (value: SetStateAction<EquiposFormState>) => void,
) {
    if (value === "Seleccione proveedor") {
        setForm_proveedor(INITIAL_SUPPLIER_FORM);
        setForm((current) => ({
            ...current,
            proveedor: "",
            proveedor_id: "",
            cod_prov: "",
            marca: "",
            marca_id: "",
            tipo_de_producto: "",
            tipo_id: "",
            unidad: "",
        }));
        return;
    }

    const selected = supplier.find((item) => item.nombre === value);

    if (!selected) return;

    setForm_proveedor({
        nombre: selected.nombre,
        ruc: selected.ruc,
        contacto: selected.contacto,
        telefono: selected.telefono,
        categoria: selected.categoria,
        codigo: selected.codigo,
        created_at: selected.created_at,
        updated_at: selected.updated_at,
    });

    setForm((current) => ({
        ...current,
        proveedor: selected.nombre ?? "",
        proveedor_id: selected.id?.toString() ?? "",
        cod_prov: selected.codigo ?? "",
        marca: "",
        marca_id: "",
        tipo_de_producto: "",
        tipo_id: "",
        unidad: "",
    }));
}
