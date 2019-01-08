<template>
  <v-layout column>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>钱包账单</v-subheader>
        <template v-for="(item, index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="openDialog(index)">
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
    <MyAchievement/>
    <MyBill/>
    <MyAccount/>
  </v-layout>
</template>

<script>
import MyAchievement from "../components/MyAchievement.vue";
import MyBill from "../components/MyBill.vue";
import MyAccount from "../components/MyAccount.vue";

export default {
  components: {
    MyAchievement,
    MyBill,
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
    openDialog(index) {
      switch (index) {
        case 0:
          this.$store.commit(
            "openMyAchievement",
            !this.$store.state.openMyAchievement
          );
          break;
        case 1:
          this.$store.commit("openMyBill", !this.$store.state.openMyBill);
          break;
        case 2:
          this.$store.commit("openMyAccount", !this.$store.state.openMyAccount);
          break;
        default:
          break;
      }
    }
  }
};
</script>
