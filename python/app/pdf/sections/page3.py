"""Página 3 — Notas finales para suministro (referencia COT_*.pdf)."""

from __future__ import annotations

from pathlib import Path

from reportlab.graphics.shapes import Circle, Drawing, Ellipse, Line
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Flowable, Image, Paragraph, Spacer, Table, TableStyle

from app.schemas.report import ReportPdfData

_ASSETS = Path(__file__).resolve().parents[3] / "assets" / "images"
_SIDEBAR_W = 0.6 * cm
_CONTENT_INDENT = 1.15 * cm
_CONTENT_W = 16.85 * cm
_LINK_BLUE = colors.HexColor("#0A2F6B")

_SERVICIOS_INCLUIDOS = [
    "Instalación completa, conexión eléctrica y puesta en funcionamiento del sistema.",
    "Revisión de planos eléctricos y entrega del plano multifilar del sistema instalado.",
    "Entrega de manual de usuario y mantenimiento.",
    "Monitoreo remoto gratuito durante el primer año, sujeto a disponibilidad de internet.",
    "Un (01) mantenimiento preventivo gratuito dentro de los primeros seis meses posteriores a la puesta en servicio del sistema, previa coordinación.",
]

_TERMINOS_Y_CONDICIONES = [
    "No incluye estructuras o refuerzos adicionales, obras civiles ni trabajos no contemplados en el alcance.",
    "No incluye la implementación de sistema de protección contra descargas atmosféricas (pararrayos)."
    "Cualquier trabajo adicional será previamente cotizado y ejecutado únicamente con la aprobación del cliente."
]

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


def _brand_header() -> Table:
    """Logo + barras Detail_1, sangrados respecto al sidebar."""
    logo = _rl_image("Tec_ES_logo.png", width=5.2 * cm, height= 2.2 * cm)
    detail = _rl_image("Detail_1_page1.png", width=1.2 * cm, height= 1.2 * cm)
    inner = Table([[logo, detail]], colWidths=[10.2 * cm, 5.2 * cm])
    inner.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (0, 0), "LEFT"),
                ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
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
        "Page3Link",
        fontName="Helvetica",
        fontSize=9,
        textColor=_LINK_BLUE,
        alignment=TA_LEFT,
    )
    link = Paragraph(
        '<link href="https://tec-renovables.pe/"><font color="#0A2F6B"><u>www.tec-renovables.pe</u></font></link>',
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


def build_page3(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> list:
    note_style = ParagraphStyle(
        "NoteBody",
        parent=styles["body"],
        fontSize=10,
        leading=14,
        leftIndent=_CONTENT_INDENT + 12,
        spaceAfter=6,
    )
    section_style = ParagraphStyle(
        "NoteSection",
        parent=styles["section"],
        leftIndent=_CONTENT_INDENT,
    )
    footer_style = ParagraphStyle(
        "NoteFooter",
        parent=styles["body"],
        fontSize=10,
        leading=14,
        spaceBefore=6,
        leftIndent=_CONTENT_INDENT,
    )

    story: list = []
    story.append(_brand_header())
    story.append(
        _LeftMarginDetail("Detail_2_page2.png", width=_SIDEBAR_W, height=16.2 * cm)
    )
    story.append(Spacer(1, 2.35 * cm))
    story.append(Paragraph("<b>Notas finales para suministro:</b>", section_style))
    story.append(Spacer(1, 0.2 * cm))

    for text in _SERVICIOS_INCLUIDOS:
        story.append(Paragraph(f"•  {text}", note_style))

    story.append(Spacer(1, 0.2 * cm))

    for text in _TERMINOS_Y_CONDICIONES:
        story.append(Paragraph(f"•  {text}", note_style))

    story.append(Spacer(1, 1.45 * cm))
    story.append(Paragraph("<b>Vida útil del sistema:</b> 20 años.", footer_style))
    story.append(
        Paragraph(
            "<b>Garantía de equipos:</b> Según marca proveedora del equipo",
            footer_style,
        )
    )

    story.append(Spacer(1, 2.2 * cm))
    story.append(_website_right())

    _ = data
    return story
