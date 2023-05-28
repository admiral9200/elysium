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
            class="mb-2"
            v-model="username"
            :rules="[rules.required, rules.username, rules.maxUsername]"
            label="Username"
            placeholder="john_doe"
            prefix="@"
            variant="outlined"
            required
          ></v-text-field>
          <v-textarea
            class="my-4"
            v-model="desc"
            :rules="[rules.maxBio]"
            label="Bio (Optional)"
            placeholder="Too awesome for bio..."
            rows="3"
            variant="outlined"
          ></v-textarea>
          <v-text-field
            class="mt-2"
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="Email"
            placeholder="eg. example@email.com"
            variant="outlined"
            required
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

    const rules = {
      required: (v) => !!v || "This field is required.",
      username: (v) => {
        const pattern = /^[a-zA-Z0-9_]+$/;
        return pattern.test(username.value) || "Invalid username.";
      },
      maxUsername: (v) => v.length <= 25 || "Max 25 characters.",
      maxBio: (v) => v.length <= 150 || "Max 150 characters.",
      email: () => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email.value) || "Please enter a valid email.";
      },
    };

    const valid = computed(() => {
      return (
        username.value.length > 0 &&
        email.value.length > 0 &&
        rules.username(username.value) &&
        rules.email(email.value)
      );
    });

    const submit = async () => {
      if (valid.value === true) {
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
      } else {
        console.log(valid.value);
      }
    };

    return {
      username,
      desc,
      email,
      rules,
      submit,
    };
  },
};
</script>
