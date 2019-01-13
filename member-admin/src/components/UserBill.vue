<template>
  <v-layout row justify-center>
    <v-dialog v-model="openUserBill" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="openUserBill = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>用户账单</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table :headers="headers" :items="bills" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate }}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.type == 'OUT' ? '支出' : '收入' }}</td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.balance }}</td>
            <td>{{ props.item.remark }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import dayjs from "dayjs";
export default {
  computed: {
    openUserBill: {
      get() {
        if (this.openUserId) {
          this.billQuery();
        }
        return this.$store.state.openUserBill;
      },
      set(val) {
        this.$store.commit("openUserBill", val);
      }
    }
  },
  data() {
    return {
      headers: [
        { text: "时间", value: "createdAt", sortable: false },
        { text: "项目", value: "project", sortable: false },
        { text: "类型", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "备注", value: "remark", sortable: false }
      ],
      bills: []
    };
  },
  props: ["openUserId"],
  methods: {
    async billQuery() {
      this.$store.commit("openLoading", true);
      let res = await this.$store.dispatch("billQuery", {
        userId: this.openUserId
      });
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
