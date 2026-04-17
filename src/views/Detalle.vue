<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import WeatherApi from '../api/weatherApi';

const route = useRoute();
const store = useStore();
const api = new WeatherApi();
const lugar = ref(null);
const pronostico = ref([]);
const loading = ref(true);
const unidad = computed(() => store.state.preferences.unit === 'C' ? '°C' : '°F');

const convertir = (c) => store.state.preferences.unit === 'F' ? Math.round((c * 9/5) + 32) : Math.round(c);

onMounted(async () => {
  try {
    const nombreCiudad = decodeURIComponent(route.params.id);
    const [clima, fore] = await Promise.all([api.obtenerClima(nombreCiudad), api.obtenerPronostico(nombreCiudad)]);
    lugar.value = { nombre: clima.name, tempActual: convertir(clima.main.temp), estadoActual: clima.weather[0].description, humedad: clima.main.humidity, viento: Math.round(clima.wind.speed), presion: clima.main.pressure };
    pronostico.value = fore.list.filter((_, i) => i % 8 === 0).slice(0, 5).map(item => ({ fecha: new Date(item.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }), temp: convertir(item.main.temp), estado: item.weather[0].description }));
  } finally { loading.value = false; }
});
</script>

<template>
  <div class="container mt-5">
    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div><p class="mt-2">Consultando satélites...</p></div>
    <div v-else-if="lugar" class="card shadow-lg p-4 border-0">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4">{{ lugar.nombre }}</h1>
        <router-link to="/" class="btn btn-secondary shadow-sm">Volver</router-link>
      </div>
      <div class="row text-center mb-5">
        <div class="col-md-3">
          <h3 class="display-6">{{ lugar.tempActual }}{{ unidad }}</h3>
          <p class="text-muted text-capitalize fs-5">{{ lugar.estadoActual }}</p>
        </div>
        <div class="col-md-9 border-start">
          <div class="row g-4">
            <div class="col-md-4"><strong>Humedad</strong><br><span class="display-6">{{ lugar.humedad }}%</span></div>
            <div class="col-md-4"><strong>Viento</strong><br><span class="display-6">{{ lugar.viento }} m/s</span></div>
            <div class="col-md-4"><strong>Presión</strong><br><span class="display-6">{{ lugar.presion }} hPa</span></div>
          </div>
        </div>
      </div>
      <h3 class="mb-4"> Pronóstico 5 Días</h3>
      <div class="row g-3">
        <div v-for="dia in pronostico" :key="dia.fecha" class="col-md-2 col-6">
          <div class="p-4 bg-light rounded-3 text-center border shadow-sm h-100">
            <small class="text-muted">{{ dia.fecha }}</small><br><strong class="h4">{{ dia.temp }}{{ unidad }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>