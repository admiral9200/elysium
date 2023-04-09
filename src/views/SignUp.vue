<template>
  <v-card class="mt-md-2 me-md-2 pa-md-2" width="450px" theme="dark">
    <v-card-title class="d-flex justify-space-between align-center">
      <h2>Sign Up Now</h2>
    </v-card-title>
    <v-divider></v-divider>
    <v-form @submit.prevent>
      <v-container class="overflow-y-auto" style="height: 72vh" fluid>
        <v-card-text>
          <v-text-field
            v-model="username"
            label="Username"
            placeholder="john_doe"
            prefix="@"
            variant="outlined"
            required
          ></v-text-field>
          <v-textarea
            v-model="desc"
            label="Bio"
            placeholder="Too awesome for bio..."
            rows="3"
            variant="outlined"
          ></v-textarea>
          <v-text-field
            v-model="email"
            label="Email"
            placeholder="eg. example@email.com"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
      </v-container>
      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-center align-center">
        <v-btn
          color="secondary"
          large
          variant="outlined"
          @click="$emit('onSignUp', false)"
          >Skip</v-btn
        >
        <v-btn
          color="primary"
          large
          variant="outlined"
          type="submit"
          @click="submit"
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import { ref, computed } from "vue";
import axios from "axios";
import { useMarketStore } from "@/stores/market";

export default {
  name: "SignUp",
  emits: ["onSignUp"],
  setup(props, { emit }) {
    const store = useMarketStore();
    const username = ref("");
    const desc = ref("");
    const email = ref("");

    const submit = async () => {
      const data = {
        username: username.value,
        address: store.account,
        email: email.value,
        profile_url: "https://source.boringavatars.com/pixel/250",
        background_url: "https://source.boringavatars.com/pixel/250",
        description: desc.value,
      };
      const res = await axios.post("/api/user", data);
      if (res.status === 200) {
        console.log(res.data);
        emit("onSignUp", false);
      }
    };

    return {
      username,
      desc,
      email,
      submit,
    };
  },
};
</script>
