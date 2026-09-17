"""Transforma el payload del Form en el modelo interno del PDF."""

from __future__ import annotations

import math
import re
import unicodedata
from datetime import datetime
from typing import Any

from app.schemas.report import (
    EquipoItem,
    MaterialItem,
    PdfLineItem,
    PuestaEnMarchaItem,
    ReportFormPayload,
    ReportPdfData,
)

# Alineado a MO_Content (ids "1".."12") / PDF de referencia
PUESTA_EN_MARCHA_ITEMS: list[tuple[str, str]] = [
    ("1", "Acarreo de materiales para instalación"),
    ("2", "Realizar trazos y medidas"),
    ("3", "Montaje de estructura metálica"),
    ("4", "Instalación de paneles (Estructura)"),
    ("5", "Instalación de paneles (Conexionado)"),
    ("6", "Armado de tablero DC / AC"),
    ("7", "Instalación de tablero FV"),
    ("8", "Instalación de inversor"),
    ("9", "Canalización de acometida DC"),
    ("10", "Canalización de acometida AC"),
    ("11", "Mediciones, pruebas eléctricas, ajustes y optimización"),
    ("12", "Conexión, programación, control y puesta en marcha"),
    ("13", "Viáticos"),
]

# Filtro alineado con Eq_Mat_Content
MATERIAL_TIPOS_ELECTRICOS = {"PROTECCION", "CABLE"}
MATERIAL_TIPOS_CANALIZACION = {"CANALIZACION"}
DEFAULT_PAY_FORMAT = "50% Con la orden de servicio\n50% Al término de instalación"
PANELES_POR_PALET = 36


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


def _normalize_tipo(tipo: str) -> str:
    stripped = unicodedata.normalize("NFD", tipo.strip().upper())
    return "".join(ch for ch in stripped if unicodedata.category(ch) != "Mn")


def _is_modulo_fv(tipo: str) -> bool:
    return _normalize_tipo(tipo) in {"MODULO FV", "MODULO"}


def _is_palet_unidad(unidad: str, descripcion: str = "") -> bool:
    normalized = unidad.strip().lower()
    if normalized in {"palet", "palets", "pallet", "pallets"}:
        return True
    return bool(re.search(r"\bpal+ets?\b", descripcion, flags=re.IGNORECASE))


def _resolve_paneles_por_palet(items: list[EquipoItem]) -> int:
    palet_item = next(
        (
            item
            for item in items
            if item.equipo_info
            and _is_palet_unidad(
                _to_str(item.equipo_info.unidad),
                _to_str(item.equipo_info.descripcion),
            )
        ),
        None,
    )
    if palet_item and palet_item.equipo_info:
        from_palet = int(_to_float(palet_item.equipo_info.paneles_palet))
        if from_palet > 0:
            return from_palet
    for item in items:
        value = int(_to_float(item.equipo_info.paneles_palet if item.equipo_info else None))
        if value > 0:
            return value
    return PANELES_POR_PALET


def _cantidad_modulo_en_unidades(
    cantidad: Any,
    unidad: str,
    paneles_palet: Any = None,
    descripcion: str = "",
) -> int:
    n = max(0, int(math.ceil(_to_float(cantidad))))
    if not _is_palet_unidad(unidad, descripcion):
        return n
    por_palet = int(_to_float(paneles_palet))
    if por_palet <= 0:
        por_palet = PANELES_POR_PALET
    return n * por_palet


def _map_equipos(items: list[EquipoItem]) -> list[PdfLineItem]:
    visible_items = [item for item in items if item.visible is not False]
    modulo_items = [
        item
        for item in visible_items
        if item.equipo_info and _is_modulo_fv(_to_str(item.equipo_info.tipo_de_producto))
    ]
    lines: list[PdfLineItem] = []
    index = 1
    emitted_modulos = False

    for item in visible_items:
        info = item.equipo_info
        if not info:
            continue

        is_modulo = _is_modulo_fv(_to_str(info.tipo_de_producto))
        if not is_modulo and not _to_str(info.descripcion):
            continue

        if is_modulo:
            if emitted_modulos:
                continue
            emitted_modulos = True
            if not modulo_items:
                continue
            paneles_por_palet = _resolve_paneles_por_palet(modulo_items)
            cantidad = sum(
                _cantidad_modulo_en_unidades(
                    candidate.cantidad,
                    _to_str(candidate.equipo_info.unidad if candidate.equipo_info else ""),
                    paneles_por_palet,
                    _to_str(candidate.equipo_info.descripcion if candidate.equipo_info else ""),
                )
                for candidate in modulo_items
            )
            lines.append(
                PdfLineItem(
                    index=index,
                    descripcion="Módulo fotovoltaico",
                    unidad="Unidad",
                    cantidad=str(cantidad),
                )
            )
            index += 1
            continue

        lines.append(
            PdfLineItem(
                index=index,
                descripcion=_to_str(info.descripcion),
                unidad=_to_str(info.unidad, "UNI"),
                cantidad=str(max(0, math.ceil(_to_float(item.cantidad)))),
            )
        )
        index += 1
    return lines


def _map_materiales_por_tipo(
    items: list[MaterialItem],
    allowed_tipos: set[str],
) -> list[PdfLineItem]:
    lines: list[PdfLineItem] = []
    index = 1
    for item in items:
        if item.visible is False:
            continue
        info = item.material_info
        if not info or not _to_str(info.descripcion):
            continue
        tipo = _normalize_tipo(_to_str(info.tipo_de_producto))
        if tipo not in allowed_tipos:
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


def _map_puesta_en_marcha(
    hidden_ids: list[str],
    items: list[PuestaEnMarchaItem] | None = None,
) -> list[str]:
    if items is not None:
        return [
            _to_str(item.descripcion)
            for item in items
            if item.visible is not False and _to_str(item.descripcion)
        ]
    hidden = {str(item_id).strip() for item_id in hidden_ids if str(item_id).strip()}
    return [desc for item_id, desc in PUESTA_EN_MARCHA_ITEMS if item_id not in hidden]


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
        opcion_firma=_to_str(payload.opcion_firma),
        incluir_firma=_to_str(payload.opcion_firma).upper() == "CON FIRMA",
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
        materiales=_map_materiales_por_tipo(payload.materiales, MATERIAL_TIPOS_ELECTRICOS),
        canalizacion=_map_materiales_por_tipo(payload.materiales, MATERIAL_TIPOS_CANALIZACION),
        show_electrical_materials=bool(payload.show_electrical_materials),
        show_canalization_materials=bool(payload.show_canalization_materials),
        puesta_en_marcha=_map_puesta_en_marcha(
            payload.hidden_mo_ids,
            payload.puesta_en_marcha_items,
        ),
        filename=filename,
    )
