import { createApp } from "vue";
import { createPinia } from "pinia";
import { WagmiPlugin } from "@wagmi/vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import { config } from "./wagmi.js";
import { Buffer } from "buffer";
import router from "./routes/index.js";
import App from "./App.vue";
import "./style.css";

globalThis.Buffer = Buffer;
const queryClient = new QueryClient();
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(WagmiPlugin, { config });
app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
