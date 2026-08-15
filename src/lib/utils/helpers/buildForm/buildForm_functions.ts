import { BrandFormstate } from "@/lib/types/supabase/brand.types";
import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";
import { TypeFormstate } from "@/lib/types/supabase/type-types";
import { INITIAL_BRAND_FORM, INITIAL_SUPPLIER_FORM, INITIAL_TYPE_FORM } from "../../initialValues";
import { MaterialesFormState } from "@/lib/types/supabase/materiales-types";

export function buildSupplierForm(product: EquiposFormState | MaterialesFormState): SupplierFormstate {
    if (product.proveedor_info) {
        const info = product.proveedor_info;
        return {
            nombre: info.nombre,
            ruc: info.ruc,
            contacto: info.contacto,
            telefono: info.telefono,
            categoria: info.categoria,
            codigo: info.codigo,
            created_at: info.created_at,
            updated_at: info.updated_at,
        };
    }

    return {
        ...INITIAL_SUPPLIER_FORM,
        nombre: product.proveedor,
        codigo: product.cod_prov,
    };
}

export function buildBrandForm(product: EquiposFormState | MaterialesFormState): BrandFormstate {
    if (product.marca_info) {
        const info = product.marca_info;
        return {
            nombre: info.nombre,
            categoria: info.categoria,
            created_at: info.created_at,
            updated_at: info.updated_at,
            proveedor_id: info.proveedor_id
        };
    }

    return {
        ...INITIAL_BRAND_FORM,
        nombre: product.marca,
    };
}

export function buildTypeForm(product: EquiposFormState | MaterialesFormState): TypeFormstate {
    if (product.tipo_info) {
        const info = product.tipo_info;
        return {
            nombre: info.nombre,
            categoria: info.categoria,
            created_at: info.created_at,
            updated_at: info.updated_at,
            marca_id: info.marca_id,
        };
    }

    return {
        ...INITIAL_TYPE_FORM,
        nombre: product.tipo_de_producto,
    };
}