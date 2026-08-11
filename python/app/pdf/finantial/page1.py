"""Página 1 — Análisis financiero: cabecera, parámetros y flujo de caja."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Flowable, Image, Paragraph, Spacer, Table, TableStyle

from app.schemas.finantial import FinantialPdfData

_ASSETS = Path(__file__).resolve().parents[3] / "assets" / "images"
_CONTENT_INDENT = 0.35 * cm
_CONTENT_W = 17.5 * cm
_SIDEBAR_W = 0.55 * cm
_LINK_BLUE = colors.HexColor("#0A2F6B")
_HEADER_BG = colors.HexColor("#1e3a5f")
_ROW_ALT = colors.HexColor("#f1f5f9")


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


def _money(value: float | None, empty: str = "—") -> str:
    if value is None:
        return empty
    sign = "-" if value < 0 else ""
    return f"{sign}$ {abs(value):,.2f}"


def _num(value: float | None, digits: int = 2, empty: str = "—") -> str:
    if value is None:
        return empty
    return f"{value:,.{digits}f}"


def _brand_header() -> Table:
    logo = _rl_image("Tec_ES_logo.png", width=4.8 * cm, height=1.8 * cm)
    detail = _rl_image("Detail_1_page1.png", width=1.1 * cm, height=1.1 * cm)
    inner = Table([[logo, detail]], colWidths=[12.5 * cm, 5.0 * cm])
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
    return inner


def _params_table(data: FinantialPdfData, styles: dict[str, ParagraphStyle]) -> Table:
    header = [
        Paragraph("<b>Parámetro</b>", styles["small"]),
        Paragraph("<b>Valor</b>", styles["small"]),
        Paragraph("<b>Unidad</b>", styles["small"]),
    ]
    rows = [
        ["Planta", _num(data.planta), "kWp"],
        ["Generación", _num(data.generacion), "MWh/primer año"],
        ["CAPEX", _money(data.capex), "USD"],
        ["OPEX", _money(data.opex), "USD/año"],
        ["Tarifa de Red", _money(data.tarifa_red), "USD/MWh"],
        ["Tiempo de recuperación", _num(data.tiempo_retorno), "años"],
    ]
    table_data = [header] + [
        [
            Paragraph(name, styles["small"]),
            Paragraph(value, styles["small"]),
            Paragraph(unit, styles["small"]),
        ]
        for name, value, unit in rows
    ]
    table = Table(table_data, colWidths=[7.2 * cm, 4.5 * cm, 5.0 * cm])
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), _HEADER_BG),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#94a3b8")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(1, len(table_data)):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), _ROW_ALT))
    table.setStyle(TableStyle(style_cmds))
    return table


def _cashflow_table(data: FinantialPdfData, cell_style: ParagraphStyle) -> Table:
    headers = [
        "Año",
        "Equipamiento",
        "Tarifa cliente",
        "O&M",
        "Energía (MWh)",
        "Ahorro",
        "Flujo total",
        "Flujo acum.",
    ]
    header_row = [Paragraph(f"<b>{h}</b>", cell_style) for h in headers]

    body: list[list] = []
    for row in data.flow_rows:
        body.append(
            [
                Paragraph(str(row.year), cell_style),
                Paragraph(_money(row.equipamiento if (row.equipamiento or 0) != 0 else None), cell_style),
                Paragraph(_money(row.tarifa_cliente), cell_style),
                Paragraph(_money(row.om), cell_style),
                Paragraph(_num(row.energy_mwh, digits=4), cell_style),
                Paragraph(_money(row.ahorro), cell_style),
                Paragraph(_money(row.flujo_total), cell_style),
                Paragraph(_money(row.flujo_acumulado), cell_style),
            ]
        )

    if not body:
        body = [[Paragraph("—", cell_style) for _ in headers]]

    table = Table(
        [header_row] + body,
        colWidths=[1.0 * cm, 2.15 * cm, 2.15 * cm, 2.0 * cm, 2.2 * cm, 2.15 * cm, 2.25 * cm, 2.25 * cm],
        repeatRows=1,
    )
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), _HEADER_BG),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#94a3b8")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]
    for i in range(1, len(body) + 1):
        if i % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, i), (-1, i), _ROW_ALT))
    table.setStyle(TableStyle(style_cmds))
    return table


def build_page1(data: FinantialPdfData, styles: dict[str, ParagraphStyle]) -> list:
    title_style = ParagraphStyle(
        "FinTitle",
        parent=styles["title"],
        fontSize=13,
        spaceAfter=6,
        textColor=_LINK_BLUE,
    )
    project_style = ParagraphStyle(
        "FinProject",
        parent=styles["body"],
        fontSize=11,
        alignment=TA_CENTER,
        spaceAfter=8,
    )
    intro_style = ParagraphStyle(
        "FinIntro",
        parent=styles["body"],
        fontSize=9,
        leading=12,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
    section_style = ParagraphStyle(
        "FinSection",
        parent=styles["section"],
        fontSize=11,
        spaceBefore=8,
        spaceAfter=6,
        textColor=_LINK_BLUE,
    )
    cell_style = ParagraphStyle(
        "FinCell",
        parent=styles["small"],
        fontSize=6.5,
        leading=8,
        alignment=TA_CENTER,
    )

    proyecto = data.proyecto or "Proyecto fotovoltaico"
    planta = _num(data.planta)

    story: list = []
    story.append(_brand_header())
    story.append(_LeftMarginDetail("Detail_2_page2.png", width=_SIDEBAR_W, height=24 * cm))
    story.append(Spacer(1, 0.35 * cm))
    story.append(Paragraph("Análisis Financiero del Proyecto Fotovoltaico", title_style))
    story.append(Paragraph(f"<b>{proyecto}</b>", project_style))

    story.append(
        Paragraph(
            f"El presente documento resume la evaluación económico-financiera del sistema "
            f"fotovoltaico propuesto (<b>{planta} kWp</b>). Se detallan los parámetros de "
            f"inversión, operación y el flujo de caja proyectado para determinar el tiempo "
            f"de recuperación y el beneficio acumulado del proyecto.",
            intro_style,
        )
    )

    story.append(Paragraph("Parámetros principales del proyecto", section_style))
    story.append(_params_table(data, styles))
    story.append(Spacer(1, 0.45 * cm))

    story.append(Paragraph("Flujo de caja del proyecto", section_style))
    story.append(_cashflow_table(data, cell_style))

    return story
