from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.reports import router as reports_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Cotizador API",
        version="0.1.0",
    )

    # Next.js (npm run dev / next start) habla desde :3000
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(reports_router, prefix="/api")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
