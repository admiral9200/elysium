<template>
  <v-card theme="dark" width="350px">
    <v-form>
      <v-card-text class="d-flex justify-center">
        <v-avatar size="100" v-if="profile_img_preview">
          <v-img :src="profile_img_preview" cover />
        </v-avatar>
      </v-card-text>
      <v-card-text>
        <v-file-input
          v-model="profile_img"
          show-size
          accept="image/*"
          label="Choose a picture"
          prepend-icon="mdi-upload"
          :clearable="false"
        >
        </v-file-input>
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
import { ref, computed } from "vue";
import axios from "axios";
export default {
  name: "Edit Profile",
  emits: ["onEdit"],
  setup() {
    const profile_img = ref(null);

    const profile_img_preview = computed(() => {
      if (profile_img.value) {
        return URL.createObjectURL(profile_img.value[0]);
      } else {
        return null;
      }
    });

    const save = async () => {
      try {
        const res = await axios.put("/api/user/", {
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
      profile_img,
      profile_img_preview,
      save,
    };
  },
};
</script>
