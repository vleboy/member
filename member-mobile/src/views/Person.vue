<template>
  <v-layout column>
    <v-list>
      <v-subheader>个人资料</v-subheader>
      <v-list-tile>
        <v-list-tile-content>姓名：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>编号：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>证件号码：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>居住地：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>手机号码：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>微信号：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>银行账户：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>级别：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>代理区域：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>安置编号：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>推荐编号：</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-footer height="auto" color="lighten-1">
      <v-layout column justify-center>
        <v-btn color="error" @click="logout">登出</v-btn>
        <v-flex xs12 align-self-center>
          <div>如需修改资料，请联系当地市场工作人员</div>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    items: []
  }),
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    }
  }
};
</script>