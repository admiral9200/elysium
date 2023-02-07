<template>
  <v-app-bar color="black">
    <v-app-bar-title class="font-weight-black text-h5">
      <v-icon icon="mdi-alpha-e-box" size="50" />
      Elysium
    </v-app-bar-title>

    <v-text-field
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>

    <v-spacer></v-spacer>

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
      @click="connectMetamask()"
      v-if="!isConnected"
    >
      Connect
    </v-btn>
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props"
          ><img
            style="width: 35px; border: 2px solid #fff; border-radius: 100%"
            :src="pfp_url"
          />
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
import { ref, onMounted } from "vue";
import Web3 from "web3";
import axios from "axios";

export default {
  name: "AppBar",
  emits: ["onShowCart", "onSignUp"],
  setup(props, { emit }) {
    const menu = [
      {
        text: "My Space",
        icon: "mdi-space-invaders",
        link: "/user/" + sessionStorage.getItem("address"),
      },
      {
        text: "Create NFT",
        icon: "mdi-pencil-ruler",
        link: "/create-nft",
      },
      {
        text: "Manage Wallet",
        icon: "mdi-wallet",
        link: "/wallet",
      },
      {
        text: "Setting",
        icon: "mdi-cog",
        link: "/setting",
      },
      {
        text: "Help",
        icon: "mdi-help",
        link: "/help",
      },
    ];

    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");
    var address = ref([]);
    var pfp_url = ref("");
    const isConnected = ref(false);

    onMounted(async () => {
      //check if user has logged in
      if (sessionStorage.getItem("address")) {
        pfp_url.value = sessionStorage.getItem("pfp");
        isConnected.value = true;
      }
      // if (window.ethereum) {
      //   const _acc = await web3.eth.requestAccounts();
      //   accounts = _acc.slice();
      //   isConnected.value = true;
      // }
    });

    const connectMetamask = async () => {
      try {
        const _acc = await web3.eth.requestAccounts();
        address = _acc.slice();
        sessionStorage.setItem("address", address);
        login();
      } catch (error) {
        console.error(error);
      }
    };

    const login = async () => {
      //check if user previously signed up
      try {
        const res = await axios.get("/api/user/" + address);
        //if not, show sign up page
        if (res.data === "User not found") {
          emit("onSignUp", true);
        } else {
          // else, save user info to session storage
          sessionStorage.setItem("pfp", res.data.profile_url);
          pfp_url.value = sessionStorage.getItem("pfp");
          isConnected.value = true;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const logout = () => {
      sessionStorage.clear();
      isConnected.value = false;
    };

    return {
      menu,
      isConnected,
      pfp_url,
      //function
      connectMetamask,
      logout,
    };
  },
};
</script>
