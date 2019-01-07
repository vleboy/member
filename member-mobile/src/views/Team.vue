<template>
  <v-layout column>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>团队建设</v-subheader>
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="diplomacy">
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{item.icon}}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        active: true,
        title: "会员注册",
        subtitle: "手动注册新会员",
        icon: "person_add"
        // iconClass: "grey lighten-1 white--text"
      },
      {
        active: true,
        title: "扫码注册",
        subtitle: "扫码注册新会员",
        icon: "person_add"
      }
    ]
  }),
  methods: {
    diplomacy() {
      console.log("外交");
    }
  }
};
</script>
