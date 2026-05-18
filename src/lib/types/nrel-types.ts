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