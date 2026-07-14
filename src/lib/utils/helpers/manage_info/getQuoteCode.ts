// Función para obtener el código de la cotización
export function getQuoteCode(){
    // debe seguir el patrón C001-YYYYMMDDD (ej: C001-202607014)
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate(); 
    
    const code = `C001-${year}${month.toString().padStart(2, '0')}${day.toString().padStart(3, '0')}`;
    
    return code;
}