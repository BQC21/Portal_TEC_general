"""Transforma el payload del Form en el modelo interno del PDF."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from app.schemas.report import (
    EquipoItem,
    MaterialItem,
    PdfLineItem,
    ReportFormPayload,
    ReportPdfData,
)

# Alineado a MO_Content / PDF de referencia
PUESTA_EN_MARCHA_ITEMS = [
    "Acarreo de materiales para instalación",
    "Realizar trazos y medidas",
    "Montaje de estructura metálica",
    "Instalación de paneles (Estructura)",
    "Instalación de paneles (Conexionado)",
    "Instalación de tablero FV",
    "Instalación de inversor",
    "Canalización de acometida DC",
    "Canalización de acometida AC",
    "Mediciones, pruebas eléctricas, ajustes y optimización",
    "Conexión, programación, control y puesta en marcha",
    "Viáticos",
]

# Filtro alineado con Eq_Mat_Content
MATERIAL_TIPOS_VISIBLE = {"PROTECCIÓN", "CABLE", "PROTECCION"}


def _to_float(value: Any, default: float = 0.0) -> float:
    if value is None or value == "":
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_str(value: Any, default: str = "") -> str:
    if value is None:
        return default
    text = str(value).strip()
    return text if text else default


def _format_fecha(raw: str | None) -> str:
    if not raw:
        return ""
    text = raw.strip()

    # YYYY-MM-DD...
    if len(text) >= 10 and text[4] == "-" and text[7] == "-":
        try:
            return datetime.strptime(text[:10], "%Y-%m-%d").strftime("%d/%m/%Y")
        except ValueError:
            pass

    # Ya viene DD/MM/YYYY
    if len(text) >= 10 and text[2] == "/" and text[5] == "/":
        return text[:10]

    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00")).strftime("%d/%m/%Y")
    except ValueError:
        return text


def _safe_filename(*parts: str) -> str:
    chunks: list[str] = []
    for part in parts:
        cleaned = "".join(
            ch if ch.isalnum() or ch in (" ", "-", "_") else "_" for ch in part
        ).strip()
        if cleaned:
            chunks.append(cleaned.replace(" ", "_"))
    base = "_".join(chunks) if chunks else "cotizacion"
    return f"{base}.pdf"


def _map_equipos(items: list[EquipoItem]) -> list[PdfLineItem]:
    lines: list[PdfLineItem] = []
    index = 1
    for item in items:
        info = item.equipo_info
        if not info or not _to_str(info.descripcion):
            continue
        lines.append(
            PdfLineItem(
                index=index,
                descripcion=_to_str(info.descripcion),
                unidad=_to_str(info.unidad, "UNI"),
                cantidad=_to_str(item.cantidad, "0"),
            )
        )
        index += 1
    return lines


def _map_materiales(items: list[MaterialItem]) -> list[PdfLineItem]:
    lines: list[PdfLineItem] = []
    index = 1
    for item in items:
        info = item.material_info
        if not info or not _to_str(info.descripcion):
            continue
        tipo = _to_str(info.tipo_de_producto).upper()
        if tipo and tipo not in MATERIAL_TIPOS_VISIBLE:
            continue
        lines.append(
            PdfLineItem(
                index=index,
                descripcion=_to_str(info.descripcion),
                unidad=_to_str(info.unidad, "GLB"),
                cantidad=_to_str(item.cantidad, ""),
            )
        )
        index += 1
    return lines


def map_report_form(payload: ReportFormPayload) -> ReportPdfData:
    cotizacion = payload.cotizacion_info
    proyecto_nombre = "" 
    cod_cotizacion = "" 
    precio_usd = _to_float(payload.precio_cotizacion)
    igv_rate = 0.0
    tasa_cambio = 0.0

    if cotizacion:
        cod_cotizacion = _to_str(cotizacion.cod_cotizacion)
        if cotizacion.proyecto_info:
            proyecto_nombre = _to_str(cotizacion.proyecto_info.nombre)

        precio_from_quote = _to_float(cotizacion.precio_dolares)
        if precio_from_quote > 0:
            precio_usd = precio_from_quote

        igv_rate = _to_float(cotizacion.igv)
        tasa_cambio = _to_float(cotizacion.tasa_cambio)

    pct_eqmt = _to_float(payload.porcentaje_eqmt)
    pct_inst = _to_float(payload.porcentaje_inst)

    # Con tipo de cambio (> 0) se reporta en soles; si no, en USD
    use_soles = tasa_cambio > 0
    if not use_soles:
        tasa_cambio = 1.0

    
    ## Definir simbolo de moneda
    currency_symbol = "S/" if use_soles else "$"

    ## --------
    ## Calculos
    ## -------- 
    subtotal = precio_usd * tasa_cambio if use_soles else precio_usd
    monto_eqmt = subtotal * (pct_eqmt / 100.0)
    monto_inst = subtotal * (pct_inst / 100.0)
    igv_eqmt = monto_eqmt * igv_rate
    igv_inst = 0.0  # alineado al PDF de referencia
    total = subtotal + igv_eqmt + igv_inst

    ## Nombre del cliente
    cliente = _to_str(payload.cliente)

    ## Archivo a guardarse
    filename = _safe_filename(
        "COT",
        cod_cotizacion or proyecto_nombre or "reporte",
        cliente,
    )

    return ReportPdfData(
        cliente=cliente,
        ruc_dni=_to_str(payload.ruc_dni),
        fecha=_format_fecha(payload.fecha),
        lugar=_to_str(payload.lugar),
        atencion=_to_str(payload.atencion),
        proyecto=proyecto_nombre,
        cod_cotizacion=cod_cotizacion,
        porcentaje_eqmt=pct_eqmt,
        porcentaje_inst=pct_inst,
        precio_usd=precio_usd,
        tasa_cambio=tasa_cambio,
        igv_rate=igv_rate,
        subtotal=subtotal,
        monto_eqmt=monto_eqmt,
        monto_inst=monto_inst,
        igv_eqmt=igv_eqmt,
        igv_inst=igv_inst,
        total=total,
        currency_symbol=currency_symbol,
        equipos=_map_equipos(payload.equipos),
        materiales=_map_materiales(payload.materiales),
        puesta_en_marcha=list(PUESTA_EN_MARCHA_ITEMS),
        filename=filename,
    )
