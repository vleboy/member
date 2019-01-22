<template>
  <v-layout fluid d-flex justify-center fill-height>
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" height="800">
      <div class="text-xs-center">会员系统</div>
      <!-- <div class="text-xs-center">建议您【添加到主屏幕】或【收藏】以便下次打开</div> -->
      <!-- <div class="text-xs-center">若添加失败，请在系统中对本浏览器应用允许开启【创建桌面快捷方式】权限</div> -->
      <!--登录/注册-->
      <v-layout align-center justify-center fill-height>
        <v-flex xs12 sm4 mr-1>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>登录</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-btn color="success" @click="scanReg">扫码注册</v-btn> -->
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  prepend-icon="person"
                  name="login"
                  label="输入手机号/MY号"
                  type="text"
                  :messages="['手机号或MY号']"
                  maxlength="11"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="输入密码"
                  id="password"
                  type="password"
                  :messages="['6-10位数字/英文']"
                  maxlength="10"
                  clearable
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">登录</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!--底部声明-->
      <v-layout justify-center fill-height>
        <v-flex xs12 sm4>
          <div class="text-xs-center">2018-2019 &copy;</div>
        </v-flex>
      </v-layout>
    </v-parallax>
    <!--错误提示-->
    <v-snackbar v-model="snackMsg.isShow" top auto-height :color="snackMsg.color">
      {{snackMsg.msg}}
      <v-btn flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
    <!-- <QRScan/> -->
  </v-layout>
</template>

<script>
// import QRScan from "../components/QRScan.vue";
export default {
  // components: {
  //   QRScan
  // },
  data() {
    return {
      username: null,
      password: null,
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      }
    };
  },
  created: function() {
    // 身份认证有效期内，直接跳转
    if (localStorage.getItem("token")) {
      this.$router.push({ path: "/wallet" });
    }
  },
  methods: {
    // 登录
    async login() {
      if (this.username && this.password) {
        let inparam = { id: this.username, password: this.password };
        if (parseInt(this.username)) {
          inparam.mobile = this.username;
          delete inparam.id;
        }
        let res = await this.$store.dispatch("login", inparam);
        if (res.err) {
          this.snackMsg.isShow = true;
          this.snackMsg.color = "warning";
          this.snackMsg.msg = res.res;
        } else {
          localStorage.setItem("_id", res.res._id);
          localStorage.setItem("id", res.res.id);
          localStorage.setItem("token", res.res.token);
          this.$router.push({ path: "/wallet" });
        }
      } else {
        this.snackMsg.isShow = true;
        this.snackMsg.color = "warning";
        this.snackMsg.msg = "请输入帐号密码";
      }
    },
    // 扫码注册
    scanReg() {
      this.$store.commit("openQRScan", !this.$store.state.openQRScan);
    }
  }
};
</script>


