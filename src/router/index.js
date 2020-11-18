import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Gestantes from "../views/Gestantes.vue";
import Monitoreos from "../views/Monitoreos.vue";
import MonitoreoItem from "../views/MonitoreoItem.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/gestantes",
    name: "Gestantes",
    component: Gestantes,
  },
  {
    path: "/monitoreos",
    name: "Monitoreos",
    component: Monitoreos,
  },
  {
    path: "/monitoreo-detalle",
    name: "MonitoreoItem",
    component: MonitoreoItem,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
