<template>
  <v-card theme="dark" width="350px">
    <v-card-title>Edit Profile</v-card-title>
    <v-form>
      <v-card-text>
        <v-text-field
          v-model="username"
          label="Username *"
          placeholder="john_doe"
          prefix="@"
          outlined
          required
        ></v-text-field>
        <v-textarea
          v-model="bio"
          label="Bio"
          placeholder="Insert catchy bio here ..."
          outlined
          rows="3"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn class="me-2" variant="tonal" @click="$emit('onEdit')">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="outlined" @click="save"> save </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
export default {
  name: "Edit Profile",
  props: ["user"],
  emits: ["onEdit"],
  setup(props) {
    const username = ref(props.user.username);
    const bio = ref(props.user.description);
    const save = async () => {
      try {
        const res = await axios.put("/api/user", {
          address: sessionStorage.getItem("address"),
          username: username.value,
          description: bio.value,
        });
        console.log(res);
      } catch (err) {
        console.log(err);
        console.log(err.response.data.message);
      }
    };

    return {
      username,
      bio,
      save,
    };
  },
};
</script>
