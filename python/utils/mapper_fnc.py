from __future__ import annotations

import math
import re
import unicodedata
from datetime import datetime
from typing import Any

from app.schemas.report import EquipoItem
from utils.default_items import PANELES_POR_PALET

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
