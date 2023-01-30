<template>
  <div class="font-weight-bold text-h4 mt-4">Top Collection</div>
  <v-row class="mt-5">
      <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="344" color="black">
              <v-img :src="feat1.img" height="200px"></v-img>
              <v-card-title class="text-h5">{{ feat1.title }}</v-card-title>
              <v-card-text>{{ feat1.text }}</v-card-text>
              <v-card-actions class="d-flex justify-space-between mx-2">
                  <v-btn variant="outlined">Floor: 0.10 ETH</v-btn>
                  <v-btn variant="outlined">Average: 0.08 ETH</v-btn>
              </v-card-actions>
          </v-card>
      </v-col>
      <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="344" color="black">
              <v-img :src="feat2.img" height="200px"></v-img>
              <v-card-title class="text-h5">{{ feat2.title }}</v-card-title>
              <v-card-text>{{ feat2.text }}</v-card-text>
              <v-card-actions class="d-flex justify-space-between mx-2">
                  <v-btn variant="outlined">Floor: 0.01 ETH</v-btn>
                  <v-btn variant="outlined">Average: 0.03 ETH</v-btn>
              </v-card-actions>
          </v-card>
      </v-col>
      <v-col cols="12" md="4">
          <v-card class="mx-auto" max-width="344" color="black">
              <v-img :src="feat3.img" height="200px"></v-img>
              <v-card-title class="text-h5">{{ feat3.title }}</v-card-title>
              <v-card-text>{{ feat3.text }}</v-card-text>
              <v-card-actions class="d-flex justify-space-between mx-2">
                  <v-btn variant="outlined">Floor: 0.02 ETH</v-btn>
                  <v-btn variant="outlined">Average: 0.05 ETH</v-btn>
              </v-card-actions>
          </v-card>
      </v-col>
  </v-row>
  </template>

  <script>
  export default {
      name: "TopCollection",
      setup() {
          const feat1 = {
              title: "Cookie Wizard",
              img: "https://picsum.photos/600/300?random=4",
              text: "Anim fugiat commodo anim excepteur dolore ullamco irure in deserunt reprehenderit nostrud.",
          };
          const feat2 = {
              title: "Spicy Chicken",
              img: "https://picsum.photos/600/300?random=5",
              text: "Anim fugiat commodo anim excepteur dolore ullamco irure in deserunt reprehenderit nostrud.",
          };
          const feat3 = {
              title: "Kelvin's Collection",
              img: "https://picsum.photos/600/300?random=6",
              text: "Anim fugiat commodo anim excepteur dolore ullamco irure in deserunt reprehenderit nostrud.",
          };

          return {
              feat1,
              feat2,
              feat3
          };
      },
  };
  </script>
