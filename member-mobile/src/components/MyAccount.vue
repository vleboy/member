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
        <v-list>
          <!-- <v-subheader>我的账户</v-subheader> -->
          <v-list-tile>
            <v-list-tile-content>账户余额：</v-list-tile-content>
            <v-list-tile-content class="align-end">1000.00</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {};
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