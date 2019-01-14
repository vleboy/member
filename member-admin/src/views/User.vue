<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
      <v-flex xs2>
        <!-- <v-switch @change="userQuery" v-model="isAudit" label="待审用户"></v-switch> -->
        <v-select
          v-model="query.status"
          @change="userQuery"
          solo
          :items="items"
          label="用户状态"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs6></v-flex>
      <v-flex xs2>
        <v-text-field v-model="query.key" solo label="编号/姓名/手机号" clearable></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="userQuery" color="primary">查询</v-btn>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="openRegister" color="primary">添加用户</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="users" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>
              <a @click="openUserInfo(props.item._id)">{{ props.item.id }}</a>
            </td>
            <td>{{ props.item.username }}</td>
            <td>{{ props.item.createdAt | formatDate}}</td>
            <td>{{ props.item.mobile }}</td>
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
            <td>{{ props.item.status | toStatus}}</td>
            <td>
              <span v-if="props.item.status == 'init'">
                <a @click="changeStatus(props.item._id,props.item.username,'init','审核')">审核</a> |
              </span>
              <a @click="openRegister(props.item._id)">改</a> |
              <span v-if="props.item.status == 'normal'">
                <a @click="changeStatus(props.item._id,props.item.username,'freeze','冻结')">冻</a> |
              </span>
              <span v-if="props.item.status == 'freeze'">
                <a @click="changeStatus(props.item._id,props.item.username,'normal','解冻')">解冻</a> |
              </span>
              <span v-if="props.item.status == 'init'">
                <a @click="del(props.item._id,props.item.username)">删</a>
              </span>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <Register v-on:child-event="userQuery" :openUserChangeId="openUserChangeId"/>
      <UserInfo :openUserId="openUserInfoId"/>
      <UserBill :openUserId="openUserBillId"/>
      <UserAchievement :openUserId="openUserAchievementId"/>
      <v-dialog v-model="openAudit" max-width="600">
        <v-card>
          <v-card-title>用户审核</v-card-title>
          <v-card-text>
            <v-select :items="[2980,0]" v-model="initPrice" label="套餐选择"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" flat="flat" @click="openAudit = false">取消</v-btn>
            <v-btn color="success" flat="flat" @click="changeStatus(null,null,'normal','审核')">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <!--错误提示-->
    <v-snackbar v-model="snackMsg.isShow" top auto-height :color="snackMsg.color">
      {{snackMsg.msg}}
      <v-btn flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
import Register from "../components/Register.vue";
import UserInfo from "../components/UserInfo.vue";
import UserBill from "../components/UserBill.vue";
import UserAchievement from "../components/UserAchievement.vue";
export default {
  created: function() {
    this.userQuery();
  },
  components: {
    Register,
    UserInfo,
    UserBill,
    UserAchievement
  },
  data() {
    return {
      items: [
        { text: "待审核", value: "init" },
        { text: "已冻结", value: "freeze" },
        { text: "正常", value: "normal" }
      ],
      headers: [
        { text: "编号", value: "id", sortable: false },
        { text: "姓名", value: "username", sortable: false },
        { text: "注册时间", value: "createAt", sortable: false },
        { text: "手机", value: "mobile", sortable: false },
        // { text: "居住地", value: "address", sortable: false },
        // { text: "证件号", value: "idnumber", sortable: false },
        // { text: "微信号", value: "wechatnumber", sortable: false },
        // { text: "微信收款", value: "iswechatpay", sortable: false },
        // { text: "银行", value: "bank", sortable: false },
        // { text: "卡号", value: "banknumber", sortable: false },
        { text: "级别", value: "level", sortable: false },
        { text: "安置编号", value: "parentId", sortable: false },
        { text: "推荐编号", value: "recommendnumber", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "业绩/账单", value: "detail", sortable: false, width: 150 },
        { text: "用户状态", value: "status", sortable: false },
        { text: "操作", value: "action", sortable: false, width: 150 }
      ],
      query: {
        status: "init",
        key: null
      },
      users: [],
      openUserChangeId: null,
      openUserInfoId: null,
      openUserBillId: null,
      openUserAchievementId: null,
      openAudit: false,
      initPrice: 2980,
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      }
    };
  },
  methods: {
    openRegister(openUserChangeId) {
      if (typeof openUserChangeId == "string") {
        this.openUserChangeId = openUserChangeId;
      } else {
        this.openUserChangeId = null;
      }
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
      let res = await this.$store.dispatch("userQuery", this.query);
      if (!res.err) {
        this.users = res.res;
      }
      this.$store.commit("openLoading", false);
    },
    async changeStatus(_id, username, status, operation) {
      if (operation == "审核" && status == "init") {
        this.initPrice = 2980;
        this.openAudit = true;
        this._idTemp = _id;
      } else if (
        (operation == "审核" && status == "normal") ||
        confirm(`确认${operation}用户 ${username}?`)
      ) {
        this.$store.commit("openLoading", true);
        let data = { status };
        if (_id) {
          data._id = _id;
        } else {
          data._id = this._idTemp;
          data.initPrice = this.initPrice;
        }
        let res = await this.$store.dispatch("userUpdate", data);
        this.$store.commit("openLoading", false);
        this.openAudit = false;
        if (res.err) {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "warning";
          this.snackMsg.msg = res.res;
        } else {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "success";
          this.snackMsg.msg = "操作成功";
          this.userQuery();
        }
      }
    },
    async del(_id, username) {
      if (confirm(`确认删除用户 ${username}?`)) {
        this.$store.commit("openLoading", true);
        let res = await this.$store.dispatch("userDelete", { _id });
        this.$store.commit("openLoading", false);
        if (res.err) {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "warning";
          this.snackMsg.msg = res.res;
        } else {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "success";
          this.snackMsg.msg = "操作成功";
          this.userQuery();
        }
      }
    }
  },
  filters: {
    formatDate(timestamp) {
      return dayjs(timestamp).format("YY/MM/DD HH:mm:ss");
    },
    toStatus(status) {
      switch (status) {
        case "init":
          return "待审核";
        case "normal":
          return "正常";
        case "freeze":
          return "已冻结";
        default:
          break;
      }
    }
  }
};
</script>

