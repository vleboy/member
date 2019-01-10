<template>
  <div>
    <!-- <Header/> -->
    <router-view/>
    <Bottom/>
    <Loading/>
  </div>
</template>

<script>
// import Header from "../components/Header";
import Bottom from "../components/Bottom";
import Loading from "../components/Loading";
export default {
  components: {
    // Header,
    Bottom,
    Loading
  },
  data() {
    return {};
  }
  // computed: {
  //   binding() {
  //     const binding = {};
  //     if (this.$vuetify.breakpoint.mdAndUp) binding.column = true;
  //     return binding;
  //   }
  // }
};
</script>

<style>
</style>
