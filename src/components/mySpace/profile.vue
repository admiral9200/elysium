<template>
  <v-img
    class="d-flex align-end"
    height="60vh"
    cover
    src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
  ></v-img>
  <v-row>
    <v-col
      class="text-center"
      md="4"
      cols="12"
      style="position: relative; top: -5em; max-height: 150px"
    >
      <v-avatar class="mb-0 rounded-circle" color="grey" size="150">
        <v-img
          cover
          src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
        ></v-img>
      </v-avatar>
      <v-card-title>{{ name }}</v-card-title>
      <v-card-subtitle>{{ address }}</v-card-subtitle>
    </v-col>
    <v-col md="6" cols="12">
      <v-row class="mt-4 text-center">
        <v-col cols="4">
          <v-card-text class="text-h5">{{ ownedQty }}</v-card-text>
          <v-card-subtitle>Owned NFTs</v-card-subtitle>
        </v-col>
        <v-col cols="4">
          <v-card-text class="text-h5">{{ followers }}</v-card-text>
          <v-card-subtitle>Followers</v-card-subtitle>
        </v-col>
        <v-col cols="4">
          <v-card-text class="text-h5">{{ following }}</v-card-text>
          <v-card-subtitle>Following</v-card-subtitle>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="d-flex justify-center align-center" lg="2" md="2" cols="12">
      <v-btn class="mx-2" width="80%">Follow</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Profile",
  setup() {
    const name = "Marcus Obrien";
    const address = "0x2e8cf6a2a...87d3";
    const ownedQty = 5;
    const followers = 10;
    const following = 20;

    return {
      name,
      address,
      ownedQty,
      followers,
      following,
    };
  },
};
</script>
