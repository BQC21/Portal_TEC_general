"""Fachada del servicio PDF: ReportPdfData → bytes."""

from __future__ import annotations

from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate

from app.pdf.builder import build_story, build_finantial
from app.schemas.report import ReportPdfData
from app.schemas.finantial import FinantialPdfData 

def generate_report_pdf(data: ReportPdfData | FinantialPdfData) -> tuple[bytes, str]:
    buffer = BytesIO()

    if isinstance(data, FinantialPdfData):
        title = getattr(data, "cod_cotizacion", None) or "Análisis financiero"
        story = build_finantial(data)   # pages de python/app/pdf/finantial/
    else:
        title = data.cod_cotizacion or "Cotización"
        story = build_story(data)             # pages de python/app/pdf/sections/


    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title=title,
        author="TEC",
    )
    doc.build(story)
    return buffer.getvalue(), data.filename
