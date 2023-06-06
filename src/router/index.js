// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/user/:address",
        name: "MySpace",
        component: () =>
          import(/* webpackChunkName: "MySpace" */ "@/views/MySpace.vue"),
      },
      {
        path: "/user/collection/:address",
        name: "MyCollection",
        component: () =>
          import(
            /* webpackChunkName: "MyCollection" */ "@/views/MyCollection.vue"
          ),
      },
      {
        path: "/create-nft",
        name: "CreateNFT",
        component: () =>
          import(/* webpackChunkName: "CreateNFT" */ "@/views/CreateNFT.vue"),
      },
      {
        path: "/collection/:address",
        name: "Collection",
        component: () =>
          import(
            /* webpackChunkName: "CollectionPage" */ "@/views/CollectionPage.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
