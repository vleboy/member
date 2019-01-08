<template>
  <v-layout row justify-center>
    <v-dialog v-model="openRegister" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card ref="form">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openRegister = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>会员注册</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn slot="activator" icon @click="resetForm">
              <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn dark flat @click="confirm">提交申请</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                ref="username"
                v-model="form.username"
                label="姓名"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="idnumber"
                v-model="form.idnumber"
                label="证件号码"
                required
                counter="18"
                maxlength="18"
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="mobile"
                v-model="form.mobile"
                label="手机号码"
                required
                counter="11"
                maxlength="11"
                :rules="[rules.mobile]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field ref="wechatnumber" v-model="form.wechatnumber" label="微信号" clearable></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select
                ref="bankname"
                v-model="form.bankname"
                :items="['工商银行', '农业银行', '建设银行', '中国银行']"
                label="银行账户"
                required
                :rules="[rules.required]"
                clearable
              ></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="banknumber"
                v-model="form.banknumber"
                label="银行卡号"
                required
                counter
                maxlength="19"
                :rules="[rules.banknumber]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="password"
                v-model="form.password"
                label="登录密码"
                type="password"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12>
              <v-text-field ref="password2" v-model="form.password2" label="再次确认" type="password" required></v-text-field>
            </v-flex>-->
            <v-flex xs12>
              <v-text-field ref="level" v-model="form.level" label="级别" readonly></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="address"
                v-model="form.address"
                label="居住地"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="placenumber"
                v-model="form.placenumber"
                label="安置编号"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                ref="recommendnumber"
                v-model="form.recommendnumber"
                label="推荐编号"
                readonly
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
  data() {
    return {
      rules: {
        required: value => !!value || "请输入",
        mobile: value => {
          const pattern = /^[0-9]{1,11}$/;
          return pattern.test(value) || "请输入正确手机号";
        },
        banknumber: value => {
          const pattern = /^[0-9]{1,19}$/;
          return pattern.test(value) || "请输入正确银行卡号";
        }
      },
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      form: {
        username: "",
        idnumber: "",
        mobile: "",
        wechatnumber: "",
        bankname: "",
        banknumber: "",
        password: "",
        level: "普通会员",
        address: "",
        placenumber: "MY10000002",
        recommendnumber: "MY10000002"
      },
      formHasErrors: false
    };
  },
  methods: {
    resetForm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (f != "level" && f != "placenumber" && f != "recommendnumber") {
          this.$refs[f].reset();
        }
      });
    },
    confirm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        this.snackMsg.msg = "注册申请成功";
        this.snackMsg.color = "success";
        this.openRegister = false;
        this.resetForm();
      } else {
        this.snackMsg.msg = "请检查输入";
        this.snackMsg.color = "warning";
      }
      this.snackMsg.isShow = true;
    }
  },
  computed: {
    openRegister: {
      get() {
        return this.$store.state.openRegister;
      },
      set(val) {
        this.$store.commit("openRegister", val);
      }
    }
  }
};
</script>