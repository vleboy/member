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
        <v-list-tile-content>居住地：{{user.address}}</v-list-tile-content>
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
        <v-list-tile-content>微信收款：{{user.iswechatpay}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>银行：{{user.bank}}</v-list-tile-content>
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
        <v-list-tile-content>安置编号：{{user.plcaenumber}}</v-list-tile-content>
        <v-list-tile-content class="align-end"></v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>推荐编号：{{user.recommandnumber}}</v-list-tile-content>
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
      address: "",
      mobile: "",
      wechatnumber: "",
      iswechatpay: "",
      bank: "",
      banknumber: "",
      level: "",
      plcaenumber: "",
      recommandnumber: ""
    }
  }),
  methods: {
    async userGet() {
      let token = localStorage.getItem("token");
      // let res = await this.$store.dispatch("userGet", { _id: token._id });
      let res = {
        err: false,
        res: {
          username: "张三",
          id: "MY100002",
          idnumber: "1267282827297829",
          address: "四川绵阳",
          mobile: "18780004427",
          wechatnumber: "qw890",
          iswechatpay: "是",
          bank: "工商银行",
          banknumber: "123123123123123",
          level: "普通会员",
          plcaenumber: "MY100001",
          recommandnumber: "MY100001"
        }
      };
      if (!res.err) {
        this.user = res.res;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    }
  }
};
</script>