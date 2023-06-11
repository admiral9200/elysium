<template>
  <v-app-bar color="black">
    <v-app-bar-title class="font-weight-black text-h5" @click="home()">
      <v-icon icon="mdi-alpha-e-box" size="50" />
      <span class="d-none d-sm-inline-block ms-3">Elysium</span>
    </v-app-bar-title>

    <div class="d-none d-sm-flex w-50">
      <v-text-field
        append-icon="mdi-magnify"
        label="Search"
        density="compact"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
    </div>
    <div class="d-flex d-sm-none w-10 justify-end">
      <v-btn icon="mdi-magnify"></v-btn>
    </div>

    <v-btn
      to="/"
      class="me-2"
      large
      icon="mdi-creation"
      :active="false"
    ></v-btn>

    <v-btn
      class="me-2"
      large
      icon="mdi-cart"
      :active="false"
      @click="$emit('onShowCart')"
      v-if="isConnected"
    ></v-btn>

    <v-btn
      class="me-2"
      large
      rounded
      color="white"
      variant="outlined"
      @click="login()"
      v-if="!isConnected"
    >
      Connect
    </v-btn>
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props">
          <v-avatar size="35">
            <v-img
              style="border: 2px solid #fff; border-radius: 100%"
              :src="pfp_url"
              alt="Profile Picture"
            />
          </v-avatar>
        </v-btn>
      </template>

      <v-list bg-color="background">
        <v-list-item
          v-for="(item, i) in menu"
          :key="i"
          :prepend-icon="item.icon"
          :to="item.link"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-list-item color="red" prepend-icon="mdi-logout" @click="logout()"
          >Logout</v-list-item
        >
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useMarketStore } from "@/stores/market";
import { storeToRefs } from "pinia";

export default {
  name: "AppBar",
  emits: ["onShowCart", "onSignUp"],
  setup(props, { emit }) {
    const marketStore = useMarketStore();
    const { account } = storeToRefs(marketStore);

    const menu = [
      {
        text: "My Space",
        icon: "mdi-space-invaders",
        link: "/user/" + sessionStorage.getItem("address"),
      },
      {
        text: "My Collection",
        icon: "mdi-cards",
        link: "/user/collection/",
      },
      {
        text: "Create NFT",
        icon: "mdi-pencil-ruler",
        link: "/create-nft",
      },
      {
        text: "Manage Wallet",
        icon: "mdi-wallet",
        // link: "/wallet",
        link: "/",
      },
      {
        text: "Setting",
        icon: "mdi-cog",
        // link: "/setting",
        link: "/",
      },
      {
        text: "Help",
        icon: "mdi-help",
        // link: "/help",
        link: "/",
      },
    ];

    const pfp_url = ref("");
    const isConnected = ref(false);
    const router = useRouter();

    onMounted(async () => {
      console.log(account.value);
      //check if user has logged in
      if (sessionStorage.getItem("pfp")) {
        pfp_url.value = sessionStorage.getItem("pfp");
        isConnected.value = true;
      }
      // if (window.ethereum) {
      //   login();
      // }
    });

    const home = () => {
      router.push("/");
    };

    const login = async () => {
      //connect wallet
      await marketStore.connectWallet();
      //check if user previously signed up
      try {
        const res = await axios.get("/api/user/" + account.value);
        sessionStorage.setItem("address", account.value);
        sessionStorage.setItem("pfp", res.data.profile_url);
        pfp_url.value = sessionStorage.getItem("pfp");
        isConnected.value = true;
      } catch (error) {
        console.log(error.response.status);
        //if user not found, show sign up page
        if (error.response.status === 404) {
          emit("onSignUp", true);
        } else {
          console.error(error);
        }
      }
    };

    const logout = () => {
      sessionStorage.clear();
      //TODO clear account.value in pinia and disconnect wallet
      isConnected.value = false;
      router.push("/");
    };

    return {
      menu,
      isConnected,
      pfp_url,
      //function
      home,
      login,
      logout,
    };
  },
};
</script>
