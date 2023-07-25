<template>
  <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
  <v-card theme="dark" class="ma-4 pa-4" variant="outlined">
    <v-card-title class="ms-2">Manage User</v-card-title>
    <v-card-text>
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="users.length"
        :items="users"
        :loading="loading"
        item-value="address"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="me-2"
            color="accent"
            variant="outlined"
            size="small"
            :to="'/user/' + item.value"
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
import { VDataTable } from "vuetify/labs/VDataTable";
export default {
  components: {
    VDataTable,
  },
  setup() {
    const breadcrumbItems = [
      {
        title: "Dashboard",
        disabled: false,
        to: "/admin/dashboard",
      },
      {
        title: "Manage User",
        disabled: true,
        to: "/admin/user",
      },
    ];
    const itemsPerPage = ref(5);
    const loading = ref(true);
    const headers = [
      { title: "Name", align: "start", key: "username" },
      { title: "Address", align: "start", key: "address" },
      { title: "Actions", key: "actions", sortable: false },
    ];

    const users = ref([]);

    onMounted(async () => {
      try {
        const res = await axios.get("/api/user/");
        if (res) {
          users.value = await Promise.all(
            res.data.map(async (i) => {
              let user = {
                username: i.username,
                address: i.address,
              };
              return user;
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
      users,
    };
  },
};
</script>
