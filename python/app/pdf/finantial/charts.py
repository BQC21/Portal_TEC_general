"""Helpers de gráficas (matplotlib → Image de ReportLab) para el PDF financiero."""

from __future__ import annotations

from io import BytesIO

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from reportlab.lib.units import cm
from reportlab.platypus import Image, Spacer

from app.schemas.finantial import FinantialPdfData


def _fig_to_image(fig: plt.Figure, width: float, height: float) -> Image:
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=140, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    buf.seek(0)
    return Image(buf, width=width, height=height)


def build_components_chart(data: FinantialPdfData, width: float = 16 * cm, height: float = 7.2 * cm):
    """Figura 1: barras de equipamiento / O&M / ahorro."""
    rows = data.flow_rows
    if not rows:
        return Spacer(width, height)

    years = [row.year for row in rows]
    equip = [row.equipamiento or 0.0 for row in rows]
    om = [row.om or 0.0 for row in rows]
    ahorro = [row.ahorro or 0.0 for row in rows]

    fig, ax = plt.subplots(figsize=(9.2, 3.6))
    x = list(range(len(years)))
    bar_w = 0.28
    ax.bar([i - bar_w for i in x], equip, width=bar_w, color="#1d4ed8", label="Equipamiento")
    ax.bar(x, om, width=bar_w, color="#94a3b8", label="O&M")
    ax.bar([i + bar_w for i in x], ahorro, width=bar_w, color="#ea580c", label="Ahorro")

    ax.set_title("Componentes del flujo (ahorro)", fontsize=11, pad=8)
    ax.set_xticks(x[:: max(1, len(x) // 12)])
    ax.set_xticklabels([str(years[i]) for i in range(0, len(years), max(1, len(x) // 12))], rotation=40, ha="right", fontsize=7)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"${v:,.0f}"))
    ax.grid(True, which="both", linestyle="-", linewidth=0.4, color="#cbd5e1")
    ax.set_axisbelow(True)
    ax.legend(fontsize=7, loc="upper right")
    fig.tight_layout()
    return _fig_to_image(fig, width, height)


def build_combo_chart(data: FinantialPdfData, width: float = 16 * cm, height: float = 7.2 * cm):
    """Figura 2: barras de flujo total + línea de flujo acumulado."""
    rows = data.flow_rows
    if not rows:
        return Spacer(width, height)

    years = [row.year for row in rows]
    total = [row.flujo_total for row in rows]
    acum = [row.flujo_acumulado for row in rows]

    fig, ax = plt.subplots(figsize=(9.2, 3.6))
    x = list(range(len(years)))
    ax.bar(x, total, color="#38bdf8", width=0.65, label="Flujo total", alpha=0.9)
    ax.plot(x, acum, color="#be123c", linewidth=2.0, marker="o", markersize=2.5, label="Flujo acumulado")

    ax.axhline(0, color="#94a3b8", linewidth=1.0)
    ax.set_title("Flujo total y acumulado", fontsize=11, pad=8)
    ax.set_xticks(x[:: max(1, len(x) // 12)])
    ax.set_xticklabels([str(years[i]) for i in range(0, len(years), max(1, len(x) // 12))], rotation=40, ha="right", fontsize=7)
    ax.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"${v:,.0f}"))
    ax.grid(True, which="both", linestyle="-", linewidth=0.4, color="#cbd5e1")
    ax.set_axisbelow(True)
    ax.legend(fontsize=7, loc="upper left")
    fig.tight_layout()
    return _fig_to_image(fig, width, height)
