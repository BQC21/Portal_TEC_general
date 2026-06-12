// -------------------------
// Requerimientos energéticos
// -------------------------

export function computeEnergy(demanda: number, cobertura: number) {
	return demanda * cobertura/100;
}

export function compute_DC_Power(energia: number, ghi: number, eficiencia: number) {
	return energia / (ghi * eficiencia/100);
}

export function compute_AC_Power(potenciaDC: number) {
	return potenciaDC / 1.2;
}

// -------------------------
// Campo fotovoltaico
// -------------------------

export function min_strings(potenciaDC: number, potenciaMOD: number){
	return potenciaDC/potenciaMOD;
}

export function max_strings(potenciaDC_INV: number, potenciaMOD: number){
	return potenciaDC_INV/potenciaMOD;
}

// -------------------------
// Protecciones
// -------------------------

export function ITM_DC_MIN(isc_mod: number){
	return Math.floor(isc_mod*1.25)
}

export function ITM_AC_MIN(iout_inv: number){
	return Math.ceil(iout_inv*1.25)
}

export function SPD_MIN(string_number: number, voc_mod: number, 
	mppt_number: number){
	return Math.ceil(string_number * voc_mod/mppt_number)
}

// -------------------------
// Almacenamiento energético
// -------------------------

export function AH_sistema(demanda: number, autonomía: number, 
	dod: number, voltaje_bateria: number){
	return (demanda*autonomía)/(dod*voltaje_bateria)
}

export function N_baterias(ah_sistema: number, ah_bateria: number){
	return ah_sistema/ah_bateria
}