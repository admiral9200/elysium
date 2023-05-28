<template>
  <div class="font-weight-bold text-h4 mt-4">Top Collection</div>
  <v-row class="mt-5" v-if="topCollections.length">
    <v-col cols="12" md="4" v-for="item in topCollections" :key="item.address">
      <v-card class="mx-auto" max-width="344" color="black">
        <v-img :src="item.cover" height="200px"></v-img>
        <v-card-title class="text-h5">{{ item.name }}</v-card-title>
        <v-card-text>{{ item.address }}</v-card-text>
        <v-card-actions class="d-flex justify-space-between mx-2">
          <v-btn variant="outlined">{{ item.counts }} Followers</v-btn>
          <v-btn class="w-50" variant="outlined" :to="item.link">View</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "TopCollection",
  setup() {
    const { getCollectionDetails } = useMarketStore();
    const topCollections = ref([]);

    onMounted(async () => {
      try {
        const res = await axios.get("/api/collection/topCollection");

        if (res.status === 200) {
          for (const item of res.data) {
            let collectionItem = await getCollectionDetails(item[0]);
            if (collectionItem.totalSupply == 0) continue;
            collectionItem.link = `/collection/${item[0]}`;
            collectionItem.counts = item[1];
            topCollections.value.push(collectionItem);
          }
        }
      } catch (err) {
        if (err.response.status === 404)
          // TODO if no top collection, show something else
          console.log(err);
      }
    });

    return {
      topCollections,
    };
  },
};
</script>
