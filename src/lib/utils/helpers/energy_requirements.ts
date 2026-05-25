// -------------------------
// Funciones para el cálculo de requerimientos energéticos
// -------------------------

export function computeEnergy(demanda: number, cobertura: number) {
	return demanda * cobertura/100;
}

export function compute_DC_Power(energia: number, ghi: number, eficiencia: number) {
	return energia / (ghi * eficiencia/100);
}

export function compute_AC_Power(potenciaDC: number, DC_AC: number) {
	return potenciaDC / (DC_AC/100);
}