<template>
  <v-toolbar app height="45">
    <v-toolbar-title class="headline">
      <span>会员系统</span>
      <span class="font-weight-light">Member</span>
    </v-toolbar-title>
    <v-spacer/>
    <v-toolbar-items>
      <!-- <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
      offset-y>-->
      <v-btn dark @click="changeDrawer" icon slot="activator">
        <v-badge overlap>
          <span slot="badge">3</span>
          <v-avatar size="30" color="teal">
            <v-icon size="20">notifications</v-icon>
          </v-avatar>
        </v-badge>
      </v-btn>
      <!-- <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>John Leider</v-list-tile-title>
                    <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn
                      :class="fav ? 'red--text' : ''"
                      icon
                      @click="fav = !fav"
                    >
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-switch v-model="message" color="purple"></v-switch>
                  </v-list-tile-action>
                  <v-list-tile-title>Enable messages</v-list-tile-title>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-action>
                    <v-switch v-model="hints" color="purple"></v-switch>
                  </v-list-tile-action>
                  <v-list-tile-title>Enable hints</v-list-tile-title>
                </v-list-tile>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="menu = false">Cancel</v-btn>
                <v-btn color="primary" flat @click="menu = false">Save</v-btn>
              </v-card-actions>
      </v-card>-->
      <!-- </v-menu> -->
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  data: () => ({
    // menu: false
  }),
  methods: {
    changeDrawer() {
      this.$store.commit("changeDrawer", !this.$store.state.drawer);
    }
  }
};
</script>

