<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import WeatherApi from "../api/weatherApi";

const route = useRoute();
const store = useStore();
const api = new WeatherApi();
const lugar = ref(null);
const pronostico = ref([]);
const loading = ref(true);

const unidad = computed(() =>
  store.state.preferences.unit === "C" ? "°C" : "°F",
);
const convertir = (c) =>
  store.state.preferences.unit === "F"
    ? Math.round((c * 9) / 5 + 32)
    : Math.round(c);
const convertirTempF = (c) =>
  store.state.preferences.unit === "F"
    ? ((c * 9) / 5 + 32).toFixed(1)
    : c.toFixed(1);

const obtenerEstiloClima = (estado) => {
  const desc = estado.toLowerCase();
  if (desc.includes("clear") || desc.includes("sol"))
    return { clase: "detalle__dia--soleado", icono: "fa-sun" };
  if (
    desc.includes("rain") ||
    desc.includes("lluvia") ||
    desc.includes("drizzle")
  )
    return { clase: "detalle__dia--lluvia", icono: "fa-cloud-showers-heavy" };
  if (desc.includes("snow") || desc.includes("nieve"))
    return { clase: "detalle__dia--nieve", icono: "fa-snowflake" };
  if (desc.includes("thunder") || desc.includes("tormenta"))
    return { clase: "detalle__dia--tormenta", icono: "fa-bolt" };
  return { clase: "detalle__dia--nublado", icono: "fa-cloud" };
};

onMounted(async () => {
  try {
    const nombreCiudad = decodeURIComponent(route.params.id);
    const [clima, fore] = await Promise.all([
      api.obtenerClima(nombreCiudad),
      api.obtenerPronostico(nombreCiudad),
    ]);

    lugar.value = {
      nombre: clima.name,
      tempActual: convertir(clima.main.temp),
      tempMin: convertir(clima.main.temp_min),
      tempMax: convertir(clima.main.temp_max),
      sensacionTermica: convertir(clima.main.feels_like),
      estadoActual: clima.weather[0].description,
      humedad: clima.main.humidity,
      viento: Math.round(clima.wind.speed * 3.6),
      vientoRafaga: clima.wind.gust ? Math.round(clima.wind.gust * 3.6) : null,
      presion: clima.main.pressure,
      visibilidad: Math.round(clima.visibility / 1000),
      puntoRocio: convertir(clima.main.temp - (100 - clima.main.humidity) / 5),
      nubosidad: clima.clouds.all,
      amanecer: new Date(clima.sys.sunrise * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      atardecer: new Date(clima.sys.sunset * 1000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const hoy = new Date().setHours(0, 0, 0, 0);
    const pronosticoPorDia = {};

    fore.list.slice(8).forEach((item) => {
      const fecha = new Date(item.dt * 1000);
      const diaKey = fecha.toDateString();

      if (!pronosticoPorDia[diaKey]) {
        pronosticoPorDia[diaKey] = {
          fecha: fecha,
          temps: [],
          humedades: [],
          vientos: [],
          estados: [],
        };
      }

      pronosticoPorDia[diaKey].temps.push(item.main.temp);
      pronosticoPorDia[diaKey].humedades.push(item.main.humidity);
      pronosticoPorDia[diaKey].vientos.push(item.wind.speed);
      pronosticoPorDia[diaKey].estados.push(item.weather[0]);
    });

    pronostico.value = Object.values(pronosticoPorDia)
      .slice(0, 5)
      .map((dia) => {
        const tempMax = Math.max(...dia.temps);
        const tempMin = Math.min(...dia.temps);
        const humedadMax = Math.max(...dia.humedades);
        const humedadMin = Math.min(...dia.humedades);
        const vientoMax = Math.max(...dia.vientos);
        const vientoMin = Math.min(...dia.vientos);

        const estadoPredominante = dia.estados.reduce((a, b) =>
          dia.estados.filter((v) => v.description === a.description).length >=
          dia.estados.filter((v) => v.description === b.description).length
            ? a
            : b,
        );

        const infoClima = obtenerEstiloClima(estadoPredominante.main);

        return {
          fecha: dia.fecha.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short",
          }),
          tempPromedio: convertir((tempMax + tempMin) / 2),
          min: convertir(tempMin),
          max: convertir(tempMax),
          humedadMin: Math.round(humedadMin),
          humedadMax: Math.round(humedadMax),
          vientoMin: Math.round(vientoMin * 3.6),
          vientoMax: Math.round(vientoMax * 3.6),
          estado: estadoPredominante.description,
          claseCss: infoClima.clase,
          iconoCss: infoClima.icono,
        };
      });
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mt-5 detalle">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2">Consultando satélites...</p>
    </div>

    <div v-else-if="lugar" class="card shadow-lg p-4 border-0">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4 fw-bold">{{ lugar.nombre }}</h1>
        <router-link to="/" class="btn btn-outline-secondary"
          >Volver</router-link
        >
      </div>

      <!-- Día Actual -->
      <div class="row text-center mb-5 align-items-center">
        <div class="col-md-4 border-end">
          <h3 class="display-2 fw-bold mb-0">
            {{ lugar.tempActual }}{{ unidad }}
          </h3>
          <p class="text-muted text-capitalize fs-5 mb-2">
            {{ lugar.estadoActual }}
          </p>
          <div class="d-flex justify-content-center gap-2 mb-3">
            <span class="text-primary fw-bold"
              ><i class="fa-solid fa-arrow-down"></i> {{ lugar.tempMin }}°</span
            >
            <span class="text-danger fw-bold"
              ><i class="fa-solid fa-arrow-up"></i> {{ lugar.tempMax }}°</span
            >
          </div>
          <small class="text-muted"
            >Sensación: {{ lugar.sensacionTermica }}{{ unidad }}</small
          >
        </div>

        <div class="col-md-8">
          <div class="row g-3">
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-droplet text-info mb-2 fs-4"></i><br />
              <strong class="d-block small">Humedad</strong>
              <span class="fs-4">{{ lugar.humedad }}%</span>
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-wind text-secondary mb-2 fs-4"></i><br />
              <strong class="d-block small">Viento</strong>
              <span class="fs-4">{{ lugar.viento }} <small>km/h</small></span>
              <small v-if="lugar.vientoRafaga" class="d-block text-muted"
                >Ráfagas: {{ lugar.vientoRafaga }} km/h</small
              >
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-gauge-high text-warning mb-2 fs-4"></i
              ><br />
              <strong class="d-block small">Presión</strong>
              <span class="fs-4">{{ lugar.presion }} <small>hPa</small></span>
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-eye text-primary mb-2 fs-4"></i><br />
              <strong class="d-block small">Visibilidad</strong>
              <span class="fs-4"
                >{{ lugar.visibilidad }} <small>km</small></span
              >
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-temperature-half text-danger mb-2 fs-4"></i
              ><br />
              <strong class="d-block small">Punto Rocío</strong>
              <span class="fs-4">{{ lugar.puntoRocio }}°</span>
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-cloud text-secondary mb-2 fs-4"></i><br />
              <strong class="d-block small">Nubosidad</strong>
              <span class="fs-4">{{ lugar.nubosidad }}%</span>
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-sun text-warning mb-2 fs-4"></i><br />
              <strong class="d-block small">Amanecer</strong>
              <span class="fs-5">{{ lugar.amanecer }}</span>
            </div>
            <div class="col-6 col-md-3">
              <i class="fa-solid fa-moon text-info mb-2 fs-4"></i><br />
              <strong class="d-block small">Atardecer</strong>
              <span class="fs-5">{{ lugar.atardecer }}</span>
            </div>
          </div>
        </div>
      </div>

      <h3 class="mb-4">Pronóstico 5 Días</h3>

      <div class="detalle__pronostico">
        <div
          v-for="dia in pronostico"
          :key="dia.fecha"
          :class="['detalle__dia', dia.claseCss]"
        >
          <small class="text-uppercase fw-bold">{{ dia.fecha }}</small>

          <div class="detalle__dia-icono">
            <i :class="['fa-solid', dia.iconoCss]"></i>
          </div>

          <div class="detalle__dia-temp">
            {{ dia.tempPromedio }}{{ unidad }}
          </div>

          <div style="font-size: 0.8rem" class="mt-1">
            <span class="text-danger">{{ dia.max }}°</span> /
            <span class="text-primary">{{ dia.min }}°</span>
          </div>

          <div class="mt-2" style="font-size: 0.7rem">
            <div>
              <i class="fa-solid fa-droplet me-1"></i> {{ dia.humedadMin }}% -
              {{ dia.humedadMax }}%
            </div>
            <div>
              <i class="fa-solid fa-wind me-1"></i> {{ dia.vientoMin }} -
              {{ dia.vientoMax }} km/h
            </div>
          </div>

          <small
            class="d-block text-capitalize mt-1"
            style="font-size: 0.7rem; opacity: 0.9"
          >
            {{ dia.estado }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
