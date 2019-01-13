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
        <v-data-table :headers="headers" :items="desserts" hide-actions>
          <template slot="items" slot-scope="props">
            <td>{{ props.item.time }}</td>
            <td>{{ props.item.project }}</td>
            <td>{{ props.item.type }}</td>
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
export default {
  computed: {
    openMyAchievement: {
      get() {
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
        { text: "时间", value: "time", sortable: false },
        { text: "项目", value: "project", sortable: false },
        { text: "类型", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "备注", value: "remark", sortable: false }
      ],
      desserts: [
        {
          time: "2018.1.1 00:30",
          project: "2018.12下奖金",
          type: "收入",
          amount: 2610,
          balance: 2610,
          remark: "备注信息"
        }
      ]
    };
  }
};
</script>
