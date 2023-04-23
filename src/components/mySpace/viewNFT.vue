<template>
  <v-card theme="dark" width="350px" class="pa-4">
    <v-img height="194" :src="nft.tokenUri"></v-img>
    <v-card-title>{{ nft.name }}</v-card-title>
    <v-card-subtitle>{{ nft.desc }}</v-card-subtitle>
    <div v-if="nft.price > 0">
      <v-card-text>Seller:</v-card-text>
      <v-card-subtitle> {{ nft.seller }}</v-card-subtitle>
    </div>
    <div v-else>
      <v-card-text>Owner:</v-card-text>
      <v-card-subtitle> {{ nft.owner }}</v-card-subtitle>
    </div>
    <v-card-text>{{ nft.price }} ETH</v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn class="me-2" variant="tonal" @click="$emit('onClose')">
        Close
      </v-btn>
      <v-btn color="primary" variant="outlined" @click="sell(nft.id)">
        Sell
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="addCart(nft.collection, nft.id)"
      >
        Add Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "View NFT",
  props: ["nft"],
  emits: ["onClose"],
  setup() {
    const { getMyCollection, listNFT } = useMarketStore();

    const price = ref(1);
    const sell = async (nftId) => {
      try {
        const collectionAddress = await getMyCollection();
        const res = await listNFT(
          collectionAddress[0],
          nftId,
          price.value.toString()
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    let nfts = ref([]);
    const addCart = async (nftCollection, nftId) => {
      try {
        const res = await axios.post("/api/cart/check", {
          user_address: sessionStorage.getItem("address"),
        });
        console.log(res);
        if (res.data === "Cart not found") {
          nfts.value.push({ collection: nftCollection, tokenId: nftId });
          try {
            const res = await axios.post("/api/cart", {
              user_address: sessionStorage.getItem("address"),
              cart_content: nfts.value,
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          nfts.value = res.data.cart_content;
          let exist = false;
          for (let i = 0; i < nfts.value.length; i++) {
            if (
              nfts.value[i].collection === nftCollection &&
              nfts.value[i].tokenId === nftId
            ) {
              exist = true;
              console.log("NFT already in cart");
              break;
            }
          }
          if (!exist) {
            nfts.value.push({ collection: nftCollection, tokenId: nftId });
            try {
              const res = await axios.put("/api/cart", {
                user_address: sessionStorage.getItem("address"),
                cart_content: nfts.value,
              });
              console.log(res);
            } catch (err) {
              console.log(err);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    return {
      sell,
      addCart,
    };
  },
};
</script>
