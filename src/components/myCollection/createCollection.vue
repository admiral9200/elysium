<template>
  <v-card class="pa-md-2" width="450px" theme="dark">
    <v-card-title class="text-white"> Create New Collection</v-card-title>
    <v-form @submit.prevent>
      <v-card-text>
        <v-text-field
          v-model="wallet"
          label="Wallet Address"
          variant="outlined"
          density="compact"
          readonly
        ></v-text-field>
        <v-text-field
          v-model="name"
          label="Name"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-text-field
          v-model="symbol"
          label="Symbol"
          variant="outlined"
          density="compact"
          required
        ></v-text-field>
        <v-text-field
          v-model="loyalty"
          label="Loyalty"
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
        <v-btn color="error" variant="tonal"> Reset </v-btn>
        <v-btn color="primary" variant="tonal" @click="submit"> Create </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { ref } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "CreateNFT",
  components: {},
  setup() {
    const { createNFTCollection } = useMarketStore();
    // data
    const valid = ref(false);
    const wallet = ref("0x2e8cf6a2a42C7F9c95136845fEf36798efA487d3");
    const name = ref("");
    const symbol = ref("");
    const loyalty = ref("");

    const submit = async () => {
      // if (valid) {
      try {
        const created = await createNFTCollection(
          name.value,
          symbol.value,
          loyalty.value,
          wallet.value
        );
        console.log(created);
      } catch (err) {
        console.log(err);
      }
      // }
    };

    return {
      valid,
      wallet,
      name,
      symbol,
      loyalty,
      submit,
    };
  },
};
</script>
