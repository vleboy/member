<template>
  <v-layout column>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>钱包账单</v-subheader>
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="openDialog">
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
    <MyAccount/>
  </v-layout>
</template>

<script>
import MyAccount from "../components/MyAccount.vue";
export default {
  components: {
    MyAccount
  },
  data: () => ({
    items: [
      {
        active: true,
        title: "业绩查询",
        subtitle: "查询业绩详情",
        icon: "trending_up"
        // iconClass: "grey lighten-1 white--text"
      },
      {
        active: true,
        title: "账单查询",
        subtitle: "查询账单详情",
        icon: "notes"
      },
      {
        active: true,
        title: "我的账户",
        subtitle: "查看个人账户信息",
        icon: "account_balance_wallet"
      }
    ]
  }),
  methods: {
    openDialog(e) {
      console.log(e);
      this.$store.commit("openMyAccount", !this.$store.state.openMyAccount);
    }
  }
};
</script>
