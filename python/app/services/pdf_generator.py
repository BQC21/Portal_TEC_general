"""Fachada del servicio PDF: ReportPdfData → bytes."""

from __future__ import annotations

from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate

from app.pdf.builder import build_story
from app.schemas.report import ReportPdfData


def generate_report_pdf(data: ReportPdfData) -> tuple[bytes, str]:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
        title=data.cod_cotizacion or "Cotización",
        author="TEC",
    )
    doc.build(build_story(data))
    return buffer.getvalue(), data.filename
