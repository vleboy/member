<template>
  <v-container fluid fill-height justify-center>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="desserts" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.time }}</td>
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "订单号", value: "id", sortable: false },
        { text: "时间", value: "time", sortable: false },
        { text: "会员编号", value: "userId", sortable: false },
        { text: "价格", value: "price", sortable: false },
        { text: "产品", value: "product", sortable: false },
        { text: "收货地址", value: "deliveryAddress", sortable: false },
        { text: "订单状态", value: "status", sortable: false },
        { text: "操作", value: "action", sortable: false }
      ],
      desserts: [
        {
          time: "2019-01-01 12:30:00",
          id: "000001",
          userId: "MY100001",
          price: 2610,
          product: "多功能治疗仪x1",
          deliveryAddress: "备注信息",
          status: "已提交"
        }
      ]
    };
  }
};
</script>

