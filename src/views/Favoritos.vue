<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import WeatherApi from '../api/weatherApi';

const store = useStore();
const api = new WeatherApi();


const climaData = ref({});
const nuevaCiudad = ref('');
const buscando = ref(false);

const userFavorites = computed(() => store.state.user?.favorites || []);
const unit = computed(() => store.state.preferences.unit);
const unitLabel = computed(() => unit.value === 'C' ? '°C' : '°F');

const convertir = (c) => unit.value === 'F' ? Math.round((c * 9/5) + 32) : Math.round(c);


const cargarClima = async (specificCity = null) => {
  const citiesToFetch = specificCity ? [specificCity] : userFavorites.value;
  
  for (const city of citiesToFetch) {
    try {
      const data = await api.obtenerClima(city);
      climaData.value[city] = { 
        temp: convertir(data.main.temp), 
        desc: data.weather[0].description 
      };
    } catch { 
      climaData.value[city] = { temp: '--', desc: 'No encontrado' }; 
    }
  }
};

const agregarFavorito = async () => {
  const ciudad = nuevaCiudad.value.trim();
  if (!ciudad) return;


  if (userFavorites.value.includes(ciudad)) {
    alert('Esta ciudad ya está en tus favoritos');
    return;
  }

  buscando.value = true;
  try {
    
    await api.obtenerClima(ciudad);
    
    
    store.commit('ADD_FAVORITE', ciudad);
    nuevaCiudad.value = '';
   
    await cargarClima(ciudad);
  } catch (error) {
    alert('No se pudo encontrar la ciudad: ' + ciudad);
  } finally {
    buscando.value = false;
  }
};

const toggleUnit = () => store.commit('UPDATE_PREF', { unit: unit.value === 'C' ? 'F' : 'C' });

watch(unit, () => cargarClima());
onMounted(() => { if (userFavorites.value.length) cargarClima(); });
</script>

<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📍 Mis Ciudades Favoritas</h2>
      <div class="badge bg-primary p-2" style="cursor:pointer" @click="toggleUnit">
        Unidad: {{ unitLabel }} <i class="fa-solid fa-arrows-rotate ms-1"></i>
      </div>
    </div>

    <div class="card p-3 shadow-sm mb-5">
      <form @submit.prevent="agregarFavorito" class="row g-2">
        <div class="col-8 col-md-10">
          <input 
            v-model="nuevaCiudad" 
            type="text" 
            class="form-control" 
            placeholder="Escribe una ciudad (ej: Santiago, Tokyo...)"
            :disabled="buscando"
          >
        </div>
        <div class="col-4 col-md-2">
          <button type="submit" class="btn btn-success w-100" :disabled="buscando">
            <span v-if="buscando" class="spinner-border spinner-border-sm"></span>
            <span v-else><i class="fa-solid fa-plus"></i> Añadir</span>
          </button>
        </div>
      </form>
    </div>

    <div class="row g-4">
      <div v-for="city in userFavorites" :key="city" class="col-md-4">
        <div class="card h-100 shadow-sm p-3 text-center border-0" style="background-color: #f8f9fa;">
          <h4 class="mb-2 text-capitalize">{{ city }}</h4>
          <div v-if="climaData[city]" class="mt-3">
            <h3 class="display-6 fw-bold">{{ climaData[city].temp }}{{ unitLabel }}</h3>
            <p class="text-muted text-capitalize">{{ climaData[city].desc }}</p>
          </div>
          <div v-else class="mt-3 text-muted">
            <div class="spinner-grow spinner-grow-sm text-secondary"></div> Cargando...
          </div>
        </div>
      </div>

      <div v-if="!userFavorites.length" class="col-12 text-center py-5 text-muted">
        <i class="fa-solid fa-earth-americas fa-3x mb-3 opacity-50"></i>
        <p>Aún no tienes ciudades favoritas guardadas.<br>¡Busca una arriba para comenzar!</p>
      </div>
    </div>
  </div>
</template>