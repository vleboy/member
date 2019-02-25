<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
      <!-- <v-flex xs2>
        <v-select
          v-model="query.status"
          @change="orderQuery"
          solo
          :items="items"
          label="提现状态"
          clearable
        ></v-select>
      </v-flex> -->
      <v-flex xs9/>
      <v-flex xs2>
        <v-text-field v-model="query.userId" solo label="会员编号" clearable></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="billQuery" color="primary">查询</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="bills" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate }}</td>
            <td>{{ props.item.userId }}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.type == 'OUT' ? '支出' : '收入' }}</td>
            <td>{{ props.item.amount }}</td>
            <!-- <td>{{ props.item.balance }}</td> -->
            <!-- <td>{{ props.item.remark }}</td> -->
            <td>
              <span v-if="props.item.status != 'confirm'">
                <a @click="changeStatus(props.item._id,props.item.userId,props.item.amount)">确认</a>
              </span>
              <!-- <span v-if="props.item.status == 'init'">
                <a @click="changeStatus(props.item._id,props.item.id,'cancel','取消')">取消</a>
              </span>-->
            </td>
          </template>
        </v-data-table>
      </v-flex>
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
export default {
  created: function() {
    this.billQuery();
  },
  data() {
    return {
      // items: [
      //   { text: "未确认", value: "init" },
      //   { text: "已确认", value: "delivery" }
      // ],
      headers: [
        { text: "时间", value: "createdAt", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "项目", value: "project", sortable: false },
        { text: "类型", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        // { text: "余额", value: "balance", sortable: false },
        // { text: "备注", value: "remark", sortable: false }
        { text: "操作", value: "action", sortable: false }
      ],
      bills: [],
      query: { project: "提现" },
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      }
    };
  },
  methods: {
    async billQuery() {
      this.$store.commit("openLoading", true);
      if (!this.query.userId) {
        delete this.query.userId;
      }
      let res = await this.$store.dispatch("billQuery", this.query);
      if (!res.err) {
        this.bills = res.res;
      }
      this.$store.commit("openLoading", false);
    },
    async changeStatus(_id, userId, amount) {
      if (confirm(`确认会员${userId}提现${amount}元`)) {
        this.$store.commit("openLoading", true);
        let res = await this.$store.dispatch("billUpdate", {
          _id,
          status: "confirm"
        });
        this.$store.commit("openLoading", false);
        if (res.err) {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "warning";
          this.snackMsg.msg = res.res;
        } else {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "success";
          this.snackMsg.msg = "操作成功";
          this.billQuery();
        }
      }
    }
  },
  filters: {
    formatDate(timestamp) {
      return dayjs(timestamp).format("YY/MM/DD HH:mm:ss");
    }
  }
};
</script>

