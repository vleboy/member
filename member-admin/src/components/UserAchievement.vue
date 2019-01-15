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
        </v-toolbar>
        <v-card-title>
          {{timeLabel}}奖金：{{amount}}
          <v-spacer></v-spacer>
          <v-select
            v-model="time"
            @change="achievementQuery"
            outline
            :items="times"
            :label="timeLabel"
          ></v-select>
        </v-card-title>
        <v-data-table :headers="headers" :items="achievements" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.market}}</td>
            <td>{{ props.item.accumulate }}</td>
            <td>{{ props.item.current }}</td>
            <!-- <td>{{ props.item.amount }}</td> -->
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import dayjs from "dayjs";
export default {
  created: function() {
    for (let i = 0; i < 6; i++) {
      let timePrefix = dayjs()
        .subtract(i, "months")
        .format("YYYY.MM");
      this.times.push(`${timePrefix}(上)`);
      this.times.push(`${timePrefix}(下)`);
    }
    this.time = this.currentTime();
  },
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
        { text: "本期业绩", value: "current", sortable: false }
        // { text: "奖金", value: "amount", sortable: false }
      ],
      achievements: [],
      amount: 0,
      times: [],
      time: "",
      timeLabel: "本期业绩"
    };
  },
  props: ["openUserId"],
  methods: {
    currentTime() {
      let timePrefix = dayjs().format("YYYY.MM");
      let currentDay = dayjs().date();
      if (currentDay <= 15) {
        return `${timePrefix}(上)`;
      } else {
        return `${timePrefix}(下)`;
      }
    },
    async achievementQuery() {
      this.$store.commit("openLoading", true);
      if (this.time == this.currentTime()) {
        this.timeLabel = "本期业绩";
      } else {
        this.timeLabel = "往期业绩";
      }
      let res = await this.$store.dispatch("achievementQuery", {
        userId: this.openUserId,
        time: this.time
      });
      if (!res.err) {
        this.achievements = res.res.achievements;
        this.amount = res.res.amount;
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
