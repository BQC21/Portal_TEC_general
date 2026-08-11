"""Endpoint HTTP del pipeline PDF. Solo orquesta: schema → mapper → generator."""

from __future__ import annotations
from typing import Annotated, Union

from fastapi import APIRouter
from fastapi.responses import Response
from pydantic import Field

from app.schemas.report import ReportFormPayload
from app.schemas.finantial import FinantialFormPayload

from app.services.report_mapper import map_report_form
from app.services.finantial_mapper import map_finantial_form
from app.services.pdf_generator import generate_report_pdf

router = APIRouter(prefix="/reports", tags=["reports"])

Payload = Annotated[
    Union[ReportFormPayload, FinantialFormPayload],
    Field(discriminator="tipo"),
]

@router.post("/pdf")
def create_report_pdf(payload: Payload) -> Response:

    if payload.tipo == "finantial":
        pdf_data = map_finantial_form(payload)   
    else:
        pdf_data = map_report_form(payload)
    
    pdf_bytes, filename = generate_report_pdf(pdf_data)


    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )