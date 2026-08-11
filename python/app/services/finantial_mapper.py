"""Transforma el payload del Form en el modelo interno del PDF financiero."""

from __future__ import annotations

from typing import Any

from app.schemas.finantial import (
    EnergyRowData,
    FinantialFormPayload,
    FinantialPdfData,
    FlowRowData,
)


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


def _safe_filename(*parts: str) -> str:
    chunks: list[str] = []
    for part in parts:
        cleaned = "".join(
            ch if ch.isalnum() or ch in (" ", "-", "_") else "_" for ch in part
        ).strip()
        if cleaned:
            chunks.append(cleaned.replace(" ", "_"))
    base = "_".join(chunks) if chunks else "analisis_financiero"
    return f"{base}.pdf"


def map_finantial_form(payload: FinantialFormPayload) -> FinantialPdfData:
    cotizacion = payload.cotizacion_info
    cod_cotizacion = ""
    proyecto_nombre = ""

    if cotizacion:
        cod_cotizacion = _to_str(cotizacion.cod_cotizacion)
        if cotizacion.proyecto_info:
            proyecto_nombre = _to_str(cotizacion.proyecto_info.nombre)

    flow_rows = [
        FlowRowData(
            year=row.year,
            equipamiento=row.equipamiento,
            tarifa_cliente=row.tarifa_cliente,
            om=row.om,
            energy_mwh=row.energy_mwh,
            ahorro=row.ahorro,
            flujo_total=_to_float(row.flujo_total),
            flujo_acumulado=_to_float(row.flujo_acumulado),
        )
        for row in payload.flow_rows
    ]

    energy_rows = [
        EnergyRowData(
            year=row.year,
            energy_mwh=_to_float(row.energy_mwh),
            degradation_pct=_to_float(row.degradation_pct),
        )
        for row in payload.energy_rows
    ]

    beneficio = _to_float(payload.beneficio_acumulado)
    if beneficio == 0.0 and flow_rows:
        beneficio = flow_rows[-1].flujo_acumulado

    filename = _safe_filename(
        "FINANTIAL",
        cod_cotizacion or proyecto_nombre or "analisis_financiero",
    )

    return FinantialPdfData(
        proyecto=proyecto_nombre,
        cod_cotizacion=cod_cotizacion,
        planta=_to_float(payload.planta),
        generacion=_to_float(payload.generacion),
        tarifa_red=_to_float(payload.tarifa_red),
        degra_1er=_to_float(payload.degra_1er),
        degra_2do=_to_float(payload.degra_2do),
        tarifa_crecimiento=_to_float(payload.tarifa_crecimiento),
        tasa_descuento=_to_float(payload.tasa_descuento),
        capex=_to_float(payload.capex),
        opex=_to_float(payload.opex),
        tiempo_retorno=_to_float(payload.tiempo_retorno),
        lcoe=_to_float(payload.lcoe),
        van=_to_float(payload.van),
        capex_total=_to_float(payload.capex_total),
        om_total=_to_float(payload.om_total),
        energia_total=_to_float(payload.energia_total),
        beneficio_acumulado=beneficio,
        flow_rows=flow_rows,
        energy_rows=energy_rows,
        filename=filename,
    )
