# Alineado a MO_Content (ids "1".."12") / PDF de referencia
PUESTA_EN_MARCHA_ITEMS: list[tuple[str, str]] = [
    ("1", "Acarreo de materiales para instalación"),
    ("2", "Realizar trazos y medidas"),
    ("3", "Montaje de estructura metálica"),
    ("4", "Instalación de paneles (Estructura)"),
    ("5", "Instalación de paneles (Conexionado)"),
    ("6", "Armado de tablero DC / AC"),
    ("7", "Instalación de tablero FV"),
    ("8", "Instalación de inversor"),
    ("9", "Canalización de acometida DC"),
    ("10", "Canalización de acometida AC"),
    ("11", "Mediciones, pruebas eléctricas, ajustes y optimización"),
    ("12", "Conexión, programación, control y puesta en marcha"),
    ("13", "Viáticos"),
]

# Filtro alineado con Eq_Mat_Content
MATERIAL_TIPOS_ELECTRICOS = {"PROTECCION", "CABLE"}
MATERIAL_TIPOS_CANALIZACION = {"CANALIZACION"}

# Valores por defecto
DEFAULT_PAY_FORMAT = "50% Con la orden de servicio\n50% Al término de instalación"
PANELES_POR_PALET = 36