<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="end"
    transition="slide-x-transition"
    theme="dark"
  >
    <template v-slot:activator="{ props }">
      <v-btn prepend-icon="mdi-filter-cog" v-bind="props" color="white"
        >Filter</v-btn
      >
    </template>
    <v-card min-width="300">
      <v-list>
        <v-list-item class="px-0 mb-2" v-if="showStatus == true">
          <v-responsive class="px-4">
            <v-list-item-title>Status</v-list-item-title>
            <v-select
              v-model="selectedStatus"
              :items="statusList"
              chips
              multiple
              variant="outlined"
              density="compact"
              style="max-width: 260px"
            >
              <template v-slot:prepend-item>
                <v-list-item title="Select All" @click="toggle">
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :color="someStat ? 'indigo-darken-4' : undefined"
                      :indeterminate="someStat && !allStat"
                      :model-value="someStat"
                    ></v-checkbox-btn>
                  </template>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>
            </v-select>
          </v-responsive>
        </v-list-item>
        <v-list-item class="px-0 mb-2">
          <v-responsive class="px-4">
            <v-list-item-title>Price Range (ETH)</v-list-item-title>
            <v-range-slider
              v-model="range"
              :max="10"
              :min="0"
              :step="0.01"
              hide-details
              class="align-center mt-10"
              density="compact"
              strict
            >
              <template v-slot:prepend>
                <v-text-field
                  label="Min"
                  :model-value="range[0]"
                  hide-details
                  type="number"
                  variant="outlined"
                  density="compact"
                  style="width: 70px"
                  @change="$set(range, 0, $event)"
                ></v-text-field>
              </template>
              <template v-slot:append>
                <v-text-field
                  label="Max"
                  :model-value="range[1]"
                  hide-details
                  type="number"
                  variant="outlined"
                  style="width: 70px"
                  density="compact"
                  @change="$set(range, 1, $event)"
                ></v-text-field>
              </template>
            </v-range-slider>
          </v-responsive>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="text" @click="menu = false"> Reset </v-btn>
        <v-btn color="primary" variant="text" @click="menu = false">
          Apply
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "FilterMenu",
  props: ["showStatus"],
  setup(props) {
    var menu = ref(false);
    var selectedStatus = ref(["For Sale", "Not For Sale", "Sold"]);
    const statusList = ["For Sale", "Not For Sale", "Sold"];
    var range = ref([0, 10]);
    var showStatus = props.showStatus;

    // computed
    const allStat = computed(
      () => selectedStatus.value.length === statusList.length
    );
    const someStat = computed(() => selectedStatus.value.length > 0);

    // methods
    const toggle = () => {
      if (allStat.value) {
        selectedStatus.value = [];
      } else {
        selectedStatus.value = statusList;
      }
    };

    return {
      menu,
      selectedStatus,
      statusList,
      range,

      // props
      showStatus,

      // computed
      allStat,
      someStat,

      // methods
      toggle,
    };
  },
};
</script>
