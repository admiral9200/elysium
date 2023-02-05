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
        <v-btn icon="mdi-account-circle" v-bind="props"></v-btn>
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
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Web3 from "web3";
export default {
  name: "AppBar",
  emits: ["onShowCart"],
  setup() {
    const menu = [
      {
        text: "My Space",
        icon: "mdi-space-invaders",
        link: "/my-space",
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
      {
        text: "Logout",
        icon: "mdi-logout",
        link: "/logout",
      },
    ];

    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000");
    var accounts = ref([]);
    const isConnected = ref(false);

    onMounted(async () => {
      if (window.ethereum) {
        const _acc = await web3.eth.requestAccounts();
        accounts = _acc.slice();
        isConnected.value = true;
      }
    });

    async function connectMetamask() {
      try {
        const _acc = await web3.eth.requestAccounts();
        accounts = _acc.slice();
        isConnected.value = true;
      } catch (error) {
        console.error(error);
      }
    }
    return {
      menu,
      isConnected,
      //function
      connectMetamask,
    };
  },
};
</script>
