<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="openUserAchievement"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="openUserAchievement = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>用户业绩</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-select
            v-model="time"
            @change="achievementQuery"
            outline
            :items="times"
            label="本期业绩"
            clearable
          ></v-select>
        </v-toolbar>

        <v-data-table :headers="headers" :items="achievements" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.createdAt | formatDate }}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.type == 'OUT' ? '支出' : '收入' }}</td>
            <td>{{ props.item.amount }}</td>
            <td>{{ props.item.balance }}</td>
            <td>{{ props.item.remark }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import dayjs from "dayjs";
export default {
  computed: {
    openUserAchievement: {
      get() {
        if (this.$store.state.openUserAchievement) {
          this.achievementQuery();
        }
        return this.$store.state.openUserAchievement;
      },
      set(val) {
        this.$store.commit("openUserAchievement", val);
      }
    }
  },
  data() {
    return {
      headers: [
        { text: "市场", value: "market", sortable: false },
        { text: "累积业绩", value: "accumulate", sortable: false },
        { text: "本期业绩", value: "current", sortable: false },
        { text: "奖金", value: "amount", sortable: false }
      ],
      achievements: [],
      times: [],
      time: ""
    };
  },
  props: ["openUserId"],
  methods: {
    async achievementQuery() {
      this.$store.commit("openLoading", true);
      let res = await this.$store.dispatch("achievementQuery", {
        userId: this.openUserId,
        time: "201901",
        type: "up/down"
      });
      if (!res.err) {
        this.achievements = res.res;
      }
      this.$store.commit("openLoading", false);
    }
  },
  filters: {
    formatDate(timestamp) {
      return dayjs(timestamp).format("YY/MM/DD HH:mm:ss");
    }
  }
};
</script>
