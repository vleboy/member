<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
      <v-flex xs8>
        <v-switch @change="userQuery" v-model="isAudit" label="待审用户"></v-switch>
      </v-flex>
      <v-flex xs2>
        <v-text-field v-model="queryKey" solo label="编号/姓名/手机号" clearable></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="userQuery" color="primary">查询</v-btn>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="openRegister" color="primary">添加用户</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="users" hide-actions>
          <template slot="items" slot-scope="props">
            <td>
              <a @click="openUserInfo(props.item._id)">{{ props.item.id }}</a>
            </td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.createAt }}</td>
            <!-- <td>{{ props.item.address }}</td>
            <td>{{ props.item.mobile }}</td>
            <td>{{ props.item.idnumber }}</td>
            <td>{{ props.item.wechatnumber }}</td>
            <td>{{ props.item.iswechatpay }}</td>
            <td>{{ props.item.bank }}</td>
            <td>{{ props.item.banknumber }}</td>-->
            <td>{{ props.item.level }}</td>
            <td>{{ props.item.parentId }}</td>
            <td>{{ props.item.recommendnumber }}</td>
            <td>{{ props.item.balance }}</td>
            <td>
              <a @click="openUserAchievement(props.item.id)">业绩</a> |
              <a @click="openUserBill(props.item.id)">账单</a>
            </td>
            <td>
              <a>改</a> |
              <a>冻</a> |
              <a>删</a>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <Register v-on:child-event="userQuery"/>
      <UserInfo :openUserId="openUserInfoId"/>
      <UserBill :openUserId="openUserBillId"/>
      <!-- <UserAchievement :openUserId="openUserAchievementId"/> -->
    </v-layout>
  </v-container>
</template>

<script>
import Register from "../components/Register.vue";
import UserInfo from "../components/UserInfo.vue";
import UserBill from "../components/UserBill.vue";
// import UserAchievement from "../components/UserAchievement.vue";
export default {
  created: function() {
    this.userQuery();
  },
  components: {
    Register,
    UserInfo,
    UserBill
    // UserAchievement
  },
  data() {
    return {
      headers: [
        { text: "编号", value: "id", sortable: false },
        { text: "姓名", value: "username", sortable: false },
        { text: "注册时间", value: "createAt", sortable: false },
        // { text: "居住地", value: "address", sortable: false },
        // { text: "手机", value: "mobile", sortable: false },
        // { text: "证件号", value: "idnumber", sortable: false },
        // { text: "微信号", value: "wechatnumber", sortable: false },
        // { text: "微信收款", value: "iswechatpay", sortable: false },
        // { text: "银行", value: "bank", sortable: false },
        // { text: "卡号", value: "banknumber", sortable: false },
        { text: "级别", value: "level", sortable: false },
        { text: "安置编号", value: "parentId", sortable: false },
        { text: "推荐编号", value: "recommendnumber", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "业绩/账单", value: "detail", sortable: false },
        { text: "操作", value: "action", sortable: false }
      ],
      isAudit: true,
      queryKey: null,
      query: {},
      users: [],
      openUserInfoId: null,
      openUserBillId: null,
      openUserAchievementId: null
    };
  },
  methods: {
    openRegister() {
      this.$store.commit("openRegister", !this.$store.state.openRegister);
    },
    openUserInfo(openUserId) {
      this.openUserInfoId = openUserId;
      this.$store.commit("openUserInfo", !this.$store.state.openUserInfo);
    },
    async openUserBill(openUserId) {
      this.openUserBillId = openUserId;
      this.$store.commit("openUserBill", !this.$store.state.openUserBill);
    },
    async openUserAchievement(openUserId) {
      this.openUserAchievementId = openUserId;
      this.$store.commit(
        "openUserAchievement",
        !this.$store.state.openUserAchievement
      );
    },
    async userQuery() {
      this.$store.commit("openLoading", true);
      if (this.isAudit) {
        this.query.status = "init";
      }
      if (this.queryKey) {
        this.query.id = this.queryKey;
      } else {
        delete this.query.id;
      }
      let res = await this.$store.dispatch("userQuery", this.query);
      if (!res.err) {
        this.users = res.res;
      }
      this.$store.commit("openLoading", false);
    }
  }
};
</script>

