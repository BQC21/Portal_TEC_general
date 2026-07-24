import { MaterialesFormState } from "@/lib/types/supabase/materiales-types";
import { Supplier, SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { INITIAL_SUPPLIER_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function useSuplierSelection(    
    value: string, brand: Supplier[],
    setForm_proveedor:  (value: SetStateAction<SupplierFormstate>) => void,
    setForm: (value: SetStateAction<MaterialesFormState>) => void
) {
    function updateField<K extends keyof SupplierFormstate>(field: K, value: SupplierFormstate[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value };
            return updated;
        });
    }

    if (value === "Seleccione marca") {
        setForm_proveedor(INITIAL_SUPPLIER_FORM);
        return;
    }

    const selected = brand.find((brand) => brand.nombre === value);

    if (selected) {
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
    }
}