<template>
  <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
  <v-card theme="dark" class="ma-4 pa-4" variant="outlined">
    <v-card-title class="ms-2">Manage Platform</v-card-title>
    <v-card-text class="ms-2 py-6">
      <v-form @submit.prevent>
        <v-row>
          <v-col cols="2">
            <v-label class="mt-3">Platform Fee</v-label>
          </v-col>
          <v-col>
            <v-text-field
              class="mb-2"
              v-model="platformFee"
              variant="outlined"
              density="compact"
              suffix="ETH"
              type="number"
              :readonly="!isEditingPlatformFee"
            ></v-text-field>
          </v-col>
          <v-col cols="3" v-if="isOwner && !isEditingPlatformFee">
            <v-btn
              class="mt-1"
              color="accent"
              variant="outlined"
              @click="isEditingPlatformFee = true"
            >
              Edit
            </v-btn>
          </v-col>
          <v-col class="d-flex" cols="3" v-if="isEditingPlatformFee">
            <v-btn
              class="mt-1 me-2"
              color="white"
              variant="outlined"
              @click="cancelEditingPlatformFee()"
            >
              Cancel
            </v-btn>
            <v-btn class="mt-1" color="accent" @click="updateFee()">
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-form @submit.prevent>
        <v-row>
          <v-col cols="2">
            <v-label class="mt-3">Fee Recipient</v-label>
          </v-col>
          <v-col>
            <v-text-field
              class="mb-2"
              v-model="platformFeeRecipient"
              variant="outlined"
              density="compact"
              type="text"
              :readonly="!isEditingPlatformFeeRecipient"
            ></v-text-field>
          </v-col>
          <v-col cols="3" v-if="isOwner && !isEditingPlatformFeeRecipient">
            <v-btn
              class="mt-1"
              color="accent"
              variant="outlined"
              @click="isEditingPlatformFeeRecipient = true"
            >
              Edit
            </v-btn>
          </v-col>
          <v-col
            class="d-flex"
            cols="3"
            v-else-if="isEditingPlatformFeeRecipient"
          >
            <v-btn
              class="mt-1 me-2"
              color="white"
              variant="outlined"
              @click="cancelEditingPlatformFeeRecipient()"
            >
              Cancel
            </v-btn>
            <v-btn class="mt-1" color="accent" @click="changeRecipient()">
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted } from "vue";
import { useMarketStore } from "@/stores/market";

export default {
  setup() {
    const {
      getOwner,
      getPlatformFee,
      getPlatformFeeRecipient,
      updatePlatformFee,
      changeFeeRecipient,
    } = useMarketStore();
    const breadcrumbItems = [
      {
        title: "Dashboard",
        disabled: false,
        to: "/admin/dashboard",
      },
      {
        title: "Manage Platform",
        disabled: true,
        to: "/admin/platform",
      },
    ];
    const owner = ref("");
    const isOwner = ref(false);
    const defaultPlatformFee = ref(0);
    const defaultPlatformFeeRecipient = ref("");
    const platformFee = ref(0);
    const platformFeeRecipient = ref("");

    const isEditingPlatformFee = ref(false);
    const isEditingPlatformFeeRecipient = ref(false);

    const cancelEditingPlatformFee = () => {
      platformFee.value = defaultPlatformFee.value;
      isEditingPlatformFee.value = false;
    };

    const cancelEditingPlatformFeeRecipient = () => {
      platformFeeRecipient.value = defaultPlatformFeeRecipient.value;
      isEditingPlatformFeeRecipient.value = false;
    };

    const updateFee = async () => {
      await updatePlatformFee(platformFee.value);
      defaultPlatformFee.value = platformFee.value;
      isEditingPlatformFee.value = false;
    };

    const changeRecipient = async () => {
      await changeFeeRecipient(platformFeeRecipient.value);
      defaultPlatformFeeRecipient.value = platformFeeRecipient.value;
      isEditingPlatformFeeRecipient.value = false;
    };

    onMounted(async () => {
      owner.value = await getOwner();
      if (
        owner.value.toLowerCase() ===
        sessionStorage.getItem("address").toLowerCase()
      ) {
        isOwner.value = true;
      }
      defaultPlatformFee.value = await getPlatformFee();
      defaultPlatformFeeRecipient.value = await getPlatformFeeRecipient();
      platformFee.value = defaultPlatformFee.value;
      platformFeeRecipient.value = defaultPlatformFeeRecipient.value;
    });

    return {
      breadcrumbItems,
      platformFee,
      platformFeeRecipient,
      isEditingPlatformFee,
      isEditingPlatformFeeRecipient,
      isOwner,
      cancelEditingPlatformFee,
      cancelEditingPlatformFeeRecipient,
      updateFee,
      changeRecipient,
    };
  },
};
</script>
