const API_KEY = "f44f23bd34b22f7b7d9016a81f522e83";
const API_BASE = "https://api.openweathermap.org/data/2.5";

export default class WeatherApi {
  constructor() {
    this.apiKey = API_KEY;
    this.baseURL = API_BASE;
  }
  
  async obtenerClima(ciudad) {
    const url = `${this.baseURL}/weather?q=${encodeURIComponent(ciudad)}&appid=${this.apiKey}&units=metric&lang=es`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Ciudad no encontrada");
    return await res.json();
  }
  
  async obtenerPronostico(ciudad) {
    const url = `${this.baseURL}/forecast?q=${encodeURIComponent(ciudad)}&appid=${this.apiKey}&units=metric&lang=es`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error en pronóstico");
    return await res.json();
  }
}