<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyAccount" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card ref="form">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyAccount = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>我的账户</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="confirm">提现申请</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                ref="balance"
                box
                prefix="￥"
                label="账户余额"
                readonly
                :value="user.balance"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="amount"
                v-model="form.amount"
                label="提现金额"
                hint="本月免费提现次数：2，提现手续费10元/次"
                :rules="[rules.price]"
                required
                clearable
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <!--提示信息-->
    <v-snackbar v-model="snackMsg.isShow" top auto-height :color="snackMsg.color">
      {{snackMsg.msg}}
      <v-btn color="gray" flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
export default {
  created: function() {
    this.userGet();
  },
  computed: {
    openMyAccount: {
      get() {
        if (this.$store.state.openMyAccount) {
          this.userGet();
        }
        return this.$store.state.openMyAccount;
      },
      set(val) {
        this.$store.commit("openMyAccount", val);
      }
    }
  },
  data() {
    return {
      rules: {
        price: value => {
          const pattern = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
          return pattern.test(value) || "请输入正确金额";
        }
      },
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      user: { balance: 0 },
      form: {
        amount: null
      },
      formHasErrors: false
    };
  },
  methods: {
    async userGet() {
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (!res.err) {
        this.user.balance = res.res.balance;
      }
      this.$refs["amount"] && this.$refs["amount"].reset();
    },
    async confirm() {
      this.$store.commit("openLoading", true);
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true;
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        let id = localStorage.getItem("id");
        let res = await this.$store.dispatch("billInsert", {
          userId: id,
          type: "OUT",
          amount: this.form.amount,
          project: "提现"
        });
        if (res.err) {
          this.snackMsg.msg = res.res;
          this.snackMsg.color = "warning";
        } else {
          this.snackMsg.msg = "提现申请成功";
          this.snackMsg.color = "success";
          this.openMyAccount = false;
        }
      } else {
        this.snackMsg.msg = "请检查输入";
        this.snackMsg.color = "warning";
      }
      this.snackMsg.isShow = true;
      this.$store.commit("openLoading", false);
    }
  }
};
</script>