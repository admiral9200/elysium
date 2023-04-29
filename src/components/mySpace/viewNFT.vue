<template>
  <v-card theme="dark" width="350px" class="pa-4">
    <v-img height="194" :src="nft.tokenUri"></v-img>
    <v-card-title>{{ nft.name }}</v-card-title>
    <v-card-subtitle>{{ nft.desc }}</v-card-subtitle>
    <div v-if="nft.price">
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
    <v-card-text v-if="nft.price">{{ nft.price }} ETH</v-card-text>
    <v-card-text>Royalty: {{ nft.royalty }} %</v-card-text>
    <v-card-actions v-if="showForm">
      <v-text-field
        v-model="price"
        label="Price"
        variant="outlined"
        density="compact"
        suffix="ETH"
        type="number"
      ></v-text-field>
    </v-card-actions>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        v-if="!showForm"
        class="me-2"
        variant="tonal"
        @click="$emit('onClose')"
      >
        Close
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        v-if="isOwner && !nft.price && !showForm"
        @click="showForm = true"
      >
        Sell
      </v-btn>
      <v-btn
        color="red"
        variant="outlined"
        v-if="isSeller && nft.price"
        @click="unList(nft.collection, nft.tokenId)"
      >
        Cancel Sell
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        v-if="!isSeller && nft.price"
        @click="buy(nft.collection, nft.tokenId, nft.royalty, nft.price)"
      >
        Buy
      </v-btn>
      <v-btn
        color="primary"
        variant="outlined"
        v-if="!isSeller && nft.price"
        @click="addCart(nft.collection, nft.tokenId)"
      >
        Add Cart
      </v-btn>
      <v-btn v-if="showForm" @click="showForm = false">Cancel</v-btn>
      <v-btn
        v-if="showForm"
        color="primary"
        variant="tonal"
        @click="sell(nft.collection, nft.tokenId)"
      >
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, computed } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "View NFT",
  props: ["nft"],
  emits: ["onClose"],
  setup(props) {
    const { linkCollection, listNFT, unListNFT, buyNFT } = useMarketStore();
    const price = ref();
    const showForm = ref(false);

    const isOwner = computed(() => {
      const nftOwner = props.nft.owner;
      if (nftOwner)
        return sessionStorage.getItem("address") === nftOwner.toLowerCase();
      else return false;
    });

    const isSeller = computed(() => {
      const nftSeller = props.nft.seller;
      if (nftSeller)
        return sessionStorage.getItem("address") === nftSeller.toLowerCase();
      else return false;
    });

    const sell = async (nftCollection, nftId) => {
      try {
        const res = await listNFT(nftCollection, nftId, price.value.toString());
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    const unList = async (nftCollection, nftId) => {
      try {
        const res = await unListNFT(nftCollection, nftId);
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
      isOwner,
      isSeller,
      showForm,
      price,
      sell,
      unList,
      buy,
      addCart,
    };
  },
};
</script>
