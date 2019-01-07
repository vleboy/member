<template>
  <v-container v-if="isShowBottom" pt-0>
    <v-bottom-nav :active.sync="bottomNav" :color="color" :value="true" fixed height="45">
      <v-btn dark to="/home">
        <span>产品订购</span>
        <v-icon>shopping_cart</v-icon>
      </v-btn>
      <v-btn dark to="/team">
        <span>团队建设</span>
        <v-icon>trending_up</v-icon>
      </v-btn>
      <v-btn dark to="/person">
        <span>个人资料</span>
        <v-icon>person</v-icon>
      </v-btn>
      <v-btn dark to="/wallet">
        <span>钱包账单</span>
        <v-icon>account_balance_wallet</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: 0
    };
  },
  created: function() {},
  computed: {
    isShowBottom() {
      return this.$route.path == "/" ? false : true;
    },
    color() {
      switch (this.bottomNav) {
        case 0:
          return "teal";
        case 1:
          return "cyan darken-2";
        case 2:
          return "brown";
        case 3:
          return "blue";
      }
    }
  }
};
</script>