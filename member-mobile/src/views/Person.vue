<template>
  <v-layout column>
    <v-list>
      <v-subheader>个人资料</v-subheader>
      <v-list-tile>
        <v-list-tile-content>姓名：{{user.username}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>编号：{{user.id}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>证件号码：{{user.idnumber}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>居住地：{{user.province}} {{user.city}} {{user.address}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>手机号码：{{user.mobile}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>微信号：{{user.wechatnumber}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>微信收款：{{user.iswechatpay ? '是':'否'}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>银行：{{user.bankname}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>卡号：{{user.banknumber}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>级别：{{user.level}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <!-- <v-list-tile>
        <v-list-tile-content>代理区域：{{user.username}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>-->
      <v-list-tile>
        <v-list-tile-content>安置编号：{{user.parentId}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>推荐编号：{{user.recommendnumber}}</v-list-tile-content>
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
  created: function() {
    this.userGet();
  },
  data: () => ({
    user: {
      username: "",
      id: "",
      idnumber: "",
      // address: "",
      province: "",
      city: "",
      mobile: "",
      wechatnumber: "",
      iswechatpay: "",
      bankname: "",
      banknumber: "",
      level: "",
      parentId: "",
      recommendnumber: ""
    }
  }),
  methods: {
    async userGet() {
      this.$store.commit("openLoading", true);
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (!res.err) {
        this.user = res.res;
      }
      this.$store.commit("openLoading", false);
    },
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    }
  }
};
</script>