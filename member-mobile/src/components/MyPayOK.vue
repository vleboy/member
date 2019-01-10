<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyPayOK" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyPayOK = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>产品订购</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout column>
          <v-flex xs12>
            <v-list subheader three-line>
              <v-subheader>订单信息</v-subheader>
              <v-card flat>
                <v-card-text>
                  <div>下单成功</div>
                  <div>订单号：{{order.id}}</div>
                  <div>工作人员会尽快为您发货</div>
                </v-card-text>
              </v-card>
            </v-list>
          </v-flex>
          <v-flex xs12 align-self-center>
            <v-btn color="info" @click="openMyPayOK = false">关闭</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  created: function() {},
  data() {
    return {};
  },
  props: ["order"],
  methods: {},
  computed: {
    openMyPayOK: {
      get() {
        return this.$store.state.openMyPayOK;
      },
      set(val) {
        this.$store.commit("openMyPayOK", val);
      }
    }
  }
};
</script>