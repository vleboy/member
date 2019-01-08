<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyDelivery" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyDelivery = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>收货地址</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="openMyDelivery = false">保存</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="收货地址"
                hint="本月免费提现次数：2，提现手续费10元/次"
                :rules="[rules.price]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="收货人"
                hint="本月免费提现次数：2，提现手续费10元/次"
                :rules="[rules.price]"
                clearable
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="收货电话"
                hint="本月免费提现次数：2，提现手续费10元/次"
                :rules="[rules.price]"
                clearable
              ></v-text-field>
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
      rules: {
        price: value => {
          const pattern = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
          return pattern.test(value) || "请输入正确金额格式";
        }
      }
    };
  },
  computed: {
    openMyDelivery: {
      get() {
        return this.$store.state.openMyDelivery;
      },
      set(val) {
        this.$store.commit("openMyDelivery", val);
      }
    }
  }
};
</script>