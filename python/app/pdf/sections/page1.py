"""Página 1 — Carta de presentación (referencia COT_*.pdf)."""

from __future__ import annotations

from pathlib import Path

from reportlab.graphics.shapes import Circle, Drawing, Ellipse, Line
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Flowable, Image, Paragraph, Spacer, Table, TableStyle

from app.schemas.report import ReportPdfData

_ASSETS = Path(__file__).resolve().parents[3] / "assets" / "images"
_SIDEBAR_W = 0.6 * cm
_CONTENT_INDENT = 1.15 * cm
_CONTENT_W = 16.85 * cm
_LINK_BLUE = colors.HexColor("#0A2F6B")

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


def _rl_image(name: str, width: float, height: float | None = None) -> Image | Spacer:
    path = _ASSETS / name
    if not path.exists():
        return Spacer(width, height or 0.5 * cm)
    if height is None:
        return Image(str(path), width=width)
    return Image(str(path), width=width, height=height)


class _LeftMarginDetail(Flowable):
    """Barra lateral decorativa (Detail_2) sin consumir alto del flujo."""

    def __init__(self, filename: str, width: float, height: float, x_offset: float = -0.15 * cm):
        super().__init__()
        self.path = str(_ASSETS / filename)
        self.img_w = width
        self.img_h = height
        self.x_offset = x_offset
        self.width = 0
        self.height = 0

    def draw(self) -> None:
        if not Path(self.path).exists():
            return
        self.canv.drawImage(
            self.path,
            self.x_offset,
            -self.img_h + 0.5 * cm,
            width=self.img_w,
            height=self.img_h,
            mask="auto",
            preserveAspectRatio=True,
        )


def _globe_icon(size: float = 10) -> Drawing:
    """Ícono simple de globo terráqueo."""
    d = Drawing(size, size)
    cx = cy = size / 2
    r = size / 2 - 0.6
    stroke = _LINK_BLUE
    d.add(Circle(cx, cy, r, strokeColor=stroke, fillColor=None, strokeWidth=0.9))
    d.add(Ellipse(cx, cy, r * 0.45, r, strokeColor=stroke, fillColor=None, strokeWidth=0.7))
    d.add(Line(cx - r, cy, cx + r, cy, strokeColor=stroke, strokeWidth=0.7))
    d.add(Line(cx - r * 0.85, cy + r * 0.45, cx + r * 0.85, cy + r * 0.45, strokeColor=stroke, strokeWidth=0.55))
    d.add(Line(cx - r * 0.85, cy - r * 0.45, cx + r * 0.85, cy - r * 0.45, strokeColor=stroke, strokeWidth=0.55))
    return d


def _fecha_carta(fecha: str) -> str:
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


def _brand_header() -> Table:
    """Logo TEC (más grande) + barras Detail_1."""
    logo = _rl_image("Tec_ES_logo.png", width=5.2 * cm)
    detail = _rl_image("Detail_1_page1.png", width=1.9 * cm)
    inner = Table([[logo, detail]], colWidths=[12.2 * cm, 4.65 * cm])
    inner.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (0, 0), "LEFT"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    # Respeta el margen del sidebar
    wrapped = Table([[inner]], colWidths=[_CONTENT_W])
    wrapped.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), _CONTENT_INDENT),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return wrapped


def _website_right() -> Table:
    link_style = ParagraphStyle(
        "Page1Link",
        fontName="Helvetica",
        fontSize=9,
        textColor=_LINK_BLUE,
        alignment=TA_LEFT,
    )
    link = Paragraph(
        f'<link href="https://tec-renovables.pe/"><font color="#0A2F6B"><u>www.tec-renovables.pe</u></font></link>',
        link_style,
    )
    inner = Table([[_globe_icon(11), link]], colWidths=[0.45 * cm, 4.6 * cm])
    inner.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 1),
                ("ALIGN", (0, 0), (0, 0), "CENTER"),
            ]
        )
    )
    outer = Table([[inner]], colWidths=[_CONTENT_W])
    outer.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), _CONTENT_INDENT),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return outer


def build_page1(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> list:
    justify = ParagraphStyle(
        "LetterBody",
        parent=styles["body"],
        fontSize=10,
        leading=13,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        leftIndent=_CONTENT_INDENT,
        rightIndent=0,
    )
    greeting = ParagraphStyle(
        "LetterGreeting",
        parent=styles["body"],
        fontSize=11,
        leading=14,
        spaceAfter=4,
        leftIndent=_CONTENT_INDENT,
    )
    date_style = ParagraphStyle(
        "LetterDate",
        parent=styles["body"],
        leftIndent=_CONTENT_INDENT,
    )
    signature = ParagraphStyle(
        "LetterSignature",
        parent=styles["body"],
        fontSize=10,
        leading=13,
        alignment=TA_CENTER,
        leftIndent=_CONTENT_INDENT,
    )
    atentamente = ParagraphStyle(
        "LetterAtentamente",
        parent=styles["body"],
        leftIndent=_CONTENT_INDENT,
    )

    story: list = []
    story.append(
        _LeftMarginDetail("Detail_2_page2.png", width=_SIDEBAR_W, height=16.2 * cm)
    )
    story.append(_brand_header())
    story.append(Spacer(1, 0.45 * cm))
    story.append(Paragraph(_fecha_carta(data.fecha), date_style))
    story.append(Spacer(1, 0.55 * cm))
    story.append(Paragraph("Estimado", greeting))
    story.append(Paragraph(f"<b>{data.cliente or 'Cliente'}</b>", greeting))
    story.append(Spacer(1, 0.35 * cm))

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

    story.append(Spacer(1, 0.6 * cm))
    story.append(Paragraph("Atentamente:", atentamente))
    story.append(Spacer(1, 0.2 * cm))

    firm = _rl_image("Coco_Firm.png", width=5.0 * cm)
    firm_table = Table([[firm]], colWidths=[_CONTENT_W])
    firm_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), _CONTENT_INDENT),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(firm_table)
    story.append(Paragraph("<b>Ing. Jorge Guerrero Tarazona</b>", signature))
    story.append(Paragraph("Gerente General", signature))
    story.append(Spacer(1, 0.7 * cm))
    story.append(_website_right())

    return story
