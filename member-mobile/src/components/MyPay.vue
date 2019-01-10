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
                  <div v-for="item in selectedProducts" :key="item.id">{{item.name}} x {{item.num}}</div>
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
                  <div>本次支付：￥{{totalPrice}}</div>
                </v-card-text>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs12 align-self-center>
            <v-btn color="success" @click="confirm">确认订购</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <!--提示信息-->
    <v-snackbar v-model="snackMsg.isShow" top auto-height :color="snackMsg.color">
      {{snackMsg.msg}}
      <v-btn flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
    <MyPayOK :order="order"/>
  </v-layout>
</template>
<script>
import MyPayOK from "../components/MyPayOK.vue";
export default {
  components: {
    MyPayOK
  },
  created: function() {},
  data() {
    return {
      snackMsg: {
        isShow: false,
        color: "success",
        msg: ""
      },
      order: {
        id: null
      }
    };
  },
  props: ["selectedProducts", "user", "totalPrice"],
  methods: {
    async confirm() {
      let products = [];
      let data = { userId: localStorage.getItem("id"), products };
      for (let product of this.selectedProducts) {
        products.push({
          id: product.id,
          price: product.price,
          num: product.num
        });
      }
      let res = await this.$store.dispatch("orderInsert", data);
      if (res.err) {
        this.snackMsg.isShow = true;
        this.snackMsg.msg = res.res;
        this.snackMsg.color = "warning";
      } else {
        this.order.id = res.res;
        this.openMyPay = false;
        this.$store.commit("openMyPayOK", !this.$store.state.openMyPayOK);
      }
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