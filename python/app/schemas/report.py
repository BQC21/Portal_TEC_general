"""Contrato del payload enviado desde el Form (EditReportModal).

No lee DB: todo llega en el body del POST.
"""

from __future__ import annotations

from typing import Optional, Union

from pydantic import BaseModel, ConfigDict, Field


NumberLike = Union[str, int, float, None]


class ProductInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    cod_producto: Optional[str] = None
    descripcion: Optional[str] = None
    unidad: Optional[str] = None
    tipo_de_producto: Optional[str] = None


class EquipoItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    cantidad: NumberLike = None
    equipo_info: Optional[ProductInfo] = None


class MaterialItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    cantidad: NumberLike = None
    material_info: Optional[ProductInfo] = None


class ProyectoInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    nombre: Optional[str] = None


class CotizacionInfo(BaseModel):
    model_config = ConfigDict(extra="ignore")

    cod_cotizacion: Optional[str] = None
    precio_dolares: NumberLike = None
    igv: NumberLike = None
    tasa_cambio: NumberLike = None
    proyecto_info: Optional[ProyectoInfo] = None


class ReportFormPayload(BaseModel):
    """Espejo de ReportFormState + listas del Form."""

    model_config = ConfigDict(extra="ignore")

    cliente: Optional[str] = None
    ruc_dni: Optional[str] = None
    fecha: Optional[str] = None
    lugar: Optional[str] = None
    atencion: Optional[str] = None
    porcentaje_eqmt: NumberLike = None
    porcentaje_inst: NumberLike = None
    precio_cotizacion: NumberLike = None
    cotizacion_id: Optional[str] = None
    cotizacion_info: Optional[CotizacionInfo] = None
    equipos: list[EquipoItem] = Field(default_factory=list)
    materiales: list[MaterialItem] = Field(default_factory=list)


class PdfLineItem(BaseModel):
    index: int
    codigo: str = ""
    descripcion: str = ""
    unidad: str = ""
    cantidad: str = ""


class ReportPdfData(BaseModel):
    """Modelo interno listo para dibujar el PDF."""

    cliente: str = ""
    ruc_dni: str = ""
    fecha: str = ""
    lugar: str = ""
    atencion: str = ""
    proyecto: str = ""
    cod_cotizacion: str = ""

    porcentaje_eqmt: float = 0.0
    porcentaje_inst: float = 0.0
    precio_usd: float = 0.0
    tasa_cambio: float = 1.0
    igv_rate: float = 0.0

    subtotal: float = 0.0
    monto_eqmt: float = 0.0
    monto_inst: float = 0.0
    igv_eqmt: float = 0.0
    igv_inst: float = 0.0
    total: float = 0.0
    currency_symbol: str = "S/"

    equipos: list[PdfLineItem] = Field(default_factory=list)
    materiales: list[PdfLineItem] = Field(default_factory=list)
    puesta_en_marcha: list[str] = Field(default_factory=list)

    filename: str = "cotizacion.pdf"
