import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest'; 
import App from '../App.vue';
import router from '../router';
import store from '../store';


vi.mock('/img/weather-logo.png', () => ({ default: 'logo-stub' }));

describe('App.vue - Verificación de Entrega', () => {
  it('debe mostrar el nombre de la desarrolladora en el footer', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, store]
      }
    });

    const footerText = wrapper.find('.footer__text').text();
    
   
    expect(footerText).toContain('Alejandra Roa Peña');
  });

  it('debe tener el logo con la ruta correcta', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, store]
      }
    });
    
    const logo = wrapper.find('img.navbar__image');
    
    
    expect(logo.attributes('src')).toBe('logo-stub');
  });
});