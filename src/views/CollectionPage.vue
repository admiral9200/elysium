<template>
  <v-container fluid v-if="collectionExist">
    <v-card class="mx-auto" variant="outlined" theme="dark">
      <div class="pa-8">
        <v-card-title class="text-h3 my-2">
          {{ collectionDetails.name }}
        </v-card-title>
        <v-card-subtitle>{{ collectionDetails.address }}</v-card-subtitle>
        <v-card-text>Royalty: {{ collectionDetails.royalty }}%</v-card-text>
        <v-card-text> Royalty Recipient: </v-card-text>
        <v-card-subtitle>
          {{ collectionDetails.royaltyRecipient }}
        </v-card-subtitle>
      </div>
      <v-tabs class="mt-10" v-model="tab" align-tabs="left">
        <v-tab :value="1">All</v-tab>
        <v-tab :value="2">On Sale</v-tab>
        <v-tab :value="3">Activity</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="1">
          <AllNFT :collectionAddress="collectionAddress" />
        </v-window-item>
        <v-window-item :value="2">
          <OnSale :collectionAddress="collectionAddress" />
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
import { useMarketStore } from "@/stores/market";
import axios from "axios";
import { useRoute } from "vue-router";
import AllNFT from "@/components/collectionPage/allNFT.vue";
import OnSale from "@/components/collectionPage/onSale.vue";
import Activity from "@/components/collectionPage/activity.vue";

export default {
  name: "CollectionPage",
  components: {
    AllNFT,
    OnSale,
    Activity,
  },
  setup() {
    const { getCollectionDetails } = useMarketStore();
    const tab = ref(1);
    const route = useRoute();
    const collectionAddress = route.params.address;
    const collectionExist = ref(true);
    const collectionDetails = ref({});

    onMounted(async () => {
      try {
        collectionDetails.value = await getCollectionDetails(collectionAddress);
      } catch (error) {
        console.error(error);
      }
    });

    return {
      tab,
      collectionExist,
      collectionAddress,
      collectionDetails,
    };
  },
};
</script>
