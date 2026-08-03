"""Endpoint HTTP del pipeline PDF. Solo orquesta: schema → mapper → generator."""

from __future__ import annotations

from fastapi import APIRouter

from fastapi.responses import Response
from app.schemas.report import ReportFormPayload

from app.services.pdf_generator import generate_report_pdf
from app.services.report_mapper import map_report_form

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/pdf")
def create_report_pdf(payload: ReportFormPayload) -> Response:
    """Recibe el Form completo y responde con el PDF generado."""
    pdf_data = map_report_form(payload)
    pdf_bytes, filename = generate_report_pdf(pdf_data)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )
