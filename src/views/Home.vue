<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import WeatherApi from '../api/weatherApi';

const router = useRouter();
const store = useStore();
const api = new WeatherApi();

const lugares = ref([]);
const limite = ref(4);
const nuevaCiudad = ref("");
const errorBusqueda = ref("");
const lugaresVisibles = computed(() => lugares.value.slice(0, limite.value));

const unidad = computed(() => store.state.preferences.unit === 'C' ? '°C' : '°F');

const convertirTemp = (celsius) => {
  const u = store.state.preferences.unit;
  return u === 'F' ? Math.round((celsius * 9/5) + 32) : Math.round(celsius);
};

const utils = {
  obtenerClaseClima(estado) {
    const e = estado?.toLowerCase() || "";
    if (e.includes("soleado") || e.includes("despejado") || e.includes("claro")) return "flip-card__back--soleado";
    if (e.includes("lluvia") || e.includes("tormenta") || e.includes("nieve")) return "flip-card__back--lluvia";
    return "flip-card__back--nublado";
  }
};

const imgLoaded = (e) => e.target.classList.add('is-loaded');
const imgError = (e) => { 
  e.target.src = 'https://images.unsplash.com/photo-1518005020453-6ec2474f2b91?q=80&w=500&auto=format&fit=crop'; 
  e.target.classList.add('is-loaded'); 
};


const toggleCard = (lugar) => {
  lugar.flipped = !lugar.flipped;
};

const cargarMas = () => limite.value += 4;

const buscarCiudad = () => {
  if (!nuevaCiudad.value.trim()) { 
    errorBusqueda.value = "Ingresa el nombre de una ciudad"; 
    return; 
  }
  router.push('/lugar/' + encodeURIComponent(nuevaCiudad.value.trim()));
};

const cargarBase = async () => {
  const ciudades =[
        { id: 1, nombre: "Copenhague", img: "./img/copenhague.jpg" },
        { id: 2, nombre: "Berlín", img: "./img/berlin.jpg" },
        { id: 3, nombre: "Washington", img: "./img/washington.jpg" },
        { id: 4, nombre: "Londres", img: "./img/londres.jpg" },
        { id: 5, nombre: "Amsterdam", img: "./img/amsterdam.jpg" },
        { id: 6, nombre: "México", img: "./img/mexico.jpg" },
        { id: 7, nombre: "Roma", img: "./img/roma.jpg" },
        { id: 8, nombre: "Nueva York", img: "./img/nueva-york.jpg" },
        { id: 9, nombre: 'Tokio', img: './img/tokio.jpg' },
        { id: 10, nombre: 'Sidney', img: './img/sidney.jpg' }
      ];

  
  lugares.value = await Promise.all(ciudades.map(async c => {
    try {
      const data = await api.obtenerClima(c.nombre);
      return { 
        id: c.id, 
        nombre: data.name, 
        img: c.img, 
        tempActual: convertirTemp(data.main.temp), 
        estadoActual: data.weather[0].description, 
        humedad: data.main.humidity, 
        viento: Math.round(data.wind.speed),
        flipped: false
      };
    } catch { 
      return { id: c.id, nombre: c.nombre, img: c.img, tempActual: "--", estadoActual: "No disponible", flipped: false }; 
    }
  }));
};

onMounted(cargarBase);
</script>

<template>
  <div class="container mt-4">
    <div class="row justify-content-center mb-5">
      <div class="col-md-6">
        <div class="input-group">
            <input v-model="nuevaCiudad" @keyup.enter="buscarCiudad" type="text" class="form-control" placeholder="🔍 Busca cualquier ciudad del mundo...">
            <button @click="buscarCiudad" class="btn btn-primary">Buscar</button>
        </div>
        <div v-if="errorBusqueda" class="text-danger text-center mt-2 small">{{ errorBusqueda }}</div>
      </div>
    </div>

    <div class="row g-4" v-if="lugares.length">
      <div class="col-lg-3 col-md-4 col-sm-6" v-for="lugar in lugaresVisibles" :key="lugar.id">
        <div class="flip-card" :class="{ 'flip-card--active': lugar.flipped }" @click="toggleCard(lugar)">
          <div class="flip-card__inner">
            <div class="flip-card__front">
              <img :src="lugar.img" class="flip-card__image" :alt="lugar.nombre" @load="imgLoaded" @error="imgError">
              <div class="flip-card__overlay">
                <span class="flip-card__city-name">{{ lugar.nombre }}</span>
              </div>
            </div>
            <div :class="['flip-card__back', utils.obtenerClaseClima(lugar.estadoActual)]">
              <div class="text-center p-3">
                <div class="flip-card__temp-actual">{{ lugar.tempActual }}{{ unidad }}</div>
                <div class="flip-card__estado text-capitalize">{{ lugar.estadoActual }}</div>
                <hr>
                <p class="mb-3">💧 Humedad: {{ lugar.humedad }}%<br>💨 Viento: {{ lugar.viento }} m/s</p>
                <router-link @click.stop :to="'/lugar/' + encodeURIComponent(lugar.nombre)" class="btn btn-light btn-sm w-100">
                  Ver detalles
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!lugares.length" class="text-center py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p>Cargando ciudades del mundo...</p>
    </div>

    <div class="text-center mt-5 mb-5" v-if="limite < lugares.length">
      <button @click="cargarMas" class="btn btn-outline-dark px-4 shadow-sm">Cargar más ciudades...</button>
    </div>
  </div>
</template>
