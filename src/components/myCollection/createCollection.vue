<template>
  <v-card class="pa-md-2" width="450px" theme="dark">
    <v-card-title class="text-white"> Create New Collection</v-card-title>
    <v-form @submit.prevent>
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
  </v-card>
</template>

<script>
import { ref, computed } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "createCollection",
  components: {},
  setup() {
    const { createNFTCollection } = useMarketStore();
    // data
    const wallet = sessionStorage.getItem("address");
    const name = ref("");
    const symbol = ref("");
    const royalty = ref("");

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
        rules.min(name.value) &&
        rules.min(symbol.value) &&
        rules.name(name.value) &&
        rules.symbol(symbol.value) &&
        rules.maxName(name.value) &&
        rules.maxSymbol(symbol.value) &&
        rules.maxRoyalty(royalty.value) &&
        rules.minRoyalty(royalty.value)
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
          console.log(created);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("Invalid", valid.value);
      }
    };

    return {
      wallet,
      name,
      symbol,
      royalty,
      rules,
      reset,
      submit,
    };
  },
};
</script>
