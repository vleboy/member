<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
      <v-flex
        xs10
      >当前入账：{{accumulate.accumulateIn}}元 当前支账：{{accumulate.accumulateOut}}元 当前余额：{{accumulate.accumulateBalance}}元 会员账户总额：{{accumulate.accumulateMemberBalance}}元</v-flex>
      <v-flex xs1>
        <v-btn @click="openBillInOutDialog('入')" color="primary">入</v-btn>
      </v-flex>
      <v-flex xs1>
        <v-btn @click="openBillInOutDialog('支')" color="primary">支</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="bills" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate}}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.userId }}</td>
            <td>{{ props.item.remark }}</td>
            <td>{{ props.item.type =='IN' ? '入' : '支' }}</td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.balance }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-dialog v-model="openBillInOut" max-width="600px">
      <v-card ref="form">
        <v-card-title>
          <span class="headline">{{dialogTitle}}款记录</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  ref="project"
                  v-model="form.project"
                  label="明细"
                  :rules="[rules.required]"
                  maxlength="25"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  ref="amount"
                  v-model="form.amount"
                  label="金额"
                  maxlength="10"
                  :rules="[rules.mobile]"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  ref="remark"
                  v-model="form.remark"
                  label="备注"
                  maxlength="25"
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="openBillInOut = false">关闭</v-btn>
          <v-btn
            color="blue darken-1"
            flat
            @click="confirmBillInOut(dialogTitle)"
          >确认{{dialogTitle}}款</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialogTitle: "",
      rules: {
        required: value => !!value || "请输入",
        mobile: value => {
          const pattern = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
          return pattern.test(value) || "请输入正确金额";
        }
      },
      form: {
        project: null,
        amount: null,
        remark: null
      },
      formHasErrors: false,
      openBillInOut: false,
      accumulate: {
        accumulateIn: 0,
        accumulateOut: 0,
        accumulateBalance: 0,
        accumulateMemberBalance: 0
      },
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
    },
    async openBillInOutDialog(dialogTitle) {
      this.dialogTitle = dialogTitle;
      this.resetForm();
      this.openBillInOut = true;
    },
    async confirmBillInOut(operation) {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true;
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        let data = { ...this.form, userId: localStorage.getItem("id") };
        if (operation == "入") {
          data.type = "IN";
        } else if (operation == "支") {
          data.type = "OUT";
        }
        let res = await this.$store.dispatch("billInsert", data);
        this.openBillInOut = false;
        if (res.err) {
          this.snackMsg.isShow = true;
          this.snackMsg.msg = res.res;
          this.snackMsg.color = "warning";
        } else {
          this.snackMsg.isShow = true;
          this.snackMsg.msg = `${operation}款成功`;
          this.snackMsg.color = "success";
        }
      }
    },
    resetForm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        this.$refs[f].reset();
      });
    }
  },
  filters: {
    formatDate(timestamp) {
      return dayjs(timestamp).format("YY/MM/DD HH:mm:ss");
    }
  }
};
</script>

