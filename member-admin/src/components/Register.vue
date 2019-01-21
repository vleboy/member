<template>
  <v-layout row justify-center>
    <v-dialog v-model="openRegister" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card ref="form">
        <v-toolbar dark>
          <v-btn icon dark @click="openRegister = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="openUserChangeId">会员修改</v-toolbar-title>
          <v-toolbar-title v-else>会员注册</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn v-if="!openUserChangeId" slot="activator" icon @click="resetForm">
              <v-icon>refresh</v-icon>
            </v-btn>
            <v-btn v-if="openUserChangeId" dark flat @click="confirm">提交修改</v-btn>
            <v-btn v-else dark flat @click="confirm">提交申请</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs6>
              <v-text-field
                ref="username"
                v-model="form.username"
                label="姓名"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
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
            <v-flex xs6>
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
            <v-flex xs4>
              <v-text-field
                ref="wechatnumber"
                v-model="form.wechatnumber"
                label="微信号"
                maxlength="19"
                :rules="[rules.wechatnumber]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-checkbox ref="iswechatpay" v-model="form.iswechatpay" label="微信收款"></v-checkbox>
            </v-flex>
            <v-flex xs6>
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
            <v-flex xs6>
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
              <!-- <v-text-field ref="level" v-model="form.level" label="级别" readonly></v-text-field> -->
              <v-select
                ref="level"
                v-model="form.level"
                :items="['普通会员', '免费会员']"
                label="级别"
                required
                :rules="[rules.required]"
                clearable
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select
                ref="province"
                @change="changeProvince"
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
            <v-flex xs12 v-show="allowChange">
              <v-text-field
                ref="parentId"
                v-model="form.parentId"
                label="安置编号"
                required
                :rules="[rules.required]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12 v-show="allowChange">
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
          // 修改时读取用户信息
          if (this.openUserChangeId) {
            this.userGet();
          }
        }
        return this.$store.state.openRegister;
      },
      set(val) {
        this.resetForm();
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
        },
        wechatnumber: value => {
          const pattern = /^[-_a-zA-Z0-9]{5,19}$/;
          return pattern.test(value) || "请输入正确微信号";
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
        iswechatpay: true,
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
      formHasErrors: false,
      allowChange: true
    };
  },
  props: ["openUserChangeId"],
  methods: {
    resetForm() {
      // this.openUserChangeId = null;
      this.allowChange = true;
      this.formHasErrors = false;
      this.provinces = [];
      this.citys = [];
      Object.keys(this.form).forEach(f => {
        if (f != "level" && f != "parentId" && f != "recommendnumber") {
          this.$refs[f].reset();
        }
      });
    },
    async confirm() {
      this.formHasErrors = false;
      Object.keys(this.form).forEach(f => {
        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });
      if (!this.formHasErrors) {
        let res = {};
        if (this.openUserChangeId) {
          let data = { _id: this.openUserChangeId, ...this.form };
          res = await this.$store.dispatch("userUpdate", data);
        } else {
          res = await this.$store.dispatch("reg", this.form);
        }
        if (res.err) {
          this.snackMsg.msg = res.res;
          this.snackMsg.color = "warning";
        } else {
          if (this.openUserChangeId) {
            this.snackMsg.msg = "修改成功";
          } else {
            this.snackMsg.msg = "注册申请成功";
          }
          this.snackMsg.color = "success";
          this.openRegister = false;
          this.resetForm();
          this.$emit("child-event", {});
        }
      } else {
        this.snackMsg.msg = "请检查输入";
        this.snackMsg.color = "warning";
      }
      this.snackMsg.isShow = true;
    },
    async userGet() {
      this.$store.commit("openLoading", true);
      this.allowChange = false;
      let res = await this.$store.dispatch("userGet", {
        _id: this.openUserChangeId
      });
      if (!res.err) {
        this.form.username = res.res.username;
        this.form.idnumber = res.res.idnumber;
        this.form.mobile = res.res.mobile;
        this.form.wechatnumber = res.res.wechatnumber;
        this.form.bankname = res.res.bankname;
        this.form.banknumber = res.res.banknumber;
        this.form.password = res.res.password;
        this.form.level = res.res.level;
        // (this.form.address = res.res.address),
        for (let province of pc) {
          if (province.name == res.res.province) {
            this.citys = [];
            for (let city of province.child) {
              this.citys.push(city.name);
            }
            break;
          }
        }
        this.form.province = res.res.province;
        this.form.city = res.res.city;
        this.form.parentId = res.res.parentId;
        this.form.recommendnumber = res.res.recommendnumber;
        if (res.res.status == "init") {
          this.allowChange = true;
        }
      }
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