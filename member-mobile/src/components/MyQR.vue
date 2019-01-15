<template>
  <v-layout row justify-center>
    <v-dialog v-model="openMyQR" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyQR = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>我的二维码</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-layout justify-center>
          <vue-qr :text="text" :size="350"></vue-qr>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      text: `member:${localStorage.getItem("id")}`
    };
  },
  computed: {
    openMyQR: {
      get() {
        return this.$store.state.openMyQR;
      },
      set(val) {
        this.$store.commit("openMyQR", val);
      }
    }
  }
};
</script>
