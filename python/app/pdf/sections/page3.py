"""Página 3 — Notas finales para suministro (referencia COT_*.pdf)."""

from __future__ import annotations

from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, Spacer

from app.schemas.report import ReportPdfData

_NOTAS = [
    "Instalación completa del sistema solar fotovoltaico, incluyendo la conexión eléctrica y pruebas de funcionamiento.",
    "Incluye revisión de planos eléctricos.",
    "Incluye entrega de plano unifilar y multifilar del sistema instalado.",
    "Incluye entrega de manual de usuario.",
    "Incluye monitoreo gratuito el primer año y mantenimiento dentro de los 6 primeros meses.",
    "No incluye estructuras adicionales a las necesarias para montar.",
]


def build_page3(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> list:
    note_style = ParagraphStyle(
        "NoteBody",
        parent=styles["body"],
        fontSize=10,
        leading=14,
        leftIndent=15,
        spaceAfter=6,
    )
    footer_style = ParagraphStyle(
        "NoteFooter",
        parent=styles["body"],
        fontSize=10,
        leading=14,
        spaceBefore=6,
    )

    story: list = []
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph("<b>Notas finales para suministro:</b>", styles["section"]))
    story.append(Spacer(1, 0.3 * cm))

    for text in _NOTAS:
        story.append(Paragraph(f"•  {text}", note_style))

    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph("<b>Vida útil del sistema:</b> 20 años.", footer_style))
    story.append(
        Paragraph(
            "<b>Garantía de equipos:</b> Según marca proveedora del equipo",
            footer_style,
        )
    )

    _ = data
    return story
