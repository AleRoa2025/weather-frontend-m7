<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isAuthenticated = computed(() => store.state.isAuthenticated);
const user = computed(() => store.state.user);

const handleLogout = () => {
  store.dispatch("logout");
  router.push("/login");
};
</script>

<template>
  <div id="app-wrapper" class="d-flex flex-column min-vh-100">
    <header class="header">
      <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="container-fluid">
          <router-link to="/" class="navbar__logo">
            <img
              src="/img/weather-logo.png"
              class="navbar__image"
              alt="Logo Clima Internacional"
            />
          </router-link>

          <button
            class="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div
            class="collapse navbar-collapse justify-content-end"
            id="navbarMenu"
          >
            <ul
              class="navbar__menu d-flex align-items-center list-unstyled mb-0 gap-3"
            >
              <li v-if="!isAuthenticated" class="navbar__item">
                <router-link
                  to="/login"
                  class="navbar__link"
                  active-class="navbar__link--active"
                >
                  Ingresar
                </router-link>
              </li>

              <li class="navbar__item">
                <router-link
                  to="/"
                  class="navbar__link"
                  active-class="navbar__link"
                >
                  Home
                </router-link>
              </li>

              <li v-if="isAuthenticated" class="navbar__item">
                <router-link
                  to="/favoritos"
                  class="navbar__link"
                  active-class="navbar__link--active"
                >
                  Favoritos
                </router-link>
              </li>

              <li class="navbar__item">
                <router-link
                  to="/contacto"
                  class="navbar__link navbar__link--new"
                  active-class="navbar__link--active"
                >
                  Contacto
                </router-link>
              </li>

              <li
                v-if="isAuthenticated"
                class="d-flex align-items-center gap-2"
              >
                <span class="nav-user">
                  <i class="fa-solid fa-user-circle"></i> {{ user?.name }}
                </span>
                <button
                  @click="handleLogout"
                  class="btn btn-sm btn-outline-danger"
                >
                  Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="flex-grow-1">
      <router-view></router-view>
    </main>
    <button id="btn-top" class="btn-top" aria-label="Volver arriba">
      <i class="fa-solid fa-arrow-up"></i>
    </button>
    <footer class="footer text-center">
      <div class="container py-4">
        <p class="footer__text mb-1">
          <strong>App Clima Internacional · Módulo VII</strong>
        </p>
        <p class="footer__text mb-0"><em>Alejandra Roa Peña</em> 2026</p>
      </div>
    </footer>
  </div>
</template>
