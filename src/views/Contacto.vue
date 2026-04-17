<script setup>
import { ref } from 'vue';
const form = ref({ nombre: '', correo: '', consulta: '' });
const enviando = ref(false);
const mensajeExito = ref(false);
const enviarFormulario = async () => {
  if (!form.value.nombre || !form.value.correo || !form.value.consulta) return;
  enviando.value = true;
  await new Promise(r => setTimeout(r, 1000));
  mensajeExito.value = true;
  form.value = { nombre: '', correo: '', consulta: '' };
  enviando.value = false;
};
</script>

<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4"> Formulario de Contacto</h2>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <form @submit.prevent="enviarFormulario" class="contact__form shadow-lg p-4 rounded-4">
          <div class="mb-3"><label class="form-label">Nombre *</label><input v-model="form.nombre" class="form-control" required></div>
          <div class="mb-3"><label class="form-label">Correo *</label><input v-model="form.correo" type="email" class="form-control" required></div>
          <div class="mb-3"><label class="form-label">Consulta *</label><textarea v-model="form.consulta" class="form-control" rows="4" required></textarea></div>
          <button type="submit" class="btn btn-primary w-100" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}</button>
          <div v-if="mensajeExito" class="alert alert-success mt-3">¡Mensaje enviado!</div>
        </form>
      </div>
    </div>
  </div>
</template>