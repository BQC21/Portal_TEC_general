"""Ensambla el story del PDF a partir de las 3 secciones (páginas)."""

from __future__ import annotations

from reportlab.platypus import PageBreak

from app.pdf.sections.page1 import build_page1
from app.pdf.sections.page2 import build_page2
from app.pdf.sections.page3 import build_page3
from app.pdf.styles import _styles
from app.schemas.report import ReportPdfData


def build_story(data: ReportPdfData) -> list:
    """
    Estructura alineada al PDF de referencia (3 páginas):
        1) Carta de presentación
        2) Cotización (ítems + totales + condiciones)
        3) Notas finales
    """
    styles = _styles()
    story: list = []

    story.extend(build_page1(data, styles))
    story.append(PageBreak())
    story.extend(build_page2(data, styles))
    story.append(PageBreak())
    story.extend(build_page3(data, styles))

    return story
