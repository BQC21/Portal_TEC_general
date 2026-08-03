from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        ## titulo
        "title": ParagraphStyle(
            "TitleCot",
            parent=base["Heading1"],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=12,
            textColor=colors.HexColor("#0f172a"),
        ),
        ## seccion
        "section": ParagraphStyle(
            "SectionCot",
            parent=base["Heading2"],
            fontSize=11,
            spaceBefore=10,
            spaceAfter=6,
            textColor=colors.HexColor("#0f172a"),
        ),
        ## cuerpo izq.
        "body": ParagraphStyle(
            "BodyCot",
            parent=base["Normal"],
            fontSize=9,
            leading=12,
            alignment=TA_LEFT,
        ),
        ## texto pequeño (notas secundarias)
        "small": ParagraphStyle(
            "SmallCot",
            parent=base["Normal"],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#334155"),
        ),
        ## cuerpo der.
        "right": ParagraphStyle(
            "RightCot",
            parent=base["Normal"],
            fontSize=9,
            alignment=TA_RIGHT,
        ),
    }