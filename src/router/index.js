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
        path: "/user/collection/",
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
        name: "CollectionPage",
        component: () =>
          import(
            /* webpackChunkName: "CollectionPage" */ "@/views/CollectionPage.vue"
          ),
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("@/layouts/admin/View.vue"),
    children: [
      {
        path: "",
        redirect: "admin/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () =>
          import(/* webpackChunkName: "Index" */ "@/views/Admin/Index.vue"),
      },
      {
        path: "user",
        name: "User",
        component: () =>
          import(/* webpackChunkName: "User" */ "@/views/Admin/User.vue"),
      },
      {
        path: "collection",
        name: "Collection",
        component: () =>
          import(/* webpackChunkName: "User" */ "@/views/Admin/Collection.vue"),
      },
      {
        path: "platform",
        name: "Platform",
        component: () =>
          import(/* webpackChunkName: "User" */ "@/views/Admin/Platform.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
