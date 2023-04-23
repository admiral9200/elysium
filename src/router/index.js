// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
  },
  {
    path: "/user/:address",
    name: "MySpace",
    component: () =>
      import(/* webpackChunkName: "MySpace" */ "@/views/MySpace.vue"),
  },
  {
    path: "/collection/:address",
    name: "MyCollection",
    component: () =>
      import(/* webpackChunkName: "MySpace" */ "@/views/MyCollection.vue"),
  },
  {
    path: "/create-nft",
    name: "CreateNFT",
    component: () =>
      import(/* webpackChunkName: "CreateNFT" */ "@/views/CreateNFT.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
