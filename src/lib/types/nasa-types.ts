export interface NasaInfo {
    location: {
        longitude: string;
        latitude: string;
    };
    range: {
        start: string;
        end: string;
    };
    unit: string;   // "C"
    source: string; // "MERRA2"
    T2M: Record<string, number>; // { "20170101": 26.45, ... }
}