<template>
  <v-container fluid fill-height justify-center>
    <v-flex xs12>
      <v-data-table :headers="headers" :items="desserts" hide-actions>
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.createAt }}</td>
          <td>{{ props.item.address }}</td>
          <td>{{ props.item.mobile }}</td>
          <td>{{ props.item.idnumber }}</td>
          <td>{{ props.item.wechatnumber }}</td>
          <td>{{ props.item.iswechatpay }}</td>
          <td>{{ props.item.bank }}</td>
          <td>{{ props.item.banknumber }}</td>
          <td>{{ props.item.level }}</td>
          <td>{{ props.item.placenumber }}</td>
          <td>{{ props.item.recommendnumber }}</td>
          <td>{{ props.item.balance }}</td>
          <td>
            <a>改</a> |
            <a>冻</a> |
            <a>删</a>
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
        { text: "编号", value: "id", sortable: false },
        { text: "姓名", value: "username", sortable: false },
        { text: "注册时间", value: "createAt", sortable: false },
        { text: "居住地", value: "address", sortable: false },
        { text: "手机", value: "mobile", sortable: false },
        { text: "证件号", value: "idnumber", sortable: false },
        { text: "微信号", value: "wechatnumber", sortable: false },
        { text: "微信收款", value: "iswechatpay", sortable: false },
        { text: "银行", value: "bank", sortable: false },
        { text: "卡号", value: "banknumber", sortable: false },
        { text: "级别", value: "level", sortable: false },
        { text: "安置编号", value: "placenumber", sortable: false },
        { text: "推荐编号", value: "recommendnumber", sortable: false },
        { text: "余额", value: "balance", sortable: false },
        { text: "操作", value: "action", sortable: false }
      ],
      desserts: [
        {
          id: "000001",
          username: "张三",
          createAt: "2019-01-01 12:30:00",
          address: "四川绵阳",
          mobile: "18780004427",
          idnumber: "878765444567898765",
          wechatnumber: "we998",
          iswechatpay: "是",
          bank: "工商银行",
          banknumber: "213123123123123123",
          level: "普通会员",
          placenumber: "MY001",
          recommendnumber: "MY001",
          balance: "1000.00"
        }
      ]
    };
  }
};
</script>

