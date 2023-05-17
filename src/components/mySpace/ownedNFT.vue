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
              <th scope="preview" class="text-left">Preview</th>
              <th scope="Name" class="text-left">Name</th>
              <th scope="Address" class="text-left">Address</th>
              <th scope="Price" class="text-left">Price</th>
              <th scope="Action" class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ownedNFTs" :key="item.id">
              <td><v-img height="80" :src="item.tokenUri"></v-img></td>
              <td>{{ item.tokenName }}</td>
              <td>{{ item.tokenDescription }}</td>
              <td>
                <v-btn
                  color="accent"
                  variant="tonal"
                  @click="selectNFT(ownedNFTs.indexOf(item))"
                  >View</v-btn
                >
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
      <v-col v-for="item in ownedNFTs" :key="item.id" :md="iconSize" cols="12">
        <v-card class="mx-auto py-2" max-width="344" variant="tonal">
          <v-img height="194" :src="item.tokenUri"></v-img>
          <v-card-title>{{ item.tokenName }}</v-card-title>
          <v-card-subtitle>{{ item.tokenDescription }}</v-card-subtitle>
          <v-card-actions class="d-flex justify-space-between mx-2">
            <v-btn
              width="100%"
              color="accent"
              variant="tonal"
              @click="selectNFT(ownedNFTs.indexOf(item))"
              >View</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else-if="!loading">
      <v-col cols="12" class="text-center">
        <h3 class="mt-4">There is no NFT here</h3>
        <p class="mt-2">
          You can buy NFTs from the marketplace or create your own NFTs
        </p>
        <v-btn color="accent" variant="text" class="mt-4" to="/">
          Buy NFT
        </v-btn>
        <v-btn color="accent" variant="text" class="mt-4" to="/create-nft">
          Create NFT
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-responsive class="mx-auto" height="200px">
          <v-overlay
            v-model="loading"
            class="align-center justify-center"
            contained
            persistent
          >
            <v-progress-circular
              color="primary"
              indeterminate
              size="60"
              width="8"
            ></v-progress-circular>
            <h3 class="mt-3">Loading NFTs</h3>
            <p class="mt-2">
              Trying to fetch the NFTs from the blockchain. This may take a
              while...
            </p>
          </v-overlay>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    v-model="showNFTDetail"
    location-strategy="connected"
    class="d-flex justify-center align-center"
  >
    <ViewNFT
      v-if="showNFTDetail"
      :nft="ownedNFTs[selectedNFT]"
      @onClose="() => (showNFTDetail = !showNFTDetail)"
    />
  </v-overlay>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMarketStore } from "@/stores/market";
import filterMenu from "@/components/mySpace/filterMenu.vue";
import ViewNFT from "@/components/mySpace/viewNFT.vue";

export default {
  tokenName: "OwnedNFT",
  props: ["userAddress"],
  components: {
    filterMenu,
    ViewNFT,
  },
  setup(props) {
    const { getOwnedNFTs } = useMarketStore();
    const menu = ref(false);
    const selectedView = ref("smallIcon");
    const showNFTDetail = ref(false);
    const loading = ref(true);

    // computed
    const iconSize = computed(() =>
      selectedView.value == "largeIcon" ? 4 : 2
    );

    const ownedNFTs = ref([]);
    const selectedNFT = ref();

    const selectNFT = (loc) => {
      showNFTDetail.value = !showNFTDetail.value;
      selectedNFT.value = loc;
    };

    onMounted(async () => {
      const res = await getOwnedNFTs(props.userAddress);
      loading.value = false;
      console.log("Owned", res);
      if (res) {
        ownedNFTs.value = res;
      }
    });

    return {
      menu,
      selectedView,
      ownedNFTs,
      showNFTDetail,
      loading,
      selectedNFT,
      //computed
      iconSize,
      //methods
      selectNFT,
    };
  },
};
</script>
