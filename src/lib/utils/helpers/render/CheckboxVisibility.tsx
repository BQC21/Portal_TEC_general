import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";

export function MaterialVisibilityCheckbox({
    item,
    hiddenMaterialIds,
    onToggleMaterialVisibility,
}: {
    item: Project_Materiales;
    hiddenMaterialIds: string[];
    onToggleMaterialVisibility?: (id: string) => void;
}) {
    const visibleInPdf = !hiddenMaterialIds.includes(String(item.id));
    return (
        <input
            type="checkbox"
            checked={visibleInPdf}
            onChange={() => onToggleMaterialVisibility?.(String(item.id))}
            aria-label={`Mostrar ${item.material_info?.descripcion || "material"} en el PDF`}
            className="h-5 w-5 accent-orange-500"
        />
    );
}