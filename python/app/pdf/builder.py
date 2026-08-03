"""Ensambla el story del PDF a partir de ReportPdfData."""

from __future__ import annotations

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle

from app.pdf.styles import _styles
from app.schemas.report import ReportPdfData


def _money(value: float, symbol: str) -> str:
    return f"{symbol} {value:,.2f}"


def _header_table(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> Table:
    rows = [
        [
            Paragraph("<b>CLIENTE</b>", styles["small"]),
            Paragraph(data.cliente or "-", styles["body"]),
            Paragraph("<b>FECHA</b>", styles["small"]),
            Paragraph(data.fecha or "-", styles["body"]),
        ],
        [
            Paragraph("<b>RUC / DNI</b>", styles["small"]),
            Paragraph(data.ruc_dni or "-", styles["body"]),
            Paragraph("<b>LUGAR</b>", styles["small"]),
            Paragraph(data.lugar or "-", styles["body"]),
        ],
        [
            Paragraph("<b>PROYECTO</b>", styles["small"]),
            Paragraph(data.proyecto or "-", styles["body"]),
            Paragraph("<b>ATENCIÓN</b>", styles["small"]),
            Paragraph(data.atencion or "-", styles["body"]),
        ],
    ]
    table = Table(rows, colWidths=[2.5 * cm, 7.5 * cm, 2.5 * cm, 5.5 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def _section_amount_row(title: str, amount: str, styles: dict[str, ParagraphStyle]) -> Table:
    table = Table(
        [[Paragraph(f"<b>{title}</b>", styles["section"]), Paragraph(f"<b>{amount}</b>", styles["right"])]],
        colWidths=[13 * cm, 5 * cm],
    )
    table.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#94a3b8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def _items_table(
    headers: list[str],
    rows: list[list[str]],
    col_widths: list[float],
) -> Table:
    data = [headers, *rows] if rows else [headers, ["-", "Sin ítems", "-", "-"][: len(headers)]]
    table = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#64748b")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    for i in range(1, len(data)):
        bg = colors.white if i % 2 else colors.HexColor("#f1f5f9")
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), bg))
    table.setStyle(TableStyle(style_cmds))
    return table


def _totals_table(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> Table:
    rows = [
        [
            Paragraph("<b>SUBTOTAL</b>", styles["body"]),
            Paragraph(f"<b>{_money(data.subtotal, data.currency_symbol)}</b>", styles["right"]),
        ],
        [
            Paragraph("IGV DE PUESTA EN MARCHA", styles["body"]),
            Paragraph(_money(data.igv_inst, data.currency_symbol), styles["right"]),
        ],
        [
            Paragraph("IGV DE EQUIPOS Y MATERIALES", styles["body"]),
            Paragraph(_money(data.igv_eqmt, data.currency_symbol), styles["right"]),
        ],
        [
            Paragraph("<b>TOTAL</b>", styles["body"]),
            Paragraph(f"<b>{_money(data.total, data.currency_symbol)}</b>", styles["right"]),
        ],
    ]
    table = Table(rows, colWidths=[13 * cm, 5 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#94a3b8")),
                ("LINEABOVE", (0, -1), (-1, -1), 1, colors.HexColor("#0f172a")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build_story(data: ReportPdfData) -> list:
    """Devuelve la lista de flowables lista para SimpleDocTemplate.build()."""
    styles = _styles()
    story: list = []

    story.append(Paragraph("TEC SOLUCIONES RENOVABLES S.A.C", styles["title"]))
    story.append(Paragraph("COTIZACIÓN", styles["title"]))
    if data.cod_cotizacion:
        story.append(Paragraph(f"Código: {data.cod_cotizacion}", styles["small"]))
    story.append(Spacer(1, 0.3 * cm))
    story.append(_header_table(data, styles))
    story.append(Spacer(1, 0.4 * cm))

    story.append(
        _section_amount_row(
            "EQUIPOS Y MATERIALES",
            _money(data.monto_eqmt, data.currency_symbol),
            styles,
        )
    )
    equipo_rows = [
        [str(item.index), item.descripcion, item.unidad, item.cantidad]
        for item in data.equipos
    ]
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - EQUIPOS", "UNIDAD", "CANTIDAD"],
            equipo_rows,
            [1 * cm, 11 * cm, 3 * cm, 3 * cm],
        )
    )
    story.append(Spacer(1, 0.25 * cm))

    material_rows = [
        [str(item.index), item.descripcion, item.unidad, item.cantidad]
        for item in data.materiales
    ]
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - MATERIALES", "UNIDAD", "CANTIDAD"],
            material_rows,
            [1 * cm, 11 * cm, 3 * cm, 3 * cm],
        )
    )
    story.append(Spacer(1, 0.4 * cm))

    story.append(
        _section_amount_row(
            "PUESTA EN MARCHA",
            _money(data.monto_inst, data.currency_symbol),
            styles,
        )
    )
    mo_rows = [[str(i), desc] for i, desc in enumerate(data.puesta_en_marcha, start=1)]
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - PUESTA EN MARCHA"],
            mo_rows,
            [1.5 * cm, 16.5 * cm],
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(_totals_table(data, styles))

    return story
