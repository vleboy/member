<template>
  <v-container v-if="isShowBottom" pt-0>
    <v-bottom-nav dark :value="true" fixed>
      <v-btn to="/person">
        <span>个人资料</span>
        <v-icon>person</v-icon>
      </v-btn>
      <v-btn to="/team">
        <span>团队建设</span>
        <v-icon>trending_up</v-icon>
      </v-btn>
      <v-btn to="/shopping">
        <span>产品订购</span>
        <v-icon>shopping_cart</v-icon>
      </v-btn>
      <v-btn to="/wallet">
        <span>钱包账单</span>
        <v-icon>account_balance_wallet</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  created: function() {},
  computed: {
    isShowBottom() {
      return this.$route.path == "/" ? false : true;
    }
  }
};
</script>