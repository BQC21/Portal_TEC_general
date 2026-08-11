"""Contrato del payload enviado desde el Form (EditFinantialModal / Button2PDF_FINANTIAL).

No lee DB: todo llega en el body del POST.
Alineado a src/lib/types/components/Python_components/FinantialPdfPayload.ts
"""

from __future__ import annotations

from typing import Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


NumberLike = Union[str, int, float, None]


class ProyectoInfo(BaseModel):
    """Proyecto embebido en la cotización."""

    model_config = ConfigDict(extra="ignore")

    nombre: Optional[str] = None


class CotizacionInfo(BaseModel):
    """Cotización seleccionada en el Form."""

    model_config = ConfigDict(extra="ignore")

    cod_cotizacion: Optional[str] = None
    precio_dolares: NumberLike = None
    proyecto_info: Optional[ProyectoInfo] = None


class FlowRowPayload(BaseModel):
    """Fila de flujo de caja enviada desde el Form."""

    model_config = ConfigDict(extra="ignore")

    year: int
    equipamiento: Optional[float] = None
    tarifa_cliente: Optional[float] = None
    om: Optional[float] = None
    energy_mwh: Optional[float] = None
    ahorro: Optional[float] = None
    flujo_total: float = 0.0
    flujo_acumulado: float = 0.0


class EnergyRowPayload(BaseModel):
    """Fila de variación de energía enviada desde el Form."""

    model_config = ConfigDict(extra="ignore")

    year: int
    energy_mwh: float = 0.0
    degradation_pct: float = 0.0


class FinantialFormPayload(BaseModel):
    """Espejo de FinantialPdfPayload (TypeScript)."""

    model_config = ConfigDict(extra="ignore")

    tipo: Literal["finantial"] = "finantial"

    # ---- Parámetros de entrada ----
    planta: NumberLike = None
    generacion: NumberLike = None
    tarifa_red: NumberLike = None
    degra_1er: NumberLike = None
    degra_2do: NumberLike = None
    tarifa_crecimiento: NumberLike = None
    tasa_descuento: NumberLike = None

    # ---- Métricas calculadas ----
    capex: NumberLike = None
    opex: NumberLike = None
    tiempo_retorno: NumberLike = None
    lcoe: NumberLike = None
    van: NumberLike = None
    capex_total: NumberLike = None
    om_total: NumberLike = None
    energia_total: NumberLike = None
    beneficio_acumulado: NumberLike = None

    # ---- Cotización / proyecto ----
    cotizacion_id: Optional[str] = None
    cotizacion_info: Optional[CotizacionInfo] = None

    # ---- Tablas ----
    flow_rows: list[FlowRowPayload] = Field(default_factory=list)
    energy_rows: list[EnergyRowPayload] = Field(default_factory=list)


class FlowRowData(BaseModel):
    """Fila de flujo lista para dibujar el PDF."""

    model_config = ConfigDict(extra="ignore")

    year: int = 0
    equipamiento: Optional[float] = None
    tarifa_cliente: Optional[float] = None
    om: Optional[float] = None
    energy_mwh: Optional[float] = None
    ahorro: Optional[float] = None
    flujo_total: float = 0.0
    flujo_acumulado: float = 0.0


class EnergyRowData(BaseModel):
    """Fila de energía lista para dibujar el PDF."""

    model_config = ConfigDict(extra="ignore")

    year: int = 0
    energy_mwh: float = 0.0
    degradation_pct: float = 0.0


class FinantialPdfData(BaseModel):
    """Modelo interno listo para dibujar el PDF financiero."""

    model_config = ConfigDict(extra="ignore")

    # Encabezado
    proyecto: str = ""
    cod_cotizacion: str = ""

    # Parámetros de entrada
    planta: float = 0.0
    generacion: float = 0.0
    tarifa_red: float = 0.0
    degra_1er: float = 0.0
    degra_2do: float = 0.0
    tarifa_crecimiento: float = 0.0
    tasa_descuento: float = 0.0

    # Métricas
    capex: float = 0.0
    opex: float = 0.0
    tiempo_retorno: float = 0.0
    lcoe: float = 0.0
    van: float = 0.0
    capex_total: float = 0.0
    om_total: float = 0.0
    energia_total: float = 0.0
    beneficio_acumulado: float = 0.0

    # Tablas / gráficas
    flow_rows: list[FlowRowData] = Field(default_factory=list)
    energy_rows: list[EnergyRowData] = Field(default_factory=list)

    filename: str = "analisis_financiero.pdf"
