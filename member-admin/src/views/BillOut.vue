<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
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
            <td>{{ props.item.balance }}</td>
            <td>{{ props.item.remark }}</td>
            <!-- <td>
              <span v-if="props.item.status == 'init'">
                <a @click="changeStatus(props.item._id,props.item.id,'delivery','发货')">发货</a> |
              </span>
              <span v-if="props.item.status == 'init'">
                <a @click="changeStatus(props.item._id,props.item.id,'cancel','取消')">取消</a>
              </span>
            </td>-->
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
      //   { text: "未发货", value: "init" },
      //   { text: "已发货", value: "delivery" },
      //   // { text: "已冻结", value: "freeze" },
      //   { text: "已取消", value: "cancel" }
      // ],
      headers: [
        { text: "时间", value: "id", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "项目", value: "createdAt", sortable: false },
        { text: "类型", value: "userId", sortable: false },
        { text: "金额", value: "price", sortable: false },
        { text: "余额", value: "product", sortable: false },
        { text: "备注", value: "deliveryAddress", sortable: false }
        // { text: "操作", value: "action", sortable: false }
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
    }
  },
  filters: {
    formatDate(timestamp) {
      return dayjs(timestamp).format("YY/MM/DD HH:mm:ss");
    }
  }
};
</script>

