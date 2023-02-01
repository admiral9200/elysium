<template>
  <v-container fluid>
    <v-card class="mx-auto" color="background">
      <profile />
      <v-tabs
        class="mt-10"
        v-model="tab"
        color="deep-purple-accent-4"
        align-tabs="left"
      >
        <v-tab :value="1">Owned</v-tab>
        <v-tab :value="2">On Sale</v-tab>
        <v-tab :value="3">Activity</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="1">
          <OwnedNFT />
        </v-window-item>
        <v-window-item :value="2">
          <OnSale />
        </v-window-item>
        <v-window-item :value="3">
          <Activity />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from "vue";
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
    var tab = ref(1);
    return {
      tab,
    };
  },
};
</script>
