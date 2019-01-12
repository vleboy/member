<template>
  <v-container fluid fill-height justify-center>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="bills" hide-actions no-data-text="暂无数据">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.createdAt | formatDate}}</td>
          <td>{{ props.item.project }}</td>
          <td>{{ props.item.userId }}</td>
          <td>{{ props.item.remark }}</td>
          <td>{{ props.item.type =='IN' ? '收' : '支' }}</td>
          <td>{{ props.item.amount }}</td>
          <td>{{ props.item.balance }}</td>
        </template>
      </v-data-table>
    </v-flex>
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
      headers: [
        { text: "时间", value: "createdAt", sortable: false },
        { text: "明细", value: "project", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "备注", value: "remark", sortable: false },
        { text: "收支", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        { text: "余额", value: "balance", sortable: false }
      ],
      bills: [],
      query: {},
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

