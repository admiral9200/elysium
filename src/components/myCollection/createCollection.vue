<template>
  <v-card class="pa-md-2" width="450px" theme="dark">
    <v-card-title class="text-white d-flex justify-space-between align-center">
      Create New Collection
      <v-btn
        class="my-0"
        icon="mdi-close"
        size="small"
        variant="plain"
        @click="$emit('onShowForm', false)"
      >
      </v-btn>
    </v-card-title>
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
    <v-form @submit.prevent v-if="alert.title != 'Success'">
      <v-card-text>
        <v-text-field
          class="mb-2"
          v-model="wallet"
          :rules="[rules.required]"
          label="Wallet Address"
          variant="outlined"
          density="compact"
          readonly
        ></v-text-field>
        <v-text-field
          class="my-4"
          v-model="name"
          :rules="[rules.required, rules.min, rules.maxName, rules.name]"
          label="Name"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-text-field
          class="my-4"
          v-model="symbol"
          :rules="[rules.required, rules.min, rules.maxSymbol, rules.symbol]"
          label="Symbol"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-text-field
          class="mt-2"
          v-model="royalty"
          :rules="[rules.required, rules.minRoyalty, rules.maxRoyalty]"
          label="Royalty"
          variant="outlined"
          density="compact"
          suffix="%"
          type="number"
          min="0"
          max="50"
          dirty
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="error" variant="tonal" @click="reset"> Reset </v-btn>
        <v-btn color="primary" variant="tonal" @click="submit"> Create </v-btn>
      </v-card-actions>
    </v-form>
    <v-card-actions
      class="d-flex justify-center align-center"
      v-if="alert.title == 'Success'"
    >
      <v-btn
        color="primary"
        large
        variant="outlined"
        @click="$emit('onShowForm', false)"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "createCollection",
  emits: ["onShowForm"],
  setup() {
    const { createNFTCollection } = useMarketStore();
    // data
    const wallet = sessionStorage.getItem("address");
    const name = ref("");
    const symbol = ref("");
    const royalty = ref("");

    const alert = ref({
      show: false,
      color: "",
      icon: "",
      title: "",
      text: "",
    });

    const rules = {
      required: (v) => !!v || "This field is required.",
      min: (v) => v.length >= 3 || "Min 3 characters",
      name: (v) => {
        const pattern = /^[^\s]+[a-zA-Z0-9_ ]+[^\s]$/;
        return pattern.test(v) || "Invalid name.";
      },
      maxName: (v) => v.length <= 25 || "Max 25 characters",
      symbol: (v) => {
        const pattern = /^[a-zA-Z]+$/;
        return pattern.test(v) || "Invalid symbol.";
      },
      maxSymbol: (v) => v.length <= 5 || "Max 5 characters",
      minRoyalty: (v) => v >= 0 || "Royalty cannot be negative",
      maxRoyalty: (v) => v <= 50 || "Royalty cannot exceed 50%",
    };

    const valid = computed(() => {
      return (
        name.value.length > 0 &&
        symbol.value.length > 0 &&
        royalty.value.length > 0 &&
        rules.min(name.value) === true &&
        rules.min(symbol.value) === true &&
        rules.name(name.value) === true &&
        rules.symbol(symbol.value) === true &&
        rules.maxName(name.value) === true &&
        rules.maxSymbol(symbol.value) === true &&
        rules.maxRoyalty(royalty.value) === true &&
        rules.minRoyalty(royalty.value) === true
      );
    });

    const reset = () => {
      name.value = "";
      symbol.value = "";
      royalty.value = "";
    };

    const submit = async () => {
      if (valid.value === true) {
        try {
          const created = await createNFTCollection(
            name.value,
            symbol.value,
            royalty.value,
            wallet
          );
          alert.value = {
            show: true,
            color: "success",
            icon: "$success",
            title: "Success",
            text: "NFT created successfully!",
          };
          console.log(created);
        } catch (err) {
          alert.value = {
            show: true,
            color: "error",
            icon: "$error",
            title: "Oops...",
            text: "We are facing some issues please try again later...",
          };
          console.log(err);
        }
      } else {
        alert.value = {
          show: true,
          color: "error",
          icon: "$error",
          title: "Oops...",
          text: "Please check your input and try again",
        };
        console.log("Invalid", valid.value);
      }
    };

    return {
      wallet,
      name,
      symbol,
      royalty,
      alert,
      rules,
      reset,
      submit,
    };
  },
};
</script>
