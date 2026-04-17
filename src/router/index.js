import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Favoritos from '../views/Favoritos.vue';
import Detalle from '../views/Detalle.vue';
import Contacto from '../views/Contacto.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/favoritos', component: Favoritos, meta: { requiresAuth: true } },
  { path: '/lugar/:id', component: Detalle },
  { path: '/contacto', component: Contacto }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) next('/login');
  else next();
});

export default router;