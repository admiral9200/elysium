<template>
  <v-container fluid v-if="userExist">
    <v-card class="mx-auto" color="background">
      <profile />
      <v-tabs class="mt-10" v-model="tab" align-tabs="left">
        <v-tab :value="1">Owned</v-tab>
        <v-tab :value="2">On Sale</v-tab>
        <v-tab :value="3">Activity</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="1">
          <OwnedNFT :userAddress="userAddress" />
        </v-window-item>
        <v-window-item :value="2">
          <OnSale :userAddress="userAddress" />
        </v-window-item>
        <v-window-item :value="3">
          <Activity />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
  <v-container
    class="d-flex justify-center align-center"
    style="height: 70vh"
    v-else
  >
    <v-card class="mx-auto" color="background">
      <v-card-title class="text-h4">User not found</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Profile from "@/components/mySpace/profile.vue";
import OwnedNFT from "@/components/mySpace/ownedNFT.vue";
import OnSale from "@/components/mySpace/onSale.vue";
import Activity from "@/components/mySpace/activity.vue";

export default {
  name: "MySpace",
  components: {
    Profile,
    OwnedNFT,
    OnSale,
    Activity,
  },
  setup() {
    const tab = ref(1);
    const route = useRoute();
    const userExist = ref(true);
    const userAddress = route.params.address;

    onMounted(async () => {
      try {
        const res = await axios.get("/api/user/" + route.params.address);
        if (res.status === 200) userExist.value = true;
      } catch (error) {
        if (error.response.status === 404) {
          userExist.value = false;
        }
        console.error(error);
      }
    });

    return {
      tab,
      userExist,
      userAddress,
    };
  },
};
</script>
