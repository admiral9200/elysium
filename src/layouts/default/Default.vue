<template>
  <v-app>
    <default-bar
      @onShowCart="() => (showCart = !showCart)"
      @onSignUp="(req) => (showSignUp = req)"
    />

    <v-main>
      <router-view />
      <v-overlay
        v-model="showCart"
        location-strategy="connected"
        class="d-flex justify-end"
      >
        <my-cart v-if="showCart" @onShowCart="() => (showCart = !showCart)" />
      </v-overlay>
      <v-overlay
        v-model="showSignUp"
        location-strategy="connected"
        class="d-flex justify-center"
      >
        <sign-up
          v-if="showSignUp"
          @onSignUp="() => (showSignUp = !showSignUp)"
        />
      </v-overlay>
    </v-main>

    <default-footer />
  </v-app>
</template>

<script>
import { ref } from "vue";

import DefaultBar from "./AppBar.vue";
import DefaultFooter from "./Footer.vue";
import SignUp from "@/views/SignUp.vue";
import MyCart from "@/views/MyCart.vue";

export default {
  name: "Default",
  components: {
    DefaultBar,
    DefaultFooter,
    SignUp,
    MyCart,
  },
  setup() {
    const showSignUp = ref(false);
    const showCart = ref(false);

    return {
      showSignUp,
      showCart,
    };
  },
};
</script>
