<template>
  <v-container fluid fill-height justify-center>
    <v-layout row wrap>
      <v-flex xs2>
        <v-select
          v-model="query.status"
          @change="orderQuery"
          solo
          :items="items"
          label="订单状态"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs7></v-flex>
      <v-flex xs2>
        <v-text-field solo label="订单号/会员编号" clearable></v-text-field>
      </v-flex>
      <v-flex xs1>
        <v-btn color="primary">查询</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-data-table :headers="headers" :items="orders" hide-actions no-data-text="暂无数据">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.createdAt | formatDate}}</td>
            <td>{{ props.item.userId }}</td>
            <td>{{ props.item.price }}</td>
            <td>{{ props.item.product }}</td>
            <td>{{ props.item.deliveryAddress }}</td>
            <td>{{ props.item.status }}</td>
            <td>
              <a>发货</a> |
              <a>冻结</a> |
              <a>取消</a>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
export default {
  created: function() {
    this.orderQuery();
  },
  data() {
    return {
      items: [
        { text: "未发货", value: "init" },
        { text: "已发货", value: "delivery" },
        { text: "已冻结", value: "freeze" },
        { text: "已取消", value: "cancel" }
      ],
      headers: [
        { text: "订单号", value: "id", sortable: false },
        { text: "时间", value: "createdAt", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "价格", value: "price", sortable: false },
        { text: "产品", value: "product", sortable: false },
        { text: "收货地址", value: "deliveryAddress", sortable: false },
        { text: "订单状态", value: "status", sortable: false },
        { text: "操作", value: "action", sortable: false }
      ],
      props: ["openUserId"],
      orders: [
        // {
        //   time: "2019-01-01 12:30:00",
        //   id: "000001",
        //   userId: "MY100001",
        //   price: 2610,
        //   product: "多功能治疗仪x1",
        //   deliveryAddress: "备注信息",
        //   status: "已提交"
        // }
      ],
      query: {}
    };
  },
  methods: {
    async orderQuery() {
      this.$store.commit("openLoading", true);
      let res = await this.$store.dispatch("orderQuery", {});
      if (!res.err) {
        this.orders = res.res;
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

