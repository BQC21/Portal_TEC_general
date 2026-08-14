import { EquiposFormState } from "@/lib/types/supabase/equipos-types";
import { Type, TypeFormstate } from "@/lib/types/supabase/type-types";
import { shouldRender_EquipoInfoSelection } from "@/lib/utils/helpers/render/render_infoSelection";
import { INITIAL_TYPE_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function useTypeSelection(
    value: string,
    type: Type[],
    setForm_tipo: (value: SetStateAction<TypeFormstate>) => void,
    setForm: (value: SetStateAction<EquiposFormState>) => void,
) {
    if (value === "Seleccione tipo de producto") {
        setForm_tipo(INITIAL_TYPE_FORM);
        setForm((current) => ({
            ...current,
            tipo_de_producto: "",
            tipo_id: "",
            unidad: "",
            tipo_conexion: current.tipo_conexion === "BAT" ? "" : current.tipo_conexion,
        }));
        return;
    }

    const selected = type.find((item) => item.nombre === value);

    if (!selected) return;

    const tipoNombre = selected.nombre ?? "";
    const { unit } = shouldRender_EquipoInfoSelection(tipoNombre);

    setForm_tipo({
        nombre: selected.nombre,
        categoria: selected.categoria,
        created_at: selected.created_at,
        updated_at: selected.updated_at,
        marca_id: selected.marca_id,
        marca_info: selected.marca_info,
    });

    setForm((current) => ({
        ...current,
        tipo_de_producto: tipoNombre,
        tipo_id: selected.id?.toString() ?? "",
        unidad: unit || "",
        tipo_conexion: tipoNombre === "BATERÍA" ? "BAT" : current.tipo_conexion === "BAT" ? "" : current.tipo_conexion,
    }));
}
