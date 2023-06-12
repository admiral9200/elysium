<template>
  <v-app>
    <v-layout>
      <admin-app-bar @onSignUp="(req) => (showSignUp = req)" />
      <admin-side-bar />
      <v-main>
        <router-view />
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
    </v-layout>
    <default-footer />
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";

import AdminAppBar from "./AppBar.vue";
import AdminSideBar from "./SideBar.vue";
import DefaultFooter from "../default/AppFooter.vue";
import SignUp from "@/views/SignUp.vue";

export default {
  name: "Default",
  components: {
    AdminAppBar,
    AdminSideBar,
    DefaultFooter,
    SignUp,
  },
  setup() {
    const showSignUp = ref(false);
    onMounted(() => {
      document.title = "Elysium | Admin";
    });
    return {
      showSignUp,
    };
  },
};
</script>
