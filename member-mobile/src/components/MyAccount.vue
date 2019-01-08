<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyAccount" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyAccount = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>我的账户</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="openMyAccount = false">提现申请</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field box prefix="￥" label="账户余额" readonly required value="1000.00"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="提现金额"
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
    openMyAccount: {
      get() {
        return this.$store.state.openMyAccount;
      },
      set(val) {
        this.$store.commit("openMyAccount", val);
      }
    }
  }
};
</script>