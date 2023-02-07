<template>
  <v-img height="60vh" cover :src="background_url"></v-img>
  <v-row>
    <v-col
      class="text-center"
      md="4"
      cols="12"
      style="position: relative; top: -5em; max-height: 150px"
    >
      <v-avatar class="mb-0 rounded-circle" color="grey" size="150">
        <v-img cover :src="pfp_url"></v-img>
      </v-avatar>
      <v-card-title>@{{ username }}</v-card-title>
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
export default {
  name: "Profile",
  setup() {
    const route = useRoute();
    const username = ref("");
    const address = ref("");
    const pfp_url = ref("");
    const background_url = ref("");
    const ownedQty = 5;
    const followers = 10;
    const following = 20;

    // onMounted async because it take time for the parent component to fetch data
    onMounted(async () => {
      try {
        const res = await axios.get("/api/user/" + route.params.address);
        if (res.data === "User not found") {
          console.log("User not found");
        } else {
          username.value = res.data.username;
          let original_address = res.data.address;
          let truncated_address1 = original_address.substring(0, 5);
          let truncated_address2 = original_address.substring(
            original_address.length - 4,
            original_address.length
          );
          address.value = truncated_address1 + "..." + truncated_address2;
          pfp_url.value = res.data.profile_url;
          background_url.value = res.data.background_url;
        }
      } catch (error) {
        console.error(error);
      }
    });

    return {
      username,
      address,
      pfp_url,
      background_url,
      ownedQty,
      followers,
      following,
    };
  },
};
</script>
