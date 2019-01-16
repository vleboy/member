<template>
  <v-layout d-flex justify-center fill-height>
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" height="800">
      <!--登录/注册-->
      <v-layout align-center justify-center fill-height>
        <v-flex xs12 sm4 mr-1>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>登录</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <v-tooltip bottom>
                <v-btn icon large :href="source" target="_blank" slot="activator">
                  <v-icon large>code</v-icon>
                </v-btn>
                <span>Source</span>
              </v-tooltip>-->
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  prepend-icon="person"
                  name="login"
                  label="手机号或MY号"
                  type="text"
                  :messages="['手机号或MY号']"
                  maxlength="5"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="输入密码"
                  id="password"
                  type="password"
                  :messages="['6-10位数字/英文']"
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
  </v-layout>
</template>

<script>
export default {
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
      this.$router.push({ path: "/user" });
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
          this.$router.push({ path: "/user" });
        }
      } else {
        this.snackMsg.isShow = true;
        this.snackMsg.color = "warning";
        this.snackMsg.msg = "请输入帐号密码";
      }
    }
  }
};
</script>


