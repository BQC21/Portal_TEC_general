"""Página 1 — Carta de presentación (referencia COT_*.pdf)."""

from __future__ import annotations

from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, Spacer

from app.schemas.report import ReportPdfData

_MESES = {
    1: "Enero",
    2: "Febrero",
    3: "Marzo",
    4: "Abril",
    5: "Mayo",
    6: "Junio",
    7: "Julio",
    8: "Agosto",
    9: "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
}


def _fecha_carta(fecha: str) -> str:
    """Convierte DD/MM/YYYY → 'Lima, 30 de Julio de 2026'."""
    text = (fecha or "").strip()
    if len(text) >= 10 and text[2] == "/" and text[5] == "/":
        try:
            day = int(text[0:2])
            month = int(text[3:5])
            year = int(text[6:10])
            return f"Lima, {day} de {_MESES.get(month, '')} de {year}"
        except ValueError:
            pass
    return f"Lima, {text}" if text else "Lima"


def build_page1(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> list:
    justify = ParagraphStyle(
        "LetterBody",
        parent=styles["body"],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
    )
    greeting = ParagraphStyle(
        "LetterGreeting",
        parent=styles["body"],
        fontSize=11,
        leading=14,
        spaceAfter=4,
    )
    signature = ParagraphStyle(
        "LetterSignature",
        parent=styles["body"],
        fontSize=10,
        leading=13,
        alignment=TA_CENTER,
    )

    story: list = []
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph(_fecha_carta(data.fecha), styles["body"]))
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph("Estimado", greeting))
    story.append(Paragraph(f"<b>{data.cliente or 'Cliente'}</b>", greeting))
    story.append(Spacer(1, 0.6 * cm))

    story.append(
        Paragraph(
            "TEC Soluciones Renovables SAC es una empresa de energías renovables en Perú, "
            "cuya misión es proporcionar soluciones de energía limpia y sostenible que sean "
            "rentables y asequibles para nuestros clientes.",
            justify,
        )
    )
    story.append(
        Paragraph(
            "Contamos con un equipo de especialistas comprometidos con la promoción de "
            "tecnologías fotovoltaicas. Ofrecemos desarrollo, instalación y mantenimiento de "
            "sistemas solares, soluciones para edificaciones sostenibles y consultoría en "
            "políticas de energía con responsabilidad ambiental.",
            justify,
        )
    )
    story.append(
        Paragraph(
            "Esperamos tener la oportunidad de trabajar con ustedes y demostrar el valor de "
            "nuestras soluciones de energía renovable. Si tienen alguna consulta o desean más "
            "información, no duden en ponerse en contacto con nosotros. Quedamos a la espera "
            "de su respuesta para atenderles de manera rápida y eficiente.",
            justify,
        )
    )

    story.append(Spacer(1, 1.5 * cm))
    story.append(Paragraph("Atentamente:", styles["body"]))
    story.append(Spacer(1, 2.0 * cm))
    story.append(Paragraph("______________________", signature))
    story.append(Paragraph("<b>Ing. Jorge Guerrero Tarazona</b>", signature))
    story.append(Paragraph("Gerente General", signature))
    story.append(Spacer(1, 2.0 * cm))
    ## Añadir link a tec-renovables (https://tec-renovables.pe/) 

    return story
