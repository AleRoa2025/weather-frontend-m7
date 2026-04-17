<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isLogin = ref(true); 
const form = ref({ email: '', password: '' });
const error = ref('');
const loading = ref(false);


const title = computed(() => isLogin.value ? 'Iniciar Sesión' : 'Crear Cuenta');
const btnText = computed(() => isLogin.value ? 'Ingresar' : 'Registrarse');
const footerText = computed(() => isLogin.value ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  

  const action = isLogin.value ? 'login' : 'register';
  
  try {
    await store.dispatch(action, form.value);
    router.push('/');
  } catch (e) {
    error.value = e.message || 'Error en la operación';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4 mx-auto" style="max-width: 400px;">
      <h3 class="text-center mb-4">{{ title }}</h3>
      
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="form-control" required>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input v-model="form.password" type="password" class="form-control" required minlength="4">
        </div>

        <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Cargando...' : btnText }}
        </button>

        <div class="mt-3 text-center">
          <a href="#" @click.prevent="isLogin = !isLogin" class="small text-decoration-none">
            {{ footerText }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>