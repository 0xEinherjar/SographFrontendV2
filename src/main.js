import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./routes/index.js";
import Blockchain from "./infra/blockchain.js";
import Token from "./infra/token.js";

const blockchain = new Blockchain();
const token = new Token();
blockchain.init(window);
token.init(window);
const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
