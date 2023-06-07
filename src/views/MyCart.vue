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
      <p>{{ cartItems.length }} Item<a v-if="cartItems.length > 1">s</a></p>
      <v-btn class="ms-auto" variant="text" color="red" @click="clearCart()">
        Clear All
      </v-btn>
    </v-card-actions>
    <v-divider></v-divider>
    <v-container class="overflow-y-auto" style="height: 72vh" fluid>
      <div v-if="cartItems.length > 0">
        <div v-for="item in cartItems" :key="item.tokenId">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="my-2"
              :variant="isHovering ? 'outlined' : 'flat'"
              :color="isHovering ? 'white' : 'default'"
            >
              <v-row v-bind="props">
                <v-col cols="4">
                  <v-img :src="item.tokenUri" aspect-ratio="1.5" height="85" />
                </v-col>
                <v-col cols="5">
                  <h3>{{ item.tokenName }}</h3>
                  <p>{{ item.collectionName }}</p>
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
                        @click="removeCartItem(cartItems.indexOf(item))"
                      ></v-btn>
                    </div>
                    <p v-if="!isHovering">{{ item.price }} ETH</p>
                  </v-slide-x-reverse-transition>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </div>
      </div>
      <div v-else class="text-center">
        <h3 class="mt-4">You haven't added any NFTs to cart yet</h3>
        <p class="mt-2">You can buy NFTs from the marketplace</p>
        <v-btn color="accent" variant="text" class="mt-4"> Buy NFT </v-btn>
      </div>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-space-between align-center">
      <h3>Total: {{ totalPrice }} ETH</h3>
      <v-btn color="primary" large variant="outlined">Checkout</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "MyCart",
  emits: ["onShowCart"],
  setup() {
    const cartItems = ref([]);
    const cartItemId = ref([]);
    const { getCartNFTs } = useMarketStore();
    const totalPrice = ref(0);

    const removeCartItem = async (tokenIndex) => {
      console.log("removeCartItem", tokenIndex);
      cartItems.value.splice(tokenIndex, 1);
      cartItemId.value.splice(tokenIndex, 1);
      console.log("cartItems", cartItemId.value);
      try {
        const res = await axios.put("/api/cart", {
          user_address: sessionStorage.getItem("address"),
          cart_content: cartItemId.value,
        });
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    const clearCart = async () => {
      try {
        const res = await axios.put("/api/cart", {
          user_address: sessionStorage.getItem("address"),
          cart_content: [],
        });
        cartItems.value = [];
        cartItemId.value = [];
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(async () => {
      try {
        const res = await axios.post("/api/cart/check", {
          user_address: sessionStorage.getItem("address"),
        });
        if (
          res.data === "Cart not found" ||
          res.data.cart_content.length === 0
        ) {
          cartItems.value = [];
        } else {
          cartItems.value = await getCartNFTs(res.data.cart_content);
          console.log("cartItem", cartItems.value);
        }
      } catch (error) {
        console.error(error);
      }
    });

    return {
      cartItems,
      totalPrice,
      removeCartItem,
      clearCart,
    };
  },
};
</script>
