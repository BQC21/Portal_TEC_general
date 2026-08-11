"""Página 2 — Gráficas, conclusiones y firma del análisis financiero."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Flowable, Image, Paragraph, Spacer, Table, TableStyle

from app.pdf.finantial.charts import build_combo_chart, build_components_chart
from app.schemas.finantial import FinantialPdfData

_ASSETS = Path(__file__).resolve().parents[3] / "assets" / "images"
_SIDEBAR_W = 0.55 * cm
_CONTENT_W = 17.5 * cm
_LINK_BLUE = colors.HexColor("#0A2F6B")


def _rl_image(name: str, width: float, height: float | None = None) -> Image | Spacer:
    path = _ASSETS / name
    if not path.exists():
        return Spacer(width, height or 0.5 * cm)
    if height is None:
        return Image(str(path), width=width)
    return Image(str(path), width=width, height=height)


class _LeftMarginDetail(Flowable):
    def __init__(self, filename: str, width: float, height: float, x_offset: float = -0.25 * cm):
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
            -self.img_h + 0.4 * cm,
            width=self.img_w,
            height=self.img_h,
            mask="auto",
            preserveAspectRatio=True,
        )


def _money(value: float) -> str:
    sign = "-" if value < 0 else ""
    return f"{sign}$ {abs(value):,.2f}"


def build_page2(data: FinantialPdfData, styles: dict[str, ParagraphStyle]) -> list:
    caption = ParagraphStyle(
        "FinCaption",
        parent=styles["small"],
        fontSize=8,
        leading=10,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#334155"),
        spaceBefore=2,
        spaceAfter=8,
    )
    section = ParagraphStyle(
        "FinConclTitle",
        parent=styles["section"],
        fontSize=12,
        textColor=_LINK_BLUE,
        spaceBefore=6,
        spaceAfter=6,
    )
    body = ParagraphStyle(
        "FinConclBody",
        parent=styles["body"],
        fontSize=9,
        leading=12,
        alignment=TA_JUSTIFY,
        spaceAfter=5,
        leftIndent=0.15 * cm,
    )
    signature = ParagraphStyle(
        "FinSignature",
        parent=styles["body"],
        fontSize=10,
        leading=13,
        alignment=TA_CENTER,
    )

    beneficio = _money(data.beneficio_acumulado)
    payback = f"{data.tiempo_retorno:,.2f}"

    story: list = []
    story.append(_LeftMarginDetail("Detail_2_page2.png", width=_SIDEBAR_W, height=24 * cm))

    story.append(build_components_chart(data))
    story.append(
        Paragraph(
            "<i><u>Figura 1.</u> Ahorro anual del proyecto fotovoltaico. Fuente: Elaboración propia</i>",
            caption,
        )
    )

    story.append(build_combo_chart(data))
    story.append(
        Paragraph(
            "<i><u>Figura 2.</u> Payback del proyecto fotovoltaico. Fuente: Elaboración propia</i>",
            caption,
        )
    )

    story.append(Paragraph("<u>Conclusiones</u>", section))
    story.append(
        Paragraph(
            f"<b>1. Beneficio económico a largo plazo:</b> el flujo acumulado al final del "
            f"horizonte de evaluación asciende a <b>{beneficio}</b>, evidenciando la "
            f"rentabilidad del sistema fotovoltaico propuesto.",
            body,
        )
    )
    story.append(
        Paragraph(
            f"<b>2. Recuperación de la inversión:</b> la inversión inicial se recupera en "
            f"aproximadamente <b>{payback} años</b>, según el cruce del flujo acumulado "
            f"mostrado en la Figura 2.",
            body,
        )
    )
    story.append(
        Paragraph(
            "<b>3. Ahorro anual desde el primer año:</b> a partir del año 1 se generan "
            "ahorros en la facturación eléctrica (Figura 1), los cuales crecen con la "
            "actualización tarifaria proyectada.",
            body,
        )
    )

    story.append(Spacer(1, 0.7 * cm))
    firm = _rl_image("Coco_Firm.png", width=5.5 * cm, height=2.6 * cm)
    firm_table = Table([[firm]], colWidths=[_CONTENT_W])
    firm_table.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(firm_table)
    story.append(Paragraph("<b>Ing. Jorge Guerrero Tarazona</b>", signature))
    story.append(Paragraph("Gerente General", signature))

    return story
