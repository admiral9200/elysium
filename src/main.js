/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia";

// Plugins
import { registerPlugins } from "@/plugins";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

registerPlugins(app);

app.mount("#app");
