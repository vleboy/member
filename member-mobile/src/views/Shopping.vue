<template>
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
          <v-layout justify-end>
            <v-card-actions>
              <v-btn color="info" @click="openMyDelivery">修改</v-btn>
            </v-card-actions>
          </v-layout>
        </v-card>
      </v-list>
    </v-flex>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>产品订购</v-subheader>
        <template v-for="item in products">
          <div :key="item.id">
            <v-layout fluid fill-height justify-center>
              <v-flex xs4>
                <img :src="item.img" height="100">
              </v-flex>
              <v-flex xs4 align-self-center>
                <div>{{ item.name }}</div>
                <div class="font-weight-light">{{ item.desc }}</div>
                <div>￥{{ item.price }}</div>
              </v-flex>
              <v-flex xs5 align-self-center>
                <v-btn icon>
                  <v-icon color="teal" @click="remove(item)">remove</v-icon>
                </v-btn>
                {{item.num}}
                <v-btn icon>
                  <v-icon color="teal" @click="add(item)">add</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>

            <!-- <v-list-tile-content>
            <img :src="item.img" height="80">
            </v-list-tile-content>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.desc }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>￥{{ item.price }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon>
                <v-icon color="teal" @click="remove(item)">remove</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>{{item.num}}</v-list-tile-action>
            <v-list-tile-action>
              <v-btn icon>
                <v-icon color="teal" @click="add(item)">add</v-icon>
              </v-btn>
            </v-list-tile-action>-->
          </div>
        </template>
      </v-list>
    </v-flex>
    <v-footer height="auto">
      <v-card class="flex" flat tile>
        <v-card-title>
          <strong class="subheading">共计{{totalNum}}件产品 合计{{totalPrice}}元</strong>
          <v-spacer></v-spacer>
          <v-btn v-if="totalNum > 0" color="success" @click="openMyPay">确定</v-btn>
        </v-card-title>
      </v-card>
    </v-footer>
    <MyDelivery v-on:child-event="userGet"/>
    <MyPay
      :selectedProducts="selectedProducts"
      :user="user"
      :totalPrice="totalPrice"
      v-on:child-event="productQuery"
    />
    <!--提示信息-->
    <v-snackbar v-model="snackMsg.isShow" top auto-height :color="snackMsg.color">
      {{snackMsg.msg}}
      <v-btn flat @click="snackMsg.isShow = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import MyDelivery from "../components/MyDelivery.vue";
import MyPay from "../components/MyPay.vue";
import _ from "lodash";
export default {
  created: function() {
    this.productQuery();
    this.userGet();
  },
  components: {
    MyDelivery,
    MyPay
  },
  data: () => ({
    snackMsg: {
      isShow: false,
      color: "success",
      msg: ""
    },
    user: {
      deliveryName: "",
      deliveryMobile: "",
      deliveryAddress: ""
    },
    products: [
      {
        id: 0,
        name: "",
        desc: "",
        img: "", //https://cdn.vuetifyjs.com/images/lists/1.jpg
        price: "",
        activity: "",
        num: 0
      }
    ],
    selectedProducts: [],
    totalNum: 0,
    totalPrice: 0
  }),
  methods: {
    async userGet() {
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (!res.err) {
        this.user = res.res;
      }
    },
    async productQuery() {
      this.$store.commit("openLoading", true);
      let res = await this.$store.dispatch("productQuery", {});
      if (!res.err) {
        this.products = res.res;
      }
      this.$store.commit("openLoading", false);
    },
    add(item) {
      if (item.num < 100) {
        item.num++;
        this.totalNum++;
        this.totalPrice += +item.price;
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
      }
      let selectedProduct = _.find(this.selectedProducts, { id: item.id });
      if (selectedProduct) {
        selectedProduct.num = item.num;
      } else {
        this.selectedProducts.push({
          id: item.id,
          name: item.name,
          price: item.price,
          num: item.num
        });
      }
    },
    remove(item) {
      if (item.num > 0) {
        item.num--;
        this.totalNum--;
        this.totalPrice -= +item.price;
        this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
      }
      let selectedProduct = _.find(this.selectedProducts, { id: item.id });
      if (selectedProduct) {
        selectedProduct.num = item.num;
      }
    },
    openMyDelivery() {
      this.$store.commit("openMyDelivery", !this.$store.state.openMyDelivery);
    },
    openMyPay() {
      if (
        !this.user.deliveryAddress ||
        !this.user.deliveryName ||
        !this.user.deliveryMobile
      ) {
        this.snackMsg.color = "warning";
        this.snackMsg.msg = "请先填写收货地址";
        this.snackMsg.isShow = true;
      } else {
        this.$store.commit("openMyPay", !this.$store.state.openMyPay);
      }
    }
  }
};
</script>
