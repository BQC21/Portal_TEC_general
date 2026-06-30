export interface NRELInfo {
    inputs:{
        api_key:         string;
        lat:             string;
        lon:             string;       
    }

    errors:   string[];

    outputs:{
        solrad_annual:    number;     // kWh/m²/day  ← tu HSP
    }
}

// const NREL_BASE_URL = "https://developer.nrel.gov";
export const NREL_BASE_URL = "https://developer.nlr.gov"; // desde el 29/5/2026

// Parámetros fijos de PVWatts (requeridos por la API)
export const PVWATTS_DEFAULTS = {
    system_capacity: "1",
    module_type:     "0",
    losses:          "14",
    array_type:      "1",
    tilt:            "0", 
    azimuth:         "0",
    dataset:         "nsrdb", // diferirá un poco al de ATLAS (este de SOLARGIS dataset)
} as const;