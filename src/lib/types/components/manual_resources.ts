export type ManualResourceCosts = {
    epp: { descripcion: string; cantidad: number; precio_unitario: number };
    tooling: { descripcion: string; cantidad: number; precio_unitario: number };
    hotel: { monto: number; personas: number; dias: number };
    personal: { nombre: string; puesto: string; dias: number; precio_dia: number };
    sctr: { descripcion: string; cantidad: number; precio_unitario: number };
    eating: { descripcion: string; cantidad: number; precio_unitario: number };
    traveling: { descripcion: string; cantidad: number; precio_unitario: number };
    courier: { descripcion: string; cantidad: number; precio_unitario: number };
};


