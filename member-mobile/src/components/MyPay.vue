<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyPay" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyPay = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>产品订购</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout column>
          <v-flex xs12>
            <v-list subheader three-line>
              <v-subheader>收货地址</v-subheader>
              <v-card flat>
                <v-card-text>
                  <div>收货地址：{{user.deliveryAddress}}</div>
                  <div>收货人：{{user.deliveryName}}</div>
                  <div>收货电话：{{user.deliveryMobile}}</div>
                </v-card-text>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs12>
            <v-list subheader three-line>
              <v-subheader>订购产品</v-subheader>
              <v-card flat>
                <v-card-text>
                  <div>治疗仪 x 2</div>
                  <div>治疗仪 x 2</div>
                </v-card-text>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs12>
            <v-list subheader three-line>
              <v-subheader>支付信息</v-subheader>
              <v-card flat>
                <v-card-text>
                  <!-- <div>您的当前余额：</div> -->
                  <div>本次支付：</div>
                </v-card-text>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs12 align-self-center>
            <v-btn color="success">确定</v-btn>
          </v-flex>
        </v-layout>
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
export default {
  created: function() {
    this.userGet();
  },
  data() {
    return {
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      user: {
        deliveryName: "",
        deliveryMobile: "",
        deliveryAddress: ""
      }
    };
  },
  methods: {
    async userGet() {
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (res.err) {
        this.snackMsg.msg = res.res;
        this.snackMsg.color = "error";
      } else {
        this.user.deliveryName = res.res.deliveryName;
        this.user.deliveryMobile = res.res.deliveryMobile;
        this.user.deliveryAddress = res.res.deliveryAddress;
      }
    },
    async confirm() {
      this.snackMsg.isShow = true;
    }
  },
  computed: {
    openMyPay: {
      get() {
        return this.$store.state.openMyPay;
      },
      set(val) {
        this.$store.commit("openMyPay", val);
      }
    }
  }
};
</script>