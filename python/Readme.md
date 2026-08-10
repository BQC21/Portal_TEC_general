# Servidor Python — Generación de reportes PDF de cotización

Microservicio FastAPI que recibe el formulario de reporte desde el portal Next.js, transforma los datos y genera un PDF de cotización (3 páginas) con ReportLab. No consulta base de datos: todo llega en el body del `POST`.

## Features
1. Endpoint `POST /api/reports/pdf` que valida el payload con Pydantic y responde con un archivo PDF descargable.
2. PDF de 3 páginas: carta de presentación, cotización (ítems + totales + condiciones) y notas finales.
3. Healthcheck en `GET /health` para monitoreo y depuración en Railway.
4. CORS habilitado para el frontend local (`http://localhost:3000`).
5. Integración con Next.js vía proxy `src/app/api/pdf_reports/route.ts` y variable `PYTHON_PDF_URL`.

## Stack
1. Python 3.11+
2. FastAPI — API HTTP
3. Uvicorn — servidor ASGI
4. Pydantic — validación del payload
5. ReportLab — generación del PDF (A4)
---

## Prerequisites

- Git
- Python 3.11 o superior
- `pip` (o `venv` / `virtualenv`)
- (Opcional, para probar el flujo completo) Node.js 20+ y el portal Next.js corriendo en `:3000`

## Installation

#### 1. Clone repository
```bash
git clone git@github.com:BQC21/Portal_TEC_general.git
cd Portal_TEC_general
```

#### 2. Install dependencies
```bash
cd python
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

#### 4. Run Python server
```bash
# Desde la carpeta python/ (con el venv activo)
python main.py
# o:
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

El servidor queda en `http://127.0.0.1:8000`.

- Health: `GET http://127.0.0.1:8000/health`
- Docs Swagger: `http://127.0.0.1:8000/docs`
- PDF: `POST http://127.0.0.1:8000/api/reports/pdf`

Para que el portal descargue PDFs en local, el frontend Next.js debe apuntar (por defecto) a esa URL:

```bash
# En .env.local del monorepo (opcional; hay default a :8000)
PYTHON_PDF_URL=http://127.0.0.1:8000/api/reports/pdf
```

## Depuración en Railway

Railway hospeda este microservicio de forma independiente al frontend (Vercel). Cuando el PDF falla en producción, el problema suele estar entre **Railway (Python)** y **la variable `PYTHON_PDF_URL` del frontend**.

### 1. Configurar el servicio en Railway

1. Crear un servicio a partir del mismo repositorio GitHub.
2. **Root Directory** → `python` (obligatorio: ahí están `main.py` y `requirements.txt`).
3. **Start Command** (o dejar que Nixpacks detecte; si no, forzar):

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

> Importante: usar `0.0.0.0` y `$PORT`. Si dejas `127.0.0.1` o el puerto `8000` fijo, Railway no podrá enrutar tráfico externo.

4. Desplegar y copiar la URL pública del servicio (ej. `https://tu-servicio.up.railway.app`).

### 2. Conectar el frontend

En Vercel (o el host del Next.js), definir:

```bash
PYTHON_PDF_URL=https://tu-servicio.up.railway.app/api/reports/pdf
```

Sin esa variable, el proxy Next intenta `http://127.0.0.1:8000/...` y en producción falla con *"No se pudo conectar con el servidor Python"*.

### 3. Checklist de depuración (orden recomendado)

| Paso | Qué hacer | Resultado esperado |
|------|-----------|--------------------|
| 1 | Abrir **Deployments → View Logs** del servicio Python | El build instala `requirements.txt` y el start levanta Uvicorn sin traceback |
| 2 | `GET https://<railway-url>/health` | `{"status":"ok"}` |
| 3 | Revisar **Settings → Networking / Public Domain** | Dominio activo; el servicio no está “sleeping” sin dominio |
| 4 | Confirmar **Root Directory = `python`** | Si el root es la raíz del monorepo, Nixpacks puede intentar un build Node y el Python nunca arranca |
| 5 | Verificar `PYTHON_PDF_URL` en el frontend | Coincide con `/api/reports/pdf` del servicio Railway |
| 6 | Reproducir el `POST` (Swagger `/docs` o curl) con un JSON de reporte | Status `200` y body `application/pdf` |
| 7 | Si el proxy Next responde 4xx/5xx | Leer el campo `detail` del JSON de error: ahí va el body/texto que devolvió Python |

Ejemplo de prueba rápida:

```bash
curl -i "https://<railway-url>/health"

curl -i -X POST "https://<railway-url>/api/reports/pdf" \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Test","fecha":"2026-08-10","cotizacion_info":{"cod_cotizacion":"COT-001","proyecto_info":{"nombre":"Demo"}}}' \
  --output test.pdf
```

### 4. Errores frecuentes

- **Build OK pero 502 / App failed to respond**  
  El proceso no escucha en `0.0.0.0:$PORT`. Revisa el Start Command.

- **Health OK, PDF 422**  
  El payload no cumple el schema Pydantic. Revisa logs de Railway (detalle de validación) y el body que envía `useGenerateReportPdf`.

- **Health OK, PDF 500**  
  Error en mapper/ReportLab (datos nulos, imagen faltante en `assets/`, etc.). El traceback aparece en los logs del deploy/runtime.

- **Next: “No se pudo conectar…”**  
  `PYTHON_PDF_URL` mal configurada, servicio Railway caído, o URL sin `https://`.

- **CORS en llamadas directas al browser → Railway**  
  En local, CORS solo permite `:3000`. En producción el navegador **no** llama a Railway directo: pasa por `/api/pdf_reports` (server-side). Si alguien llama al dominio Railway desde el cliente, habrá que ampliar `allow_origins` en `main.py`.

### 5. Logs útiles en Railway

1. **Build Logs**: fallos de `pip install` o root directory incorrecto.  
2. **Deploy / Runtime Logs**: excepciones de FastAPI/ReportLab en cada `POST /api/reports/pdf`.  
3. Filtrar por request cuando reproduzcas la descarga desde el modal de reporte del portal.

Con health en verde + `PYTHON_PDF_URL` correcta + un `POST` de prueba que descargue `test.pdf`, el pipeline de producción queda validado de extremo a extremo.
