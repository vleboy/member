<template>
  <v-layout v-if="openQRScan" row justify-center>
    <v-dialog v-model="openQRScan" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card v-if="openQRScan">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openQRScan = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>扫码注册</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <qrcode-stream :camera="camera" @decode="onDecode" @init="onInit">
          <!-- <div v-show="cameraForzen" class="validation-layer"> -->
          <!-- <div class="validation-notice" v-if="validating">Long validation in progress...</div> -->
          <!-- <div class="validation-result" v-if="!validating"> -->
          <!-- <div v-if="!isValid" class="invalid">无效二维码</div> -->
          <!-- <div v-if="isValid" class="valid">This is a URL</div> -->
          <!-- <div v-else class="invalid">This is NOT a URL!</div> -->
          <!-- </div> -->
          <!-- </div> -->
        </qrcode-stream>
      </v-card>
    </v-dialog>
    <Register :qrcode="qrcode"/>
  </v-layout>
</template>

<script>
import Register from "../components/Register.vue";
export default {
  components: {
    Register
  },
  computed: {
    cameraForzen() {
      return this.camera === false || (this.loading && !this.firstLoad);
    },
    openQRScan: {
      get() {
        if (this.$store.state.openQRScan) {
          this.camera = {};
        }
        return this.$store.state.openQRScan;
      },
      set(val) {
        this.$store.commit("openQRScan", val);
      }
    }
  },
  data() {
    return {
      //   isValid: false,
      //   validating: false,
      camera: {},
      loading: false,
      firstLoad: true,
      qrcode: null
    };
  },
  methods: {
    async onDecode(content) {
      if (content.startsWith("member")) {
        this.stopCamera();
        this.qrcode = content.split(":")[1];
        this.openRegister();
      }

      //   this.validating = true;
      //   this.isValid = await this.validate(content);
      //   this.validating = false;

      //   window.setTimeout(() => {
      //     this.startCamera();
      //   }, 2000);
    },
    stopCamera() {
      this.camera = false;
    },
    // startCamera() {
    //   // use default settings
    //   this.camera = null;
    // },
    validate(content) {
      return new Promise(resolve => {
        window.setTimeout(() => {
          // pretend it's taking really long
          if (content.startsWith("http")) {
            resolve(true);
          } else {
            resolve(false);
          }
        }, 3000);
      });
    },
    async onInit(promise) {
      this.loading = true;
      try {
        await promise;
      } catch (error) {
        console.error(error);
      } finally {
        this.firstLoad = false;
        this.loading = false;
      }
    },
    openRegister() {
      setTimeout(() => {
        this.openQRScan = false;
        this.$store.commit("openRegister", !this.$store.state.openRegister);
      }, 0);
    }
  }
};
</script>

<style scoped>
.validation-layer {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}

.validation-notice,
.validation-result {
  font-weight: bold;
  font-size: 1.4rem;
}

.valid {
  color: green;
}
.invalid {
  color: red;
}
</style>