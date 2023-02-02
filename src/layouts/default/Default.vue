<template>
  <v-app>
    <default-bar @onShowCart="() => (showCart = !showCart)" />

    <v-main>
      <router-view />
      <v-overlay
        v-model="showCart"
        location-strategy="connected"
        class="d-flex justify-end"
      >
        <my-cart v-if="showCart" @onShowCart="() => (showCart = !showCart)" />
      </v-overlay>
    </v-main>

    <default-footer />
  </v-app>
</template>

<script>
import { ref, computed } from "vue";

import DefaultBar from "./AppBar.vue";
import DefaultFooter from "./Footer.vue";

import MyCart from "@/views/MyCart.vue";

export default {
  name: "Default",
  components: {
    DefaultBar,
    DefaultFooter,
    MyCart,
  },
  setup() {
    const showCart = ref(false);

    return {
      showCart,
    };
  },
};
</script>
