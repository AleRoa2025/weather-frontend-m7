<script setup>
import { ref } from 'vue';

const form = ref({ 
  nombre: '', 
  correo: '', 
  telefono: '', 
  consulta: '' 
});

const errors = ref({});
const enviando = ref(false);
const mensajeExito = ref(false);


const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validarFormulario = () => {
  errors.value = {};
  
  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es obligatorio';
  }
  
  if (!form.value.correo.trim()) {
    errors.value.correo = 'El correo es obligatorio';
  } else if (!validarEmail(form.value.correo)) {
    errors.value.correo = 'Ingresa un correo válido';
  }
  
  if (!form.value.consulta.trim()) {
    errors.value.consulta = 'La consulta es obligatoria';
  }
  
  return Object.keys(errors.value).length === 0;
};

const enviarFormulario = async () => {
  if (!validarFormulario()) return;

  enviando.value = true;
  mensajeExito.value = false;

  try {
  
    await new Promise(r => setTimeout(r, 1500));
    
   
    
    mensajeExito.value = true;
    form.value = { nombre: '', correo: '', telefono: '', consulta: '' };
    
    setTimeout(() => mensajeExito.value = false, 5000);
  } catch (error) {
    console.error('Error enviando formulario:', error);
    errors.value.general = 'No se pudo enviar el mensaje. Intenta nuevamente.';
  } finally {
    enviando.value = false;
  }
};
</script>

<template>
  <main class="contact py-5">
    <div class="container">
      <div class="text-center mb-5">
        <h1 class="contact__title display-4 fw-bold mb-3">
          <i class="fa-solid fa-envelope-circle-check text-primary me-3"></i>
          Formulario de Contacto
        </h1>
        <p class="contact__description lead text-muted">
          Para sugerencias y/o consultas, no dudes en contactarnos a través
          del siguiente formulario:
        </p>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-6">
          <form
            @submit.prevent="enviarFormulario"
            class="contact__form p-4 rounded-4 shadow-lg"
            novalidate
          >
           
            <div v-if="errors.general" class="alert alert-danger mb-4">
              <i class="fa-solid fa-circle-exclamation me-2"></i>
              {{ errors.general }}
            </div>

          
            <div class="contact__field mb-4">
              <label for="nombre" class="form-label fw-bold">
                <i class="fa-solid fa-user text-primary me-2"></i>Nombre Completo *
              </label>
              <input
                v-model="form.nombre"
                type="text"
                class="form-control contact__input"
                :class="{ 'is-invalid': errors.nombre }"
                id="nombre"
                placeholder="Tu nombre completo"
                @blur="errors.nombre = null"
              />
              <small v-if="errors.nombre" class="text-danger mt-1">
                <i class="fa-solid fa-circle-info me-1"></i>{{ errors.nombre }}
              </small>
            </div>

          
            <div class="contact__field mb-4">
              <label for="correo" class="form-label fw-bold">
                <i class="fa-solid fa-envelope text-success me-2"></i>Correo Electrónico *
              </label>
              <input
                v-model="form.correo"
                type="email"
                class="form-control contact__input"
                :class="{ 'is-invalid': errors.correo }"
                id="correo"
                placeholder="tucorreo@ejemplo.com"
                @blur="errors.correo = null"
              />
              <small v-if="errors.correo" class="text-danger mt-1">
                <i class="fa-solid fa-circle-info me-1"></i>{{ errors.correo }}
              </small>
            </div>

           
            <div class="contact__field mb-4">
              <label for="telefono" class="form-label fw-bold">
                <i class="fa-solid fa-phone text-info me-2"></i>Teléfono (opcional)
              </label>
              <input
                v-model="form.telefono"
                type="tel"
                class="form-control contact__input"
                id="telefono"
                placeholder="+56 9 1234 5678"
              />
            </div>

           
            <div class="contact__field mb-4">
              <label for="consulta" class="form-label fw-bold">
                <i class="fa-solid fa-message text-warning me-2"></i>Tu Consulta *
              </label>
              <textarea
                v-model="form.consulta"
                class="form-control contact__textarea"
                :class="{ 'is-invalid': errors.consulta }"
                id="consulta"
                rows="5"
                placeholder="Escribe tu mensaje aquí..."
                @blur="errors.consulta = null"
              ></textarea>
              <small v-if="errors.consulta" class="text-danger mt-1">
                <i class="fa-solid fa-circle-info me-1"></i>{{ errors.consulta }}
              </small>
            </div>

        
            <div class="text-center">
              <button
                type="submit"
                class="contact__button btn btn-primary btn-lg px-5 py-3 fw-bold shadow-lg"
                :disabled="enviando"
              >
                <span v-if="!enviando">
                  <i class="fa-solid fa-paper-plane me-2"></i>Enviar Mensaje
                </span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enviando...
                </span>
              </button>
            </div>
          </form>       
          <div v-if="mensajeExito" class="contact__alert contact__alert--success mt-4 p-3 text-center">
          <i class="fa-solid fa-check-circle fa-2x mb-2 d-block"></i>
          <strong>¡Mensaje enviado exitosamente!</strong><br>
          <small class="text-muted">Te responderemos a la brevedad.</small>
          </div>

          <div v-if="errors.general" class="contact__alert contact__alert--error mt-4 p-3 text-center">
          <i class="fa-solid fa-circle-exclamation fa-2x mb-2 d-block"></i>
           <strong>{{ errors.general }}</strong>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

