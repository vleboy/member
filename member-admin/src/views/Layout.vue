<template>
  <div>
    <v-navigation-drawer v-model="drawer" clipped fixed app width="200" v-if="isShow">
      <v-list dense>
        <v-list-tile to="/user">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>用户管理</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/order">
          <v-list-tile-action>
            <v-icon>device_hub</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>交易管理</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile to="/bill">
          <v-list-tile-action>
            <v-icon>scatter_plot</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>平台账单</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <!-- <v-list-tile to="/operation">
          <v-list-tile-action>
            <v-icon>view_list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Operation</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>-->
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left dense v-if="isShow">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>会员系统后台</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="logout">登出</v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <Loading/>
  </div>
</template>

<script>
import Loading from "../components/Loading";
export default {
  components: {
    Loading
  },
  data: () => ({
    drawer: null
  }),
  computed: {
    isShow() {
      return this.$route.path == "/" ? false : true;
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    }
  }
};
</script>