import { SupplierFormstate } from "@/lib/types/supabase/supplier-types";

type SupplierCodeInfo = { RUC: string; supplierCode: string };

const EMPTY_SUPPLIER_INFO: SupplierCodeInfo = { RUC: "", supplierCode: "" };

// Respaldo para filas legacy sin `codigo` en catálogo (mismo proveedor, grafías/RUC antiguas)
const LEGACY_SUPPLIER_MAP: Record<string, SupplierCodeInfo> = {
    "Andet S.A.C.": { RUC: "20601248647", supplierCode: "ANDE" },
    "Sigelec S.A.C.": { RUC: "20268214527", supplierCode: "SIGE" },
    "AutoSolar Energía del Perú S.A.C.": { RUC: "20602492118", supplierCode: "AUTO" },
    "Novum Solar S.A.C.": { RUC: "20601873894", supplierCode: "NOVU" },
    "Caral Soluciones Energéticas S.A.C.": { RUC: "20603087675", supplierCode: "CARA" },
    "FelicitySolar Perú E.I.R.L.": { RUC: "20611054069", supplierCode: "FELI" },
    "Felicitysolar Peru E.I.R.L.": { RUC: "20611054069", supplierCode: "FELI" },
    "RE & GE Import S.A.C.": { RUC: "20502234693", supplierCode: "REGE" },
    "Grupo Coinp S.A.C.": { RUC: "20548407991", supplierCode: "COIN" },
    "Proyect & Quality S.A.C.": { RUC: "20611896116", supplierCode: "PROY" },
    "Project & Quality": { RUC: "20611896116", supplierCode: "PROJ" },
    "Proyect & Quality": { RUC: "20611896116", supplierCode: "PROJ" },
    "Tienda Solar S.A.C.": { RUC: "", supplierCode: "TISO" },
    "Ferretería Choque": { RUC: "", supplierCode: "CHOQ" },
    "FerroVoz": { RUC: "", supplierCode: "FERR" },
    "Inversionas Cavasa S.A.C.": { RUC: "", supplierCode: "CAVA" },
    "Perú Solar": { RUC: "", supplierCode: "PESO" },
    "Stof Grimme E.I.R.L.": { RUC: "", supplierCode: "STOF" },
    "Electronic Siblings": { RUC: "", supplierCode: "ELSI" },
    "20601248647": { RUC: "20601248647", supplierCode: "ANDE" },
    "20268214527": { RUC: "20268214527", supplierCode: "SIGE" },
    "20602492118": { RUC: "20602492118", supplierCode: "AUTO" },
    "20601873894": { RUC: "20601873894", supplierCode: "NOVU" },
    "20603087675": { RUC: "20603087675", supplierCode: "CARA" },
    "20611054069": { RUC: "20611054069", supplierCode: "FELI" },
    "20502234693": { RUC: "20502234693", supplierCode: "REGE" },
    "20548407991": { RUC: "20548407991", supplierCode: "COIN" },
    "20611896116": { RUC: "20611896116", supplierCode: "PROY" },
};

export function normalizeSupplierCode(value: string) {
    return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

export function suggestSupplierCode(nombre: string) {
    return normalizeSupplierCode(nombre);
}

export function isValidSupplierCode(value: string) {
    return normalizeSupplierCode(value).length === 4;
}

export function getSupplierInfo(proveedor: SupplierFormstate): SupplierCodeInfo {
    const supplierCode = normalizeSupplierCode(proveedor.codigo ?? "");
    if (supplierCode) {
        return { RUC: proveedor.ruc ?? "", supplierCode };
    }

    return (
        LEGACY_SUPPLIER_MAP[proveedor.nombre ?? ""] ||
        LEGACY_SUPPLIER_MAP[proveedor.ruc ?? ""] ||
        EMPTY_SUPPLIER_INFO
    );
}
