<template>
  <v-layout row justify-center>
    <v-dialog
      v-model="openMyAchievement"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="openMyAchievement = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>我的业绩</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-select
          v-model="time"
          @change="achievementQuery"
          outline
          :items="times"
          :label="timeLabel"
        ></v-select>
        <v-data-table :headers="headers" :items="achievements" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.market}}</td>
            <td>{{ props.item.accumulate }}</td>
            <td>{{ props.item.current }}</td>
            <!-- <td>{{ props.item.amount }}</td> -->
          </template>
        </v-data-table>
        <v-layout align-center justify-center>
          <h3>奖金：{{amount}}</h3>
        </v-layout>
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
    openMyAchievement: {
      get() {
        if (this.$store.state.openMyAchievement) {
          this.achievementQuery();
        }
        return this.$store.state.openMyAchievement;
      },
      set(val) {
        this.$store.commit("openMyAchievement", val);
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
        userId: localStorage.getItem("id"),
        time: this.time
      });
      if (!res.err) {
        this.achievements = res.res.achievements;
        this.amount = res.res.amount;
      }
      this.$store.commit("openLoading", false);
    }
  }
};
</script>
