# Portal_TEC_general
Se desarrrolla un portal corporativo empresarial que consista en brindar una visualización centralizada de la productividad de la empresa, así como también un almacenamiento de los productos importados y herramientas para agilizar la generación y análisis de reportes empresariales

## Features
1. Módulo 1: Base de datos de productos eléctricos importados 
2. Módulo 2: Distribución de costos por proyecto
3. Módulo 3: Estudio y generación de reportes de cotización por proyecto
4. Módulo 4: Estudio y generación de reportes financieros por proyecto
 
En la página principal, se muestra el dashboard donde se registra, en base a los 4 módulos, los productos almacenados, la cantidad de proyectos en curso y las cotizaciones almacenadas.

## Stack
1. Supabase: alojamiento de la base de datos
2. Next.js: framework para desarrollar la plataforma
3. React.js: librería para gestionar componentes de visualización
4. PostgreSQL: motor SQL incrustrado en Supabase
5. TailwindCSS: librería para estilización

## Database Schema

### Table of Module 1
```SQL
Table Productos {
    id            int       [pk, increment]
    // generales
    proveedor     varchar   [not null]
    codigo        varchar   [unique, not null]
    tipo          varchar   [not null]
    marca         varchar   [not null]
    // propiedades
    Tipo_conexion    varchar // monofasico (220V), trifasico (220V o 380V)
    Pot_maxima       float
    MPPT             int 
    DoD              float // en decimal (/100)
    array_MPPT       int
    VOC              float
    VMPP             float
    ISC              float
    IMPP             float
    Fuente_electrica varchar // DC, AC, bateria, DC/AC
    // precios 
    unidad         varchar   [not null]
    igv            float     [not null] // en decimal (/100)
    precio_soles   float     [not null]
    precio_dolares float     [not null]
    precio_soles_igv  float     [not null]
    precio_dolares_igv  float     [not null]
    created_at    timestamp [default: `now()`]
    updated_at    timestamp
}
```

---

## Prerequisites

- Git
- Node.js 20+ (includes npm)

## Installation

1. Clone the repository on the new desktop:

```bash
git clone <REPO_URL>
cd Portal_TEC_general
```

2. Install dependencies:

```bash
npm install
```

3. Create environment variables:

```bash
cp .env.example .env.local
```

If `.env.example` does not exist, create `.env.local` manually and add the required keys for Supabase (for example `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

4. Run the development server:

```bash
npm run dev
```

5. Open the app in your browser:

```text
http://localhost:3000
```

<!-- ### Optional production run

```bash
npm run build
npm run start
``` -->



---

**Note**: This project uses Supabase as backend. Make sure your `.env.local` contains valid Supabase credentials before starting the app.