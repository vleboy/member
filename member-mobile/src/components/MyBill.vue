<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyBill" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyBill = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>我的账单</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table :headers="headers" :items="bills" hide-actions>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.time }}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.type }}</td>
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
export default {
  created: function() {
    this.billQuery();
  },
  data() {
    return {
      headers: [
        { text: "时间", value: "time", sortable: false },
        { text: "项目", value: "project", sortable: false },
        { text: "类型", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "备注", value: "remark", sortable: false }
      ],
      bills: []
    };
  },
  computed: {
    openMyBill: {
      get() {
        return this.$store.state.openMyBill;
      },
      set(val) {
        this.$store.commit("openMyBill", val);
      }
    }
  },
  methods: {
    async billQuery() {
      let token = localStorage.getItem("token");
      // let res = await this.$store.dispatch("billQuery", { userId: token.id });
      let res = {
        err: false,
        res: [
          {
            time: "2018.1.1 00:30",
            project: "2018.12下奖金",
            type: "收入",
            amount: 2610,
            balance: 2610,
            remark: "备注信息"
          }
        ]
      };
      if (!res.err) {
        this.bills = res.res;
      }
    }
  }
};
</script>
