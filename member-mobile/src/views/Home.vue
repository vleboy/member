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
        <!-- <v-list-tile> -->
        <!-- <v-list-tile-content>
            <v-list-tile-title>收货地址：1111111111111111111111111111111111111</v-list-tile-title>
            <v-list-tile-title>收货人：</v-list-tile-title>
            <v-list-tile-title>收货电话：</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn>修改</v-btn>
        </v-list-tile-action>-->
        <!-- </v-list-tile> -->
      </v-list>
    </v-flex>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>产品订购</v-subheader>
        <v-list-tile v-for="item in items" :key="item.title" avatar ripple @click="diplomacy">
          <!-- <v-list-tile-avatar> -->
          <v-list-tile-content>
            <img :src="item.avatar" height="80">
          </v-list-tile-content>
          <!-- </v-list-tile-avatar> -->
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <!-- <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text> -->
            <v-btn icon>
              <v-icon :color="item.active ? 'teal' : 'grey'">remove</v-icon>
            </v-btn>
          </v-list-tile-action>
          <v-list-tile-action>0</v-list-tile-action>
          <v-list-tile-action>
            <!-- <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text> -->
            <v-btn icon>
              <v-icon :color="item.active ? 'teal' : 'grey'">add</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-flex>
    <v-footer height="auto">
      <v-card class="flex" flat tile>
        <v-card-title>
          <strong class="subheading">共计{{productNum}}件产品 合计{{price}}元</strong>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="openMyPay">确定</v-btn>
        </v-card-title>
      </v-card>
    </v-footer>
    <MyDelivery v-on:child-event="userGet"/>
    <MyPay/>
  </v-layout>
</template>

<script>
import MyDelivery from "../components/MyDelivery.vue";
import MyPay from "../components/MyPay.vue";
export default {
  created: function() {
    this.userGet();
  },
  components: {
    MyDelivery,
    MyPay
  },
  data: () => ({
    user: {
      deliveryName: "",
      deliveryMobile: "",
      deliveryAddress: ""
    },
    items: [
      {
        active: true,
        title: "产品1",
        subtitle: "500",
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        action: "15 min"
      },
      {
        active: true,
        title: "产品2",
        subtitle: "500",
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        action: "15 min"
      },
      {
        title: "产品3",
        subtitle: "500",
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        action: "15 min"
      },
      {
        title: "产品4",
        subtitle: "500",
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        action: "15 min"
      }
    ],
    productNum: 0,
    price: 0
  }),
  methods: {
    async userGet() {
      let _id = localStorage.getItem("_id");
      let res = await this.$store.dispatch("userGet", { _id });
      if (!res.err) {
        this.user = res.res;
      }
    },
    diplomacy() {
      console.log("外交");
    },
    openMyDelivery() {
      this.$store.commit("openMyDelivery", !this.$store.state.openMyDelivery);
    },
    openMyPay() {
      this.$store.commit("openMyPay", !this.$store.state.openMyPay);
    }
  }
};
</script>
