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
      color="white"
      v-for="item in items"
      :key="item"
      :to="item.link"
      class="me-2"
      large
      :icon="item.icon"
      :active="false"
    >
    </v-btn>
    <v-menu>
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
export default {
  name: "AppBar",
  setup() {
    const items = [
      {
        text: "Discover",
        icon: "mdi-creation",
        link: "/",
      },
      {
        text: "Cart",
        icon: "mdi-cart",
        link: "/cart",
      },
    ];
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
    return {
      items,
      menu,
    };
  },
};
</script>
