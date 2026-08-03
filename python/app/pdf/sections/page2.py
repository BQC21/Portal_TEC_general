"""Página 2 — Cotización: cabecera, ítems, totales y condiciones."""

from __future__ import annotations

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle

from app.schemas.report import ReportPdfData

## formatear el valor del precio
def _money(value: float, symbol: str) -> str:
    return f"{symbol} {value:,.2f}"

## encabezado 
def _company_header(styles: dict[str, ParagraphStyle]) -> Table:
    ## Añadir imagen (logo de TEC)
    rows: list[list[Paragraph]] = [
        [
            Paragraph("<b>TEC SOLUCIONES RENOVABLES S.A.C</b>", styles["body"]),
            Paragraph("", styles["right"]),
        ],
        [
            Paragraph("RUC: 20612681466", styles["small"]),
            Paragraph("Pág Web: www.tec-renovables.pe", styles["right"]),
        ],
        [
            Paragraph("Calle Cnel Luis Arias Schreiber 135, Miraflores", styles["small"]),
            Paragraph("Tel: 944590566", styles["right"]),
        ],
    ]
    table = Table(
        rows,
        colWidths=[11 * cm, 7 * cm],
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
                ("LINEBELOW", (0, -1), (-1, -1), 1, colors.HexColor("#0f172a")),
            ]
        )
    )
    return table

## Datos de cotización
def _client_table(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> Table:
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
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table

## Tablas de montos
def _section_amount_row(title: str, amount: str, styles: dict[str, ParagraphStyle]) -> Table:
    compact_section = ParagraphStyle(
        "CompactSection",
        parent=styles["section"],
        fontSize=10,
        spaceBefore=4,
        spaceAfter=2,
    )
    table = Table(
        [[Paragraph(f"<b>{title}</b>", compact_section), Paragraph(f"<b>{amount}</b>", styles["right"])]],
        colWidths=[13 * cm, 5 * cm],
    )
    table.setStyle(
        TableStyle(
            [
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#94a3b8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table

## Identificar items de la tabla
def _items_table(headers: list[str], rows: list[list[str]], col_widths: list[float]) -> Table:
    data = [headers, *rows] if rows else [headers, ["-", "Sin ítems", "-", "-"][: len(headers)]]
    table = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#64748b")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#cbd5e1")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]
    for i in range(1, len(data)):
        bg = colors.white if i % 2 else colors.HexColor("#f1f5f9")
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), bg))
    table.setStyle(TableStyle(style_cmds))
    return table

## Tabla de totales
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
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table

## pieza final de la tabla
def _conditions_table(styles: dict[str, ParagraphStyle]) -> Table:
    rows = [
        [
            Paragraph("<b>VALIDEZ DE LA OFERTA</b>", styles["small"]),
            Paragraph("15 Días", styles["body"]),
            Paragraph("BCP S/: 194-4373203-0-66", styles["small"]),
        ],
        [
            Paragraph("<b>PLAZO DE ENTREGA</b>", styles["small"]),
            Paragraph("3 Semanas Recepcionada la Orden de Servicio", styles["body"]),
            Paragraph("CCI S/: 002194 0043732030 6693", styles["small"]),
        ],
        [
            Paragraph("<b>FORMA DE PAGO</b>", styles["small"]),
            Paragraph("50% Con la orden de servicio<br/>"
                    "50% Al término de instalación", styles["body"]),
            Paragraph(
                "BCP $ : 194-6917620-1-58<br/>"
                "CCI $ : 002194 0069176201 5895<br/>"
                "CTA DETRACCIÓN: 00 076 190305",
                styles["small"],
            ),
        ],
    ]
    table = Table(rows, colWidths=[4.5 * cm, 7.5 * cm, 6 * cm])
    table.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ]
        )
    )
    return table


def build_page2(data: ReportPdfData, styles: dict[str, ParagraphStyle]) -> list:
    title = ParagraphStyle(
        "QuoteTitle",
        parent=styles["title"],
        fontSize=13,
        spaceBefore=2,
        spaceAfter=4,
    )
    story: list = []
    story.append(_company_header(styles))
    story.append(Spacer(1, 0.15 * cm))
    story.append(Paragraph("COTIZACIÓN", title))
    if data.cod_cotizacion:
        story.append(Paragraph(f"Código: {data.cod_cotizacion}", styles["small"]))
    story.append(Spacer(1, 0.15 * cm))
    story.append(_client_table(data, styles))
    story.append(Spacer(1, 0.2 * cm))

    ## Información de Equipos y Materiales
    story.append(
        _section_amount_row(
            "EQUIPOS Y MATERIALES",
            _money(data.monto_eqmt, data.currency_symbol),
            styles,
        )
    )

    ####### EQUIPOS
    idx = 1
    equipo_rows: list[list[str]] = []
    for item in data.equipos:
        equipo_rows.append([str(idx), item.descripcion, item.unidad, item.cantidad])
        idx += 1
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - EQUIPOS", "UNIDAD", "CANTIDAD"],
            equipo_rows,
            [1 * cm, 11 * cm, 3 * cm, 3 * cm],
        )
    )
    story.append(Spacer(1, 0.12 * cm))

    ####### MATERIALES
    material_rows: list[list[str]] = []
    for item in data.materiales:
        material_rows.append([str(idx), item.descripcion, item.unidad, item.cantidad or ""])
        idx += 1
    # Si no hay materiales tipados, línea genérica como en la referencia
    if not material_rows:
        material_rows.append([str(idx), "Materiales Eléctricos", "GLB", ""])
        idx += 1
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - MATERIALES", "UNIDAD", "CANTIDAD"],
            material_rows,
            [1 * cm, 11 * cm, 3 * cm, 3 * cm],
        )
    )
    story.append(Spacer(1, 0.2 * cm))

    ## Información de pueta en marcha
    story.append(
        _section_amount_row(
            "PUESTA EN MARCHA",
            _money(data.monto_inst, data.currency_symbol),
            styles,
        )
    )
    mo_rows = [[str(idx + i), desc] for i, desc in enumerate(data.puesta_en_marcha)]
    story.append(
        _items_table(
            ["#", "DESCRIPCIÓN - PUESTA EN MARCHA"],
            mo_rows,
            [1.5 * cm, 16.5 * cm],
        )
    )
    story.append(Spacer(1, 0.2 * cm))
    story.append(_totals_table(data, styles))
    story.append(Spacer(1, 0.2 * cm))
    story.append(_conditions_table(styles))

    return story
