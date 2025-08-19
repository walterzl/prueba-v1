// Importar estilos base y globales
import "./assets/base.css";
import "./estilos/estilos-globales.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Crear la aplicación Vue
const aplicacion = createApp(App);

// Configurar plugins
aplicacion.use(createPinia());
aplicacion.use(router);

// Montar la aplicación
aplicacion.mount("#app");
