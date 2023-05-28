<template>
  <v-container>
    <v-row>
      <v-col md="8" cols="12">
        <v-card variant="outlined" theme="dark">
          <v-card-title class="text-white"> Create New NFT</v-card-title>
          <v-form @submit.prevent>
            <v-card-text>
              <v-text-field
                class="mb-2"
                v-model="wallet"
                label="Wallet Address"
                variant="outlined"
                density="compact"
                readonly
              ></v-text-field>
              <v-select
                class="my-4"
                v-model="selectedCollection"
                :rules="[rules.required]"
                :items="collections"
                label="Collection"
                variant="outlined"
                density="compact"
                required
              >
              </v-select>
              <v-file-input
                class="my-4"
                v-model="file"
                :rules="[rules.required, rules.fileType]"
                label="File"
                show-size
                variant="outlined"
                density="compact"
                required
              ></v-file-input>
              <v-text-field
                class="my-4"
                v-model="name"
                :rules="[rules.required, rules.min, rules.maxName, rules.name]"
                label="Name"
                variant="outlined"
                density="compact"
                required
              ></v-text-field>
              <v-textarea
                class="my-4"
                v-model="description"
                :rules="[rules.required, rules.min, rules.maxDescription]"
                label="Description"
                variant="outlined"
                rows="3"
                density="compact"
                required
              ></v-textarea>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <v-label>List it for Sale on Elysium?</v-label>
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
                class="my-4"
                v-model="price"
                :rules="[rules.required, rules.minPrice]"
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
                    disabled
                  ></v-switch>
                </div>
              </div>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
      <v-col md="4" cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-white">Preview</v-card-title>
          <v-img :src="previewImg" contain max-height="200"></v-img>
          <v-card-text> Collection: {{ collectionName }} </v-card-text>
          <v-card-text> Name: {{ name }} </v-card-text>
          <v-card-text> Description: {{ description }} </v-card-text>
          <v-card-text> For Sale: {{ onSale }} </v-card-text>
          <v-card-text v-if="onSale === 'Yes'">
            Price: {{ price }} ETH
          </v-card-text>
          <v-card-text> Free Minting: {{ freeMint }} </v-card-text>
        </v-card>
        <v-btn
          class="my-3 bg-primary text-white"
          variant="tonal"
          block="true"
          @click="submit"
        >
          Mint
        </v-btn>
        <v-btn variant="tonal" block="true" @click="reset"> Reset </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  name: "CreateNFT",
  components: {},
  setup() {
    const {
      uploadFileToIPFS,
      uploadJSONToIPFS,
      getMyCollection,
      getCollectionDetails,
      mintNFT,
      listNFT,
    } = useMarketStore();
    // data
    const wallet = sessionStorage.getItem("address");
    const collections = ref("");
    const collectionDetails = ref([]);
    const selectedCollection = ref("");
    const name = ref("");
    const description = ref("");
    const onSale = ref("No");
    const price = ref();
    const freeMint = ref("No");
    const file = ref("");

    const rules = {
      required: (value) => !!value || "This field is required.",
      min: (v) => v.length >= 3 || "Min 3 characters",
      maxName: (v) => v.length <= 25 || "Max 25 characters",
      maxDescription: (v) => v.length <= 250 || "Max 250 characters",
      name: (v) => {
        const pattern = /^[^\s]+[a-zA-Z0-9_ ]+[^\s]$/;
        return pattern.test(v) || "Invalid name.";
      },
      fileType: (v) => {
        const pattern = /image/;
        return pattern.test(v[0].type) || "Image only. (jpg, jpeg, png)";
      },
      minPrice: (v) => v >= 0.001 || "Min 0.001 ETH",
    };

    const valid = computed(() => {
      if (onSale.value === "Yes") {
        return (
          name.value.length >= 3 &&
          name.value.length <= 25 &&
          description.value.length <= 250 &&
          rules.name(name.value) &&
          rules.fileType(file.value) &&
          price.value >= 0.001
        );
      } else {
        return (
          name.value.length >= 3 &&
          name.value.length <= 25 &&
          description.value.length <= 250 &&
          rules.name(name.value) &&
          rules.fileType(file.value)
        );
      }
    });

    const previewImg = computed(() => {
      if (file.value) {
        return URL.createObjectURL(file.value[0]);
      }
      return "";
    });

    const collectionName = computed(() => {
      if (selectedCollection.value) {
        for (const item of collectionDetails.value) {
          if (item.address === selectedCollection.value) {
            return item.name;
          }
        }
      } else return "";
    });

    const submit = async () => {
      if (valid.value === true) {
        console.log("submit");
        const fileData = await uploadFileToIPFS(file.value[0]);
        console.log("fileData.IpfsHash", fileData.IpfsHash);
        const json = {
          name: name.value,
          description: description.value,
          image: fileData.IpfsHash,
        };
        const jsonFile = await uploadJSONToIPFS(json);
        console.log("file", jsonFile.IpfsHash);
        const tokenId = await mintNFT(
          sessionStorage.getItem("address"),
          selectedCollection.value,
          jsonFile.IpfsHash
        );
        // const tokenId = await mintNFT(
        //   sessionStorage.getItem("address"),
        //   selectedCollection.value,
        //   "QmRaWcj4SsKuYyaemp7upnjHxk44AtC13JBvzwGH3YbJzc"
        // );

        console.log("mint", tokenId);

        if (onSale.value === "Yes") {
          try {
            const res = await listNFT(
              collectionAddress[0],
              tokenId,
              price.value.toString()
            );
            console.log("listed on sale", res);
          } catch (err) {
            console.log(err);
          }
        }
        reset();
      } else {
        console.log("Invalid", valid.value);
      }
    };

    const reset = () => {
      name.value = "";
      description.value = "";
      onSale.value = "No";
      price.value = "";
      freeMint.value = "No";
      file.value = "";
    };

    onMounted(async () => {
      //TODO: redirect to create collection if no collection
      const res = await getMyCollection();
      collections.value = res;
      selectedCollection.value = res[0];
      for (let i = 0; i < res.length; i++) {
        let collectionItem = await getCollectionDetails(res[i]);
        collectionDetails.value.push(collectionItem);
      }
      console.log("collectionDetails", collectionDetails.value);
    });

    return {
      wallet,
      collections,
      selectedCollection,
      collectionName,
      name,
      description,
      onSale,
      price,
      freeMint,
      file,
      previewImg,
      rules,
      submit,
      reset,
    };
  },
};
</script>
