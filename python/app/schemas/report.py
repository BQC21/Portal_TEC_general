"""Contrato del payload enviado desde el Form (EditReportModal).

No lee DB: todo llega en el body del POST.
"""

from __future__ import annotations

from typing import Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field


NumberLike = Union[str, int, float, None]


class ProductInfo(BaseModel):
    """Datos de catálogo embebidos en equipo/material."""

    model_config = ConfigDict(extra="ignore")

    cod_producto: Optional[str] = None
    descripcion: Optional[str] = None
    unidad: Optional[str] = None
    tipo_de_producto: Optional[str] = None


class EquipoItem(BaseModel):
    """Ítem de equipo enviado desde el Form."""

    model_config = ConfigDict(extra="ignore")

    cantidad: NumberLike = None
    equipo_info: Optional[ProductInfo] = None


class MaterialItem(BaseModel):
    """Ítem de material enviado desde el Form."""

    model_config = ConfigDict(extra="ignore")

    cantidad: NumberLike = None
    material_info: Optional[ProductInfo] = None


class ProyectoInfo(BaseModel):
    """Proyecto embebido en la cotización."""

    model_config = ConfigDict(extra="ignore")

    nombre: Optional[str] = None


class CotizacionInfo(BaseModel):
    """Cotización seleccionada en el Form."""

    model_config = ConfigDict(extra="ignore")

    cod_cotizacion: Optional[str] = None
    precio_dolares: NumberLike = None
    igv: NumberLike = None
    tasa_cambio: NumberLike = None
    proyecto_info: Optional[ProyectoInfo] = None


class ReportFormPayload(BaseModel):
    """Espejo de ReportFormState + listas del Form."""
    tipo: Literal["report"] = "report"
    model_config = ConfigDict(extra="ignore")

    cliente: Optional[str] = None
    ruc_dni: Optional[str] = None
    fecha: Optional[str] = None
    lugar: Optional[str] = None
    atencion: Optional[str] = None
    porcentaje_eqmt: NumberLike = None
    porcentaje_inst: NumberLike = None
    precio_cotizacion: NumberLike = None
    validez_oferta: Optional[str] = None
    plazo_entrega: Optional[str] = None
    tasa_dscto: NumberLike = None
    cotizacion_id: Optional[str] = None
    cotizacion_info: Optional[CotizacionInfo] = None
    equipos: list[EquipoItem] = Field(default_factory=list)
    materiales: list[MaterialItem] = Field(default_factory=list)


class PdfLineItem(BaseModel):
    """Fila lista para tablas del PDF."""

    model_config = ConfigDict(extra="ignore")

    index: int = 0
    descripcion: str = ""
    unidad: str = ""
    cantidad: str = ""


class ReportPdfData(BaseModel):
    """Modelo interno listo para dibujar el PDF."""

    model_config = ConfigDict(extra="ignore")

    cliente: str = ""
    ruc_dni: str = ""
    fecha: str = ""
    lugar: str = ""
    atencion: str = ""
    proyecto: str = ""
    cod_cotizacion: str = ""

    porcentaje_eqmt: float = 0.0
    porcentaje_inst: float = 0.0
    validez_oferta: str = ""
    plazo_entrega: str = ""
    tasa_dscto: float = 0.0
    precio_usd: float = 0.0
    tasa_cambio: float = 1.0
    igv_rate: float = 0.0

    subtotal_sin_dscto: float = 0.0
    precio_dscto: float = 0.0
    subtotal: float = 0.0
    monto_eqmt: float = 0.0
    monto_inst: float = 0.0
    igv: float = 0.0
    total: float = 0.0
    currency_symbol: str = "$"

    equipos: list[PdfLineItem] = Field(default_factory=list)
    materiales: list[PdfLineItem] = Field(default_factory=list)
    puesta_en_marcha: list[str] = Field(default_factory=list)

    filename: str = "cotizacion.pdf"
