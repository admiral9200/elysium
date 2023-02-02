<template>
  <v-card class="mt-md-2 me-md-2 pa-md-2" width="450px" theme="dark">
    <v-card-title class="d-flex justify-space-between align-center">
      <h2>My Cart</h2>
      <v-btn
        class="me-2"
        large
        icon="mdi-close"
        :active="false"
        @click="$emit('onShowCart')"
      ></v-btn>
    </v-card-title>
    <v-card-actions>
      <p>{{ ownedNFTs.length }} Item<a v-if="ownedNFTs.length > 1">s</a></p>
      <v-btn class="ms-auto" text> Clear All </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <v-container class="overflow-y-auto" style="height: 72vh" fluid>
      <div v-for="nft in ownedNFTs" :key="nft.name">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            class="my-2"
            :variant="isHovering ? 'outlined' : 'flat'"
            :color="isHovering ? 'white' : 'default'"
          >
            <v-row v-bind="props">
              <v-col cols="4">
                <v-img :src="nft.image" aspect-ratio="1.5" />
              </v-col>
              <v-col cols="5">
                <h3>{{ nft.name }}</h3>
                <p>{{ nft.collection }}</p>
              </v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-slide-x-reverse-transition leave-absolute>
                  <div v-if="isHovering">
                    <v-btn
                      class="mx-auto"
                      color="red"
                      small
                      icon="mdi-delete"
                      variant="text"
                    ></v-btn>
                  </div>
                  <p v-if="!isHovering">{{ nft.price }} ETH</p>
                </v-slide-x-reverse-transition>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </div>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-space-between align-center">
      <h3>Total: 0.6 ETH</h3>
      <v-btn color="primary" large variant="outlined">Checkout</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "MyCart",
  emits: ["onShowCart"],
  setup() {
    const ownedNFTs = [
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=12",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=10",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=120",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=130",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=124",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=112",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=122",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=42",
      },
      {
        name: "NFT",
        collection: "NFT Collection",
        price: 0.1,
        image: "https://picsum.photos/500/300?image=12",
      },
    ];

    return {
      ownedNFTs,
    };
  },
};
</script>
