<template>
  <v-card class="mt-md-2 me-md-2 pa-md-2" width="450px" theme="dark">
    <v-alert
      v-if="alert.show"
      class="my-3 mx-6"
      theme="dark"
      :color="alert.color"
      :icon="alert.icon"
      :title="alert.title"
      :text="alert.text"
      variant="tonal"
      density="compact"
    ></v-alert>
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
      <p v-if="cartItems.length > 0">
        {{ cartItems.length }} Item<a v-if="cartItems.length > 1">s</a>
      </p>
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
      <v-btn color="primary" large variant="outlined" @click="checkout()">
        Checkout
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "MyCart",
  emits: ["onShowCart"],
  setup() {
    const cartItems = ref([]);
    const { getCartNFTs, checkoutNFTs } = useMarketStore();
    const alert = ref({
      show: false,
      color: "",
      icon: "",
      title: "",
      text: "",
    });

    const totalPrice = computed(() => {
      let price = 0;
      if (cartItems.value.length > 0) {
        for (const item of cartItems.value) {
          price += parseFloat(item.price);
        }
      }
      return price.toString();
    });

    const setAlert = (status, msg) => {
      if (status === "error") {
        alert.value = {
          show: true,
          color: "error",
          icon: "$error",
          title: "Oops...",
          text: msg,
        };
      } else if (status === "success") {
        alert.value = {
          show: true,
          color: "success",
          icon: "$success",
          title: "Success",
          text: msg,
        };
      }
    };

    const removeCartItem = async (tokenIndex) => {
      cartItems.value.splice(tokenIndex, 1);
      if (cartItems.value.length === 0) {
        await clearCart();
        return 0;
      }
      let newCartContents = [];
      for (const item of cartItems.value) {
        let cartContent = {
          collection: item.collectionAddress,
          tokenId: item.tokenId,
        };
        newCartContents.push(cartContent);
      }
      try {
        await axios.put("/api/cart", {
          user_address: sessionStorage.getItem("address"),
          cart_content: newCartContents,
        });
        setAlert("success", "Item removed from cart");
      } catch (err) {
        setAlert("error", "Oops... Something went wrong");
        console.log(err);
      }
    };

    const clearCart = async () => {
      try {
        await axios.post("/api/cart/clear", {
          user_address: sessionStorage.getItem("address"),
        });
        cartItems.value = [];
        setAlert("success", "Cart cleared");
      } catch (err) {
        setAlert("error", "Oops... Something went wrong");
        console.log(err);
      }
    };

    const checkout = async () => {
      try {
        await checkoutNFTs(cartItems.value, totalPrice.value);
        await clearCart();
        cartItems.value = [];
        setAlert("success", "Checkout successful");
      } catch (err) {
        setAlert("error", "Oops... Something went wrong");
        console.log(err);
      }
    };

    onMounted(async () => {
      try {
        const res = await axios.post("/api/cart", {
          user_address: sessionStorage.getItem("address"),
        });
        if (res.data.length === 0) {
          cartItems.value = [];
        } else {
          cartItems.value = await getCartNFTs(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    });

    return {
      alert,
      cartItems,
      totalPrice,
      removeCartItem,
      clearCart,
      checkout,
    };
  },
};
</script>
