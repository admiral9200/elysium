<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-end" cols="12">
        <v-btn-toggle v-model="selectedView" style="width: 80px" mandatory>
          <v-btn
            icon="mdi-format-list-bulleted-square"
            size="40"
            value="listView"
          >
          </v-btn>
          <v-btn icon="mdi-chart-areaspline" size="40" value="chart"></v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="selectedView == 'listView' && -1 > 0">
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
            <tr v-for="item in ownedNFTs" :key="item.address">
              <td><v-img height="80" :src="item.image"></v-img></td>
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td>{{ item.price }} ETH</td>
              <td>
                <v-btn color="accent" variant="tonal">View</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row class="my-auto" v-else-if="selectedView == 'chart' && -1 > 0">
      <v-col
        v-for="item in ownedNFTs"
        :key="item.address"
        :md="iconSize"
        cols="12"
      >
        <v-card class="mx-auto py-2" max-width="344" variant="tonal">
          <v-img height="194" :src="item.image"></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.address }}</v-card-subtitle>
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
        <h3 class="mt-4">No activity yet...</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Activity",
  setup() {
    var menu = ref(false);
    var selectedView = ref("chart");

    return {
      menu,
      selectedView,
    };
  },
};
</script>
