<template>
  <v-navigation-drawer class="me-0" theme="dark" expand-on-hover rail>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/admin/dashboard"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Manage Users"
        to="/admin/user"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cards"
        title="Manage Collections"
        to="/admin/collection"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cogs"
        title="Manage Platform"
        to="/admin/platform"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script></script>
