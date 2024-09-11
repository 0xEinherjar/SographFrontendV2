import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./routes/index.js";
import Blockchain from "./infra/blockchain.js";
import Token from "./infra/token.js";
import Post from "./infra/post.js";
import AxiosHttpClient from "./infra/axios-adapter.js";
import ReportGateway from "./gateways/report.js";

const httpClient = new AxiosHttpClient();
const reportGateway = new ReportGateway(
  httpClient,
  import.meta.env.VITE_BACKEND_URL
);
const blockchain = new Blockchain();
const post = new Post();
const token = new Token();
blockchain.init();
post.init();
token.init();
const pinia = createPinia();
const app = createApp(App);
app.provide("reportGateway", reportGateway);
app.provide("postClient", post);
app.provide("tokenClient", token);
app.provide("blockchainClient", blockchain);
app.use(router);
app.use(pinia);
app.mount("#app");
