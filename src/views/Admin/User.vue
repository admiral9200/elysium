<template>
  <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
  <v-card theme="dark" class="ma-4 pa-4" variant="outlined">
    <v-card-title>Welcome, this is manage user page</v-card-title>
  </v-card>
</template>

<script>
export default {
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

    return {
      breadcrumbItems,
    };
  },
};
</script>
