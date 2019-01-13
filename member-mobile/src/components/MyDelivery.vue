<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="openMyDelivery"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card ref="form">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyDelivery = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>收货地址</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="confirm">保存</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                ref="deliveryAddress"
                v-model="form.deliveryAddress"
                label="收货地址"
                counter
                maxlength="25"
                hint="最多25个字"
                :rules="[rules.required]"
                required
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="deliveryName"
                v-model="form.deliveryName"
                label="收货人"
                counter="10"
                maxlength="10"
                hint="最多10个字"
                :rules="[rules.required]"
                required
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="deliveryMobile"
                v-model="form.deliveryMobile"
                label="收货电话"
                counter
                maxlength="11"
                hint="请输入手机号"
                :rules="[rules.mobile]"
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
    openMyDelivery: {
      get() {
        return this.$store.state.openMyDelivery;
      },
      set(val) {
        this.$store.commit("openMyDelivery", val);
      }
    }
  },
  data() {
    return {
      rules: {
        required: value => !!value || "请输入",
        mobile: value => {
          const pattern = /^[0-9]{1,11}$/;
          return pattern.test(value) || "请输入正确手机号";
        }
      },
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      form: {
        deliveryName: "",
        deliveryMobile: "",
        deliveryAddress: ""
      },
      formHasErrors: false
    };
  },
  methods: {
    async userGet() {
      this.$store.commit("openLoading", true);
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (res.err) {
        this.snackMsg.msg = res.res;
        this.snackMsg.color = "error";
      } else {
        this.form.deliveryName = res.res.deliveryName;
        this.form.deliveryMobile = res.res.deliveryMobile;
        this.form.deliveryAddress = res.res.deliveryAddress;
      }
      this.$store.commit("openLoading", false);
    },
    async confirm() {
      this.$store.commit("openLoading", true);
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true;
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        let _id = localStorage.getItem("_id");
        let res = await this.$store.dispatch("userUpdate", {
          _id,
          ...this.form
        });
        if (res.err) {
          this.snackMsg.msg = res.res;
          this.snackMsg.color = "error";
        } else {
          this.snackMsg.msg = "保存成功";
          this.snackMsg.color = "success";
          this.openMyDelivery = false;
          this.$emit("child-event", {});
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