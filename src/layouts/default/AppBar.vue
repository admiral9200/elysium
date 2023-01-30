<template>
<v-app-bar flat color="black">
    <v-app-bar-title>
        <v-icon icon="mdi-circle-slice-4" />
        Elysium
    </v-app-bar-title>

    <v-text-field append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>

    <v-spacer></v-spacer>

    <v-btn color="white" v-for="item in items" :key="item" :to="item.link" class="me-2" large :icon="item.icon">
    </v-btn>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>

        <v-list>
            <v-list-item v-for="(item, i) in menu" :key="i" :prepend-icon="item.icon">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</v-app-bar>
</template>

<script>
export default {
    name: "AppBar",
    setup() {
        const items = [{
                text: "Discover",
                icon: "mdi-creation",
                link: "/",
            },
            {
                text: "Cart",
                icon: "mdi-cart",
                link: "/cart",
            },
            {
                text: "Profile",
                icon: "mdi-account-circle",
                link: "/profile",
            },
        ];
        const menu = [{
                text: "Setting",
                icon: "mdi-cog",
                link: "/setting",
            },
            {
                text: "Help",
                icon: "mdi-help",
                link: "/help",
            },
            {
                text: "Logout",
                icon: "mdi-logout",
                link: "/logout",
            },
        ];
        return {
            items,
            menu,
        };
    },
};
</script>
