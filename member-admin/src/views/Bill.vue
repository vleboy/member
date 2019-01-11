<template>
  <v-container fluid fill-height justify-center>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="desserts" hide-actions no-data-text="暂无数据">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.createdAt }}</td>
          <td>{{ props.item.project }}</td>
          <td>{{ props.item.userId }}</td>
          <td>{{ props.item.remark }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.amount }}</td>
          <td>{{ props.item.balance }}</td>
        </template>
      </v-data-table>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "时间", value: "createdAt", sortable: false },
        { text: "明细", value: "project", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "备注", value: "remark", sortable: false },
        { text: "收支", value: "type", sortable: false },
        { text: "金额", value: "amount", sortable: false },
        { text: "余额", value: "balance", sortable: false }
      ],
      desserts: [
        {
          createdAt: "2019-01-01 12:30:00",
          project: "会员注册",
          userId: "MY100001",
          userId: "MY10001",
          remark: "",
          type: "收",
          amount: 1000,
          balance: 1000.0
        }
      ]
    };
  }
};
</script>

