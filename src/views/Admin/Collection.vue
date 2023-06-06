<template>
  <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
  <v-card theme="dark" class="ma-4 pa-4" variant="outlined">
    <v-card-title>Welcome, this is manage collection page</v-card-title>
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
        title: "Manage Collections",
        disabled: true,
        to: "/admin/collection",
      },
    ];

    return {
      breadcrumbItems,
    };
  },
};
</script>
