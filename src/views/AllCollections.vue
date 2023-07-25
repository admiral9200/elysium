<template>
  <div class="font-weight-bold text-h4 ms-4 mt-4">All Collections</div>
  <v-card theme="dark" class="ma-4 pa-4" variant="outlined">
    <v-card-text>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="collections.length"
        :items="collections"
        :loading="loading"
        item-value="address"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="me-2"
            color="primary"
            variant="outlined"
            size="small"
            :to="'/collection/' + item.value"
          >
            View
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";
import { VDataTable } from "vuetify/labs/VDataTable";

export default {
  components: {
    VDataTable,
  },
  setup() {
    const { getCollectionDetails } = useMarketStore();
    const breadcrumbItems = [
      {
        title: "Dashboard",
        disabled: false,
        to: "/admin/dashboard",
      },
      {
        title: "Manage Collections",
        disabled: true,
        to: "/admin/collection",
      },
    ];

    const itemsPerPage = ref(5);
    const loading = ref(true);
    const headers = [
      { title: "Name", align: "start", key: "name" },
      { title: "Address", align: "start", key: "address" },
      { title: "Royalty (%)", align: "start", key: "royalty" },
      { title: "Royalty Recipient", align: "start", key: "royaltyRecipient" },
      { title: "Follower", align: "start", key: "follower" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    const collections = ref([]);

    onMounted(async () => {
      try {
        loading.value = true;
        const res = await axios.get("/api/collection/list");
        if (res) {
          collections.value = await Promise.all(
            res.data.map(async (i) => {
              const collectionDetails = await getCollectionDetails(i[0]);

              let collection = {
                name: collectionDetails.name,
                address: collectionDetails.address,
                royalty: collectionDetails.royalty,
                royaltyRecipient: collectionDetails.royaltyRecipient,
                follower: i[1],
              };
              return collection;
            })
          );
        }
        loading.value = false;
      } catch (error) {
        console.error(error);
      }
    });

    return {
      breadcrumbItems,
      itemsPerPage,
      loading,
      headers,
      collections,
    };
  },
};
</script>
