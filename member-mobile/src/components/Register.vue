<template>
  <v-layout row justify-center>
    <v-dialog v-model="openRegister" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openRegister = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>会员注册</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="openRegister = false">提交申请</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="姓名" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="证件号码" hint="example of helper text only on focus"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="手机号码" persistent-hint required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="微信号" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select :items="['工商银行', '农业银行', '建设银行', '中国银行']" label="银行账户" required></v-select>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="银行卡号" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="登录密码" type="password" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="再次确认" type="password" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="级别" readonly value="普通会员"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="居住地" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="安置编号" required value="MY10000002"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="推荐编号" readonly value="MY10000002"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    };
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