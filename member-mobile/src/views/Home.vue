<template>
  <v-layout column>
    <v-flex xs12>
      <v-list subheader three-line>
        <v-subheader>收货地址</v-subheader>
        <v-card flat>
          <v-card-text>
            <div>收货地址：四川省成都市青羊区天府广场1号</div>
            <div>收货人：张三</div>
            <div>收货电话：13812345678</div>
          </v-card-text>
          <v-layout justify-end>
            <v-card-actions>
              <v-btn color="info">修改</v-btn>
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
  </v-layout>
</template>

<script>
export default {
  data: () => ({
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
    ]
  }),
  methods: {
    diplomacy() {
      console.log("外交");
    }
  }
};
</script>
