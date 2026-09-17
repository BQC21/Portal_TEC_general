import { EPP_REUSABLE_DESCRIPTIONS } from "@/lib/utils/consts/quotePrices";

export function isReusableEpp(descripcion: string) {
    return EPP_REUSABLE_DESCRIPTIONS.has(descripcion);
}
