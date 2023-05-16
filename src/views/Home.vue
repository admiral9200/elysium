<template>
  <v-container>
    <Landing />
    <TopCollection />
    <TopUser />
    <Trending />
  </v-container>
</template>

<script setup>
import Landing from "@/components/home/Landing.vue";
import TopCollection from "@/components/home/TopCollection.vue";
import TopUser from "@/components/home/TopUser.vue";
import Trending from "@/components/home/Trending.vue";
</script>
