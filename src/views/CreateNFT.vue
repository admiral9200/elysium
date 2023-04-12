<template>
  <v-container>
    <v-row>
      <v-col md="8" cols="12">
        <v-card variant="outlined" theme="dark">
          <v-card-title class="text-white"> Create New NFT</v-card-title>
          <v-form @submit.prevent>
            <v-card-text>
              <v-text-field
                v-model="wallet"
                model-value="0x2e8cf6a2a42C7F9c95136845fEf36798efA487d3"
                label="Wallet Address"
                variant="outlined"
                density="compact"
                readonly
              ></v-text-field>
              <v-file-input
                v-model="file"
                label="File"
                show-size
                variant="outlined"
                density="compact"
                required
              ></v-file-input>
              <v-text-field
                v-model="name"
                label="Name"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>
              <v-textarea
                v-model="description"
                label="Description"
                variant="outlined"
                rows="3"
                density="compact"
                required
              ></v-textarea>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <v-label>Put on Sale</v-label>
                </div>
                <div>
                  <v-switch
                    v-model="onSale"
                    true-value="Yes"
                    false-value="No"
                    color="white"
                    density="compact"
                  ></v-switch>
                </div>
              </div>
              <v-text-field
                v-model="price"
                label="Price"
                variant="outlined"
                density="compact"
                suffix="ETH"
                type="number"
                min="0.001"
                dirty
                required
                v-if="onSale === 'Yes'"
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
              <div class="d-flex justify-space-between align-center">
                <div>
                  <v-label>Free Minting</v-label>
                </div>
                <div>
                  <v-switch
                    v-model="freeMint"
                    true-value="Yes"
                    false-value="No"
                    color="white"
                    density="compact"
                  ></v-switch>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="error" variant="tonal" @click="reset">
                Reset
              </v-btn>
              <v-btn color="primary" variant="tonal" @click="submit">
                Create
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col md="4" cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-white">Preview</v-card-title>
          <v-img :src="previewImg" contain max-height="200"></v-img>
          <v-card-text> Name: {{ name }} </v-card-text>
          <v-card-text> Description: {{ description }} </v-card-text>
          <v-card-text> For Sale: {{ onSale }} </v-card-text>
          <v-card-text v-if="onSale === 'Yes'">
            Price: {{ price }} ETH
          </v-card-text>
          <v-card-text> Loyalty: {{ loyalty }} % </v-card-text>
          <v-card-text> Free Minting: {{ freeMint }} </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "CreateNFT",
  components: {},
  setup() {
    const { uploadFileToIPFS, uploadJSONToIPFS, mintNFT } = useMarketStore();
    // data
    const valid = ref(false);
    const name = ref("");
    const description = ref("");
    const onSale = ref("No");
    const price = ref("");
    const loyalty = ref("");
    const freeMint = ref("No");
    const file = ref("");
    const previewImg = computed(() => {
      if (file.value) {
        return URL.createObjectURL(file.value[0]);
      }
      return "";
    });

    const submit = async () => {
      // if (valid.value) {
      const fileData = await uploadFileToIPFS(file.value[0]);
      console.log(fileData.IpfsHash);
      const json = {
        name: name.value,
        description: description.value,
        image: fileData.IpfsHash,
        loyalty: loyalty.value,
      };
      const jsonFile = await uploadJSONToIPFS(json);
      console.log(jsonFile.IpfsHash);
      const mint = await mintNFT(jsonFile.IpfsHash, price.value.toString());

      // const mint = await mintNFT(
      //   "QmRaWcj4SsKuYyaemp7upnjHxk44AtC13JBvzwGH3YbJzc",
      //   "1"
      // );

      console.log(mint);
      //   console.log("submit");
      // }
    };

    return {
      valid,
      name,
      description,
      onSale,
      price,
      loyalty,
      freeMint,
      file,
      previewImg,
      submit,
    };
  },
};
</script>
