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
DEFAULT_PAY_FORMAT = "50% Con la orden de servicio\n50% Al término de instalación"


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
        # Considerar la visibilidad configurada en el modal de Reportes
        if item.visible is False:
            continue
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
    tasa_dscto = _to_float(payload.tasa_dscto)
    opcion_dscto = _to_str(payload.opcion_dscto)
    formato_dscto = _to_str(payload.formato_dscto, "Porcentaje")
    pay_format = _to_str(payload.payFormat, DEFAULT_PAY_FORMAT)

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

    # El reporte de cotización se emite siempre en USD (mismo criterio que los modales).
    currency_symbol = "$"

    ## --------
    ## Calculos
    ## --------
    # Precio base (sin IGV). Siempre definido, con o sin descuento,
    # para que EQUIPOS + PUESTA EN MARCHA = este monto.
    subtotal_sin_dscto = round(precio_usd, 2)
    monto_eqmt = round(subtotal_sin_dscto * (pct_eqmt / 100.0), 2)
    if abs((pct_eqmt + pct_inst) - 100.0) < 1e-9:
        monto_inst = round(subtotal_sin_dscto - monto_eqmt, 2)
    else:
        monto_inst = round(subtotal_sin_dscto * (pct_inst / 100.0), 2)

    # IGV de cotización es factor (0.18) o % (18).
    igv_factor = igv_rate / 100.0 if igv_rate > 1 else igv_rate

    # Descuento: Porcentaje → subtotal * (1 - tasa/100); USD → subtotal - tasa.
    aplica_dscto = opcion_dscto == "CON DSCTO" and tasa_dscto > 0
    if aplica_dscto and formato_dscto.upper() == "USD":
        precio_dscto = round(min(tasa_dscto, subtotal_sin_dscto), 2)
    elif aplica_dscto:
        precio_dscto = round(subtotal_sin_dscto * (tasa_dscto / 100.0), 2)
    else:
        precio_dscto = 0.0
    subtotal = round(subtotal_sin_dscto - precio_dscto, 2)
    igv = round(subtotal * igv_factor, 2)
    total = round(subtotal + igv, 2)

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
        validez_oferta=_to_str(payload.validez_oferta),
        plazo_entrega=_to_str(payload.plazo_entrega),
        precio_usd=precio_usd,
        tasa_cambio=tasa_cambio,
        tasa_dscto=tasa_dscto,
        opcion_dscto=opcion_dscto,
        formato_dscto=formato_dscto,
        payFormat=pay_format,
        igv_rate=igv_rate,
        subtotal=subtotal,
        precio_dscto=precio_dscto,
        subtotal_sin_dscto=subtotal_sin_dscto,
        monto_eqmt=monto_eqmt,
        monto_inst=monto_inst,
        igv=igv,
        total=total,
        currency_symbol=currency_symbol,
        equipos=_map_equipos(payload.equipos),
        materiales=_map_materiales(payload.materiales),
        puesta_en_marcha=list(PUESTA_EN_MARCHA_ITEMS),
        filename=filename,
    )
