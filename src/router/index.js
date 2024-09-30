import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/welcome.vue";
import Glasshouse from "../views/glasshouse.vue";
import VSGlasshouse from "../views/value-settinggl.vue";
import Greenhouse from "../views/greenhouse.vue";
import VSGreenhouse from "../views/value-settinggr.vue";
import Faperta from "../views/faperta.vue";
import VSFaperta from "../views/value-settingfp.vue";
import PinEntry from "../components/PinEntry.vue";
import NotFound from "../components/NotFound.vue";
import LoginPage from "../views/login.vue";

const routes = [
  {
    path: "/",
    name: "welcome",
    component: Home,
    meta: { layout: "header-footer" },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/pin-entry",
    name: "pin-entry",
    component: PinEntry,
  },
  {
    path: "/glasshouse",
    name: "argonomis_dashboard_glasshouse",
    component: Glasshouse,
    meta: { layout: "header" },
  },
  {
    path: "/glasshouse/value-setting",
    name: "value-setting-gl",
    component: VSGlasshouse,
    meta: { layout: "header" },
    beforeEnter: (to, from, next) => {
      const pinValidUntil = localStorage.getItem("pinValidUntilGlasshouse");
      const currentTime = new Date().getTime();

      if (pinValidUntil && currentTime < pinValidUntil) {
        next();
      } else {
        next({ name: "pin-entry", query: { redirect: to.fullPath, type: "glasshouse" } });
      }
    },
  },
  {
    path: "/greenhouse",
    name: "argonomis_dashboard_greenhouse",
    component: Greenhouse,
    meta: { layout: "header" },
  },
  {
    path: "/greenhouse/value-setting",
    name: "value-setting-gr",
    component: VSGreenhouse,
    meta: { layout: "header" },
    beforeEnter: (to, from, next) => {
      const pinValidUntil = localStorage.getItem("pinValidUntilGreenhouse");
      const currentTime = new Date().getTime();

      if (pinValidUntil && currentTime < pinValidUntil) {
        next();
      } else {
        next({ name: "pin-entry", query: { redirect: to.fullPath, type: "greenhouse" } });
      }
    },
  },
  {
    path: "/faperta",
    name: "argonomis_dashboard_faperta",
    component: Faperta,
    meta: { layout: "header" },
  },
  {
    path: "/faperta/value-setting",
    name: "value-setting-fp",
    component: VSFaperta,
    meta: { layout: "header" },
    beforeEnter: (to, from, next) => {
      const pinValidUntil = localStorage.getItem("pinValidUntilFaperta");
      const currentTime = new Date().getTime();

      if (pinValidUntil && currentTime < pinValidUntil) {
        next();
      } else {
        next({ name: "pin-entry", query: { redirect: to.fullPath, type: "faperta" } });
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
