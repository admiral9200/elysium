<template>
  <div class="font-weight-bold text-h4 mt-4">Top Collection</div>
  <v-row class="mt-5" v-if="topCollections.length">
    <v-col cols="12" md="4" v-for="item in topCollections" :key="item.address">
      <v-card class="mx-auto" max-width="344" color="black">
        <v-img src="https://picsum.photos/600/300" height="200px"></v-img>
        <v-card-title class="text-h5">{{ item.name }}</v-card-title>
        <v-card-text>{{ item.address }}</v-card-text>
        <v-card-actions class="d-flex justify-space-between mx-2">
          <v-btn variant="outlined" :to="item.link">View</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, onMounted } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "TopCollection",
  setup() {
    const { getTopCollection, getCollectionDetails } = useMarketStore();
    const topCollections = ref([]);

    onMounted(async () => {
      try {
        const res = await getTopCollection();
        if (res) {
          for (let i = 0; i < res.length; i++) {
            let collectionItem = await getCollectionDetails(res[i][0]);
            collectionItem.link = `/collection/${res[i][0]}`;
            topCollections.value.push(collectionItem);
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    return {
      topCollections,
    };
  },
};
</script>
