import { SelectOption } from "@/lib/types/components/General/form_fields";

export function formatProductOptionLabel(cod_producto: string, descripcion: string): string {
    return `(${cod_producto}) - ${descripcion}`;
}

export function toProductSelectOption(item: {
    id: number | string;
    cod_producto: string;
    descripcion: string;
}): SelectOption {
    return {
        value: String(item.id),
        label: formatProductOptionLabel(item.cod_producto, item.descripcion),
    };
}

export function toModuloFVSelectOption(item: {
    id: number | string;
    cod_producto: string;
    descripcion: string;
    unidad?: string | null;
}): SelectOption {
    const baseLabel = formatProductOptionLabel(item.cod_producto, item.descripcion);
    const unidad = (item.unidad ?? "").trim();
    return {
        value: String(item.id),
        label: unidad ? `${baseLabel} — ${unidad}` : baseLabel,
    };
}

export function defaultSelectOption(label: string): SelectOption {
    return {
        value: "",
        label: `Seleccionar - ${label}`,
    };
}
