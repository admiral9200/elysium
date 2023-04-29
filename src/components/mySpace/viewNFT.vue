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
    <div>
      <v-card-text>Collection:</v-card-text>
      <v-card-subtitle> {{ nft.collection }}</v-card-subtitle>
    </div>
    <v-card-text>{{ nft.price }} ETH</v-card-text>
    <v-card-text>{{ nft.royalty }} %</v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn class="me-2" variant="tonal" @click="$emit('onClose')">
        Close
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="sell(nft.collection, nft.id)"
      >
        Sell
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        @click="buy(nft.collection, nft.id, nft.royalty, nft.price)"
      >
        Buy
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
    const { linkCollection, listNFT, buyNFT } = useMarketStore();

    const price = ref(0.00001);
    const sell = async (nftCollection, nftId) => {
      try {
        const res = await listNFT(nftCollection, nftId, price.value.toString());
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    const buy = async (nftCollection, nftId, nftRoyalty, nftPrice) => {
      try {
        const res = await buyNFT(nftCollection, nftId, nftRoyalty, nftPrice);
        console.log(res);
        await linkCollection(sessionStorage.getItem("address"), nftCollection);
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
          for (const element of nfts.value) {
            if (
              element.collection === nftCollection &&
              element.tokenId === nftId
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
      buy,
      addCart,
    };
  },
};
</script>
