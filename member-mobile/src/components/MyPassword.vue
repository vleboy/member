<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="openMyPassword"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card ref="form">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyPassword = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>修改密码</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="confirm">保存</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                ref="oldPassword"
                v-model="form.oldPassword"
                label="原密码"
                counter
                :rules="[rules.required]"
                required
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="password"
                v-model="form.password"
                label="新密码"
                type="password"
                :rules="[rules.required]"
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
  created: function() {},
  computed: {
    openMyPassword: {
      get() {
        return this.$store.state.openMyPassword;
      },
      set(val) {
        this.$store.commit("openMyPassword", val);
      }
    }
  },
  data() {
    return {
      rules: {
        required: value => !!value || "请输入"
      },
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      form: {
        oldPassword: "",
        password: ""
      },
      formHasErrors: false
    };
  },
  methods: {
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
          this.openMyPassword = false;
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