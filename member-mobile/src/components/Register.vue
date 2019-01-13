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
            <v-flex xs8>
              <v-text-field ref="wechatnumber" v-model="form.wechatnumber" label="微信号" clearable></v-text-field>
            </v-flex>
            <v-flex xs4>
              <v-checkbox ref="iswechatpay" v-model="form.iswechatpay" label="微信收款"></v-checkbox>
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
            <v-flex xs6>
              <v-select
                @change="changeProvince"
                ref="province"
                v-model="form.province"
                :items="provinces"
                required
                :rules="[rules.required]"
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select
                ref="city"
                v-model="form.city"
                :items="citys"
                required
                :rules="[rules.required]"
              ></v-select>
            </v-flex>
            <!-- <v-flex xs12>
              <v-text-field
                ref="address"
                v-model="form.address"
                label="居住地"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>-->
            <v-flex xs12>
              <v-text-field
                ref="parentId"
                v-model="form.parentId"
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
      <v-btn flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
import pc from "../plugins/pc.js";
export default {
  computed: {
    openRegister: {
      get() {
        if (this.$store.state.openRegister && !this.form.username) {
          // 初始化省市二级联动
          for (let province of pc) {
            this.provinces.push(province.name);
          }
          this.form.province = pc[0].name;
          for (let city of pc[0].child) {
            this.citys.push(city.name);
          }
          this.form.city = this.citys[0];
        }
        return this.$store.state.openRegister;
      },
      set(val) {
        this.$store.commit("openRegister", val);
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
      provinces: [],
      citys: [],
      form: {
        username: "",
        idnumber: "",
        mobile: "",
        wechatnumber: "",
        iswechatpay: false,
        bankname: "",
        banknumber: "",
        password: "",
        level: "普通会员",
        province: "",
        city: "",
        // address: "",
        parentId: localStorage.getItem("id"),
        recommendnumber: localStorage.getItem("id")
      },
      formHasErrors: false
    };
  },
  methods: {
    resetForm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (f != "level" && f != "parentId" && f != "recommendnumber") {
          this.$refs[f].reset();
        }
      });
    },
    async confirm() {
      this.$store.commit("openLoading", true);
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        let res = await this.$store.dispatch("reg", this.form);
        if (res.err) {
          this.snackMsg.msg = res.res;
          this.snackMsg.color = "warning";
        } else {
          this.snackMsg.msg = "注册申请成功";
          this.snackMsg.color = "success";
          this.openRegister = false;
          this.resetForm();
        }
      } else {
        this.snackMsg.msg = "请检查输入";
        this.snackMsg.color = "warning";
      }
      this.snackMsg.isShow = true;
      this.$store.commit("openLoading", false);
    },
    changeProvince(e) {
      this.citys = [];
      for (let province of pc) {
        if (province.name == e) {
          for (let city of province.child) {
            this.citys.push(city.name);
          }
          break;
        }
      }
      this.form.province = e;
      this.form.city = this.citys[0];
    }
  }
};
</script>