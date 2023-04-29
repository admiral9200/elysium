<template>
  <v-container>
    <v-card class="my-4" variant="outlined" theme="dark">
      <v-card-title>Linked Collection</v-card-title>
      <v-card-text v-if="linkedCollection.length > 0">
        <v-table fixed-header height="300px" theme="dark">
          <thead>
            <tr>
              <th scope="lcAddress" class="text-left">Collection Address</th>
              <th scope="action" class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in linkedCollection" :key="item">
              <td>{{ item }}</td>
              <td>
                <v-btn
                  color="red"
                  variant="tonal"
                  @click="unlink(linkedCollection.indexOf(item))"
                  >Unlink</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-text v-else>
        <h3 class="mt-4">You don't have any linked collection yet</h3>
        <p class="mt-2">
          You can can add collection to the marketplace or create your own
          collection
        </p>
      </v-card-text>
      <v-card-actions>
        <v-text-field
          v-model="collectionAddress"
          label="Link Collection Address Manually"
          placeholder="eg. 0xd0E9D7b417ef22a23D0df40aDb09860269226E53"
          variant="outlined"
          density="compact"
          append-inner-icon="mdi-plus"
          @click:append-inner="link(collectionAddress)"
        ></v-text-field>
      </v-card-actions>
    </v-card>

    <v-card variant="outlined" theme="dark">
      <v-card-title>Created Collection</v-card-title>
      <v-card-text v-if="createdCollection.length > 0">
        <v-table fixed-header height="300px" theme="dark">
          <thead>
            <tr>
              <th scope="cAddress" class="text-left">Collection Address</th>
              <th scope="action" class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in createdCollection" :key="item">
              <td>{{ item }}</td>
              <td>
                <v-btn color="accent" variant="tonal" @click="link(item)"
                  >Link</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-text v-else>
        <h3 class="mt-4">You don't have any linked collection yet</h3>
        <p class="mt-2">
          You can can add collection to the marketplace or create your own
          collection
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="() => (showForm = !showForm)">
          Create New Collection
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-overlay
    v-model="showForm"
    location-strategy="connected"
    class="d-flex justify-center align-center"
  >
    <create-collection
      v-if="showForm"
      @onShowForm="() => (showForm = !showForm)"
    />
  </v-overlay>
</template>

<script>
import { ref, onMounted } from "vue";
import { useMarketStore } from "@/stores/market";
import { useRoute } from "vue-router";
import createCollection from "@/components/myCollection/createCollection.vue";

export default {
  name: "CreateNFT",
  components: { createCollection },
  setup() {
    const {
      linkCollection,
      getLinkedCollection,
      unlinkCollection,
      getMyCollection,
    } = useMarketStore();
    const route = useRoute();
    const showForm = ref(false);
    const linkedCollection = ref([]);
    const createdCollection = ref([]);
    const collectionAddress = ref("");

    const link = async (address) => {
      await linkCollection(route.params.address, address);
      linkedCollection.value = await getLinkedCollection(route.params.address);
    };

    const unlink = async (tokenIndex) => {
      await unlinkCollection(route.params.address, tokenIndex);
      linkedCollection.value = await getLinkedCollection(route.params.address);
    };

    onMounted(async () => {
      try {
        const res = await getLinkedCollection(route.params.address);
        if (res != "404") {
          linkedCollection.value = res;
          console.log("linked", linkedCollection.value);
        }
      } catch (err) {
        console.log(err);
      }

      try {
        createdCollection.value = await getMyCollection();
        console.log(createdCollection.value);
      } catch (err) {
        console.log(err);
      }
    });

    return {
      showForm,
      linkedCollection,
      createdCollection,
      collectionAddress,
      link,
      unlink,
    };
  },
};
</script>
