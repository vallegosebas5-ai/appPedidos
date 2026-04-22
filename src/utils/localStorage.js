/**
 * Helpers para leer y escribir en localStorage.
 * Centralizamos aquí para facilitar el reemplazo futuro por llamadas a API.
 */

// Guarda un valor en localStorage (lo convierte a JSON)
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error guardando en localStorage [${key}]:`, error);
  }
}

// Lee un valor de localStorage (lo parsea de JSON)
export function getFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error leyendo de localStorage [${key}]:`, error);
    return null;
  }
}

// Elimina un valor de localStorage
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error eliminando de localStorage [${key}]:`, error);
  }
}
