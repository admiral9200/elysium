<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex" md="7" cols="12">
        <filterMenu :showStatus="true" />
        <v-text-field
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          clear-icon="mdi-close-circle"
          clearable
          density="compact"
          variant="outlined"
          class="ms-4"
        ></v-text-field>
      </v-col>
      <v-col class="d-flex" md="5" cols="12">
        <v-select
          :items="[
            'Recently Created',
            'Recently Listed',
            'Recently Sold',
            'Alphabetical: A-Z',
            'Alphabetical: Z-A',
            'Price: Low to High',
            'Price: High to Low',
            'Newest',
            'Oldest',
          ]"
          label="Sort by"
          variant="outlined"
          density="compact"
          style="max-width: 200px"
          class="ms-md-auto"
        ></v-select>
        <v-btn-toggle
          class="ms-4"
          v-model="selectedView"
          style="width: 120px"
          mandatory
        >
          <v-btn
            icon="mdi-format-list-bulleted-square"
            size="40"
            value="listView"
          >
          </v-btn>
          <v-btn icon="mdi-grid" size="40" value="smallIcon"></v-btn>
          <v-btn icon="mdi-grid-large" size="40" value="largeIcon"> </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="selectedView == 'listView' && ownedNFTs.length > 0">
      <v-col cols="12">
        <v-table fixed-header height="300px" theme="dark">
          <thead>
            <tr>
              <th class="text-left">Preview</th>
              <th class="text-left">Name</th>
              <th class="text-left">Address</th>
              <th class="text-left">Price</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ownedNFTs" :key="item.tokenUri">
              <td><v-img height="80" :src="item.tokenUri"></v-img></td>
              <td>{{ item.name }}</td>
              <td>{{ item.desc }}</td>
              <td>{{ item.price }} ETH</td>
              <td>
                <v-btn color="accent" variant="tonal">View</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row
      class="my-auto"
      v-else-if="
        (selectedView == 'smallIcon' || selectedView == 'largeIcon') &&
        ownedNFTs.length > 0
      "
    >
      <v-col
        v-for="item in ownedNFTs"
        :key="item.tokenUri"
        :md="iconSize"
        cols="12"
      >
        <v-card class="mx-auto py-2" max-width="344" variant="tonal">
          <v-img height="194" :src="item.tokenUri"></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.desc }}</v-card-subtitle>
          <v-card-text>{{ item.price }} ETH</v-card-text>
          <v-card-actions class="d-flex justify-space-between mx-2">
            <v-btn width="100%" color="accent" variant="tonal">View</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <!-- <v-img src="@/assets/images/empty.svg" width="200"></v-img> -->
        <h3 class="mt-4">You don't have any NFTs yet</h3>
        <p class="mt-2">
          You can buy NFTs from the marketplace or create your own NFTs
        </p>
        <v-btn color="accent" variant="text" class="mt-4"> Buy NFT </v-btn>
        <v-btn color="accent" variant="text" class="mt-4"> Create NFT </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import filterMenu from "./filterMenu.vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "OwnedNFT",
  components: {
    filterMenu,
  },
  setup() {
    const { getMyNFTs } = useMarketStore();
    var menu = ref(false);
    var selectedView = ref("smallIcon");

    // computed
    const iconSize = computed(() =>
      selectedView.value == "largeIcon" ? 4 : 2
    );

    const ownedNFTs = ref([]);

    // onMounted(async () => {
    //   const res = await getMyNFTs();
    //   console.log(res);
    //   if (res) {
    //     ownedNFTs.value = await Promise.all(
    //       res.map(async (i) => {
    //         let nft = {
    //           seller: i.seller,
    //           owner: i.owner,
    //           price: i.price,
    //           tokenUri: i.tokenUri,
    //           name: i.tokenName,
    //           desc: i.tokenDescription,
    //           royalty: i.tokenRoyalty,
    //         };
    //         return nft;
    //       })
    //     );
    //   }
    // });

    return {
      menu,
      selectedView,
      ownedNFTs,

      // computed
      iconSize,
    };
  },
};
</script>
