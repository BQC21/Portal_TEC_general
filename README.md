
auto_awesome
Translate from: Spanish
3,207
#Portal_TEC_general
Se desarrolla un portal corporativo empresarial que consiste en brindar una visualización centralizada de la productividad de la empresa, así como también un almacenamiento de los productos importados y herramientas para agilizar la generación y análisis de informes empresariales.

## Características
1. Módulo 1: Base de datos de productos eléctricos importados
2. Módulo 2: Distribución de costos por proyecto
3. Módulo 3: Estudio y generación de informes de cotización por proyecto
4. Módulo 4: Estudio y generación de informes financieros por proyecto

En la página principal, se muestra el tablero donde se registra, en base a los 4 módulos, los productos almacenados, la cantidad de proyectos en curso y las cotizaciones almacenadas.

## Pila
1. Supabase: alojamiento de la base de datos
2. Next.js: framework para desarrollar la plataforma
3. React.js: librería para gestionar componentes de visualización
4. PostgreSQL: motor SQL incrustado en Supabase
5. TailwindCSS: librería para estilización

##Autenticación

El portal usa Supabase Auth para controlar el acceso a las rutas internas. La entrada pública queda en `/login`, mientras que `/dashboard` y `/products` requieren sesión activa.

Variables requeridas en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Esquema de la base de datos

### Tabla del módulo 1
```SQL Tabla Productos {

id int [pk, increment]

// generales
proveedor varchar [not null]

código varchar [unique, not null]
tipo varchar [not null]

marca varchar [not null]

// propiedades
Tipo_conexion varchar // monofásico (220V), trifásico (220V o 380V)
Pot_maxima float
MPPT int
DoD float // en decimal (/100)
array_MPPT int
VOC float
VMPP float

ISC float

IMPP float
Fuente_electrica varchar // CC, CA, batería, CC/CA

// precios
unidad varchar [no nulo]

igv float [no nulo] // en decimal (/100)

precio_soles float [no nulo]

precio_dolares float [no nulo]

precio_soles_igv float [no nulo]

precio_dolares_igv float [no nulo]

created_at timestamp [predeterminado: `now()`]
updated_at timestamp
}
```

---

## Requisitos previos

- Git
- Node.js 20+ (incluye npm)

## Instalación

1. Clonar el repositorio en el nuevo escritorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Portal_TEC_general
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear variables de entorno:

```bash
cp .env.example .env.local
```

Si Si el archivo `.env.example` no existe, créelo manualmente y añada las claves necesarias para Supabase (por ejemplo, `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

4. Ejecute el servidor de desarrollo:

```bash
npm run dev
```

5. Abra la aplicación en su navegador:

```text
http://localhost:3000
```

<!-- ### Ejecución de producción opcional

```bash
npm run build
npm run start
``` -->

---

**Nota**: Este proyecto utiliza Supabase como backend. Asegúrese de que su archivo `.env.local` contenga credenciales válidas de Supabase antes de iniciar la aplicación.
Send feedback
Translation results available