<template>
  <v-layout column>
    <v-dialog v-model="openUserInfo" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card ref="form">
        <v-toolbar dark>
          <v-btn icon dark @click="openUserInfo = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>用户详细信息</v-toolbar-title>
        </v-toolbar>
        <!-- <v-container> -->
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
            <v-list-tile-content>居住地：{{user.province}} {{user.city}}</v-list-tile-content>
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
        <!-- </v-container> -->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
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
  props: ["openUserId"],
  computed: {
    openUserInfo: {
      get() {
        this.openUserId && this.userGet();
        return this.$store.state.openUserInfo;
      },
      set(val) {
        this.$store.commit("openUserInfo", val);
      }
    }
  },
  methods: {
    async userGet() {
      this.$store.commit("openLoading", true);
      let res = await this.$store.dispatch("userGet", { _id: this.openUserId });
      if (!res.err) {
        this.user = res.res;
      }
      this.$store.commit("openLoading", false);
    }
  }
};
</script>