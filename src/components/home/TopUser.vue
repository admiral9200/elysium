<template>
  <div class="font-weight-bold text-h4 mt-4">Most Popular Users</div>
  <v-row class="mt-5" v-if="topUsers.length">
    <v-col cols="12" md="4" v-for="item in topUsers" :key="item.address">
      <v-card class="mx-auto py-3" max-width="344" color="black">
        <v-img :src="item.profile_url" height="200px"></v-img>
        <v-card-title class="text-h5">{{ item.username }}</v-card-title>
        <v-card-text>{{ item.address }}</v-card-text>
        <v-card-actions class="d-flex justify-space-between mx-2">
          <v-btn variant="outlined">{{ item.followers }} Followers</v-btn>
          <v-btn class="w-50" variant="outlined" :to="item.link">View</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "TopUser",
  setup() {
    const topUsers = ref([]);

    onMounted(async () => {
      try {
        const res = await axios.get("/api/user/topUser");
        if (res.status === 200)
          for (const item of res.data) {
            const user = await axios.get("/api/user/" + item[0]);
            user.data.link = `/user/${item[0]}`;
            user.data.followers = item[1];
            topUsers.value.push(user.data);
            console.log("User", user.data);
          }
      } catch (err) {
        if (err.response.status === 404)
          //TODO if no top seller, show something else
          console.log(err);
      }
    });

    return {
      topUsers,
    };
  },
};
</script>
