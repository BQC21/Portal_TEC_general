import { Equipos } from "@/lib/types/supabase/equipos-types";
import { SelectedEquipmentItem } from "@/lib/types/supabase/product-types";

// -----------------------------------------------
// -------- Valores predeterminados --------------
// -----------------------------------------------

export const DATALOGGER_ONGRID_DESC = "Datalogger OnGrid";
export const SMART_METER_TRIFASICO_DESC = "Smart Meter Trifásico + 3 CT";

const MANAGED_SOLIS_ACCESSORIES = [
    DATALOGGER_ONGRID_DESC,
    SMART_METER_TRIFASICO_DESC,
] as const;

// ------------------------------------
// -------- Condiciones ---------------
// ------------------------------------

function normalizeForMatch(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

function matchesDescription(description: string, target: string): boolean {
    return normalizeForMatch(description).includes(normalizeForMatch(target));
} 

export function isSolisBrand(marca?: string): boolean {
    return (marca ?? "").trim().toUpperCase() === "SOLIS";
} 

export function isManagedSolisAccessory(description: string): boolean {
    return MANAGED_SOLIS_ACCESSORIES.some((target) => matchesDescription(description, target));
}

export function wantedSolisAccessoryDescriptions(tipoInstalacion: string): string[] {
    const wanted: string[] = [SMART_METER_TRIFASICO_DESC];
    if (tipoInstalacion !== "conexión OFF-GRID") {
        wanted.unshift(DATALOGGER_ONGRID_DESC);
    }
    return wanted;
} 

// Función indicadora de la inserción automática
export function shouldOfferSolisAccessory(
    description: string,
    isSolisInverter: boolean,
    tipoInstalacion: string,
): boolean {
    // ¿Es un accesorio Solis?
    if (!isManagedSolisAccessory(description)) return true;
    // Excluye la inserción automática si el inversor elegido no es de la marca solis
    if (!isSolisInverter) return false;
    // Excluye la inserción de Datalogger OnGrid en sistemas OffGrid
    if (
        matchesDescription(description, DATALOGGER_ONGRID_DESC) &&
        tipoInstalacion === "conexión OFF-GRID"
    ) {
        return false;
    }
    return true;
}

// Información del accesorio seleccionado
function toSelectedAccessory(equipo: Equipos): SelectedEquipmentItem {
    return {
        row: "ACCESORIO",
        id: String(equipo.id),
        description: equipo.descripcion,
        marca: equipo.marca,
        codigo: equipo.cod_producto,
        potencia_maxima: equipo.potencia_maxima,
        mppt: equipo.mppt,
        cadenas: equipo.cadenas,
        dod: equipo.dod,
        potencia_ac: equipo.potencia_ac,
        voc_vmax: equipo.voc_vmax,
        vmpp_vmin: equipo.vmpp_vmin,
        isc_i_out: equipo.isc_i_out,
        impp_i_in: equipo.impp_i_in,
        cantidad: 1,
        unidad: equipo.unidad,
        precio_soles: equipo.precio_soles,
        precio_dolares: equipo.precio_dolares,
        precio_soles_igv: equipo.precio_soles_igv,
        precio_dolares_igv: equipo.precio_dolares_igv,
    };
}

// ------------------------
// --- Sincronización -----
// ------------------------

export function syncSolisAutoAccessories(
    table: SelectedEquipmentItem[],
    equipos: Equipos[],
    tipoInstalacion: string,
): SelectedEquipmentItem[] {
    const inverter = table.find((item) => item.row === "INVERSOR");
    const isSolis = isSolisBrand(inverter?.marca);
    const wanted = isSolis ? wantedSolisAccessoryDescriptions(tipoInstalacion) : [];

    const next = table.filter((item) => {
        if (item.row !== "ACCESORIO" || !isManagedSolisAccessory(item.description)) return true;
        return wanted.some((desc) => matchesDescription(item.description, desc));
    });

    if (isSolis) {
        for (const desc of wanted) {
            const alreadyPresent = next.some(
                (item) => item.row === "ACCESORIO" && matchesDescription(item.description, desc),
            );
            if (alreadyPresent) continue;

            const equipo = equipos.find(
                (item) =>
                    item.tipo_de_producto === "ACCESORIO" &&
                    isSolisBrand(item.marca) &&
                    matchesDescription(item.descripcion, desc),
            );
            if (!equipo) continue;
            next.push(toSelectedAccessory(equipo));
        }
    }

    if (next.length === table.length && next.every((item, index) => item === table[index])) {
        return table;
    }
    return next;
}
