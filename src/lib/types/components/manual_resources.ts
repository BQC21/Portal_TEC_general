export type ManualResourceCosts = {
    epp: { descripcion: string; cantidad: number; precio_unitario: number };
    tooling: { descripcion: string; cantidad: number; precio_unitario: number };
    hotel: { monto: number; personas: number; dias: number };
    personal: { nombre: string; puesto: string; dias: number; precio_dia: number };
    sctr: { descripcion: string; cantidad: number; precio_unitario: number };
    eating: { monto: number; personas: number; dias: number };
    traveling: { monto: number; personas: number; dias: number };
    courier: { descripcion: string; cantidad: number; precio_unitario: number };
};


