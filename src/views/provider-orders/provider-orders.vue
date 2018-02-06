<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col>
                <Card>
                    <p slot="title">
                        <Icon type="mouse"></Icon>
                        点击搜索进行搜索
                    </p>
                    <Row>
                        <Input v-model="searchOrderSn" placeholder="请输入订单编号..." class="search-table" />
                        <Select v-model="searchOrderStatus" placeholder="请选择订单状态..." class="search-table">
                            <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择下单时间..." class="search-table"></DatePicker>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button type="primary" size="large" @click="exportData" style="float:right"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
                    </Row>
                    <!--<Row class="margin-top-10 searchable-table-con1">-->
                    <Row class="margin-top-10" style="stripe">
                        <Table :columns="columns" :data="data" ref="tableCsv"></Table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>
                    
                </Card>
                
            </Col>
            
        </Row>
    </div>
</template>

<script>
import * as table from "./data/search";
import instance from '../../api/index';
import * as providerOrdersAPI from "../../api/provider-orders";
export default {
  name: "provider-orders",
  data() {
    return {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      searchOrderSn: "",
      searchOrderStatus: "",
      searchStartDate:"",
      searchEndDate:"",
      columns: table.columns,
      data: [],
      orderStatusList: [
            {
                value: '',
                label: '全部'
            },
            {
                value: 6,
                label: '已完成'
            },
            {
                value: '8',
                label: '进行中'
            },
            {
                value: 7,
                label: '已取消'
            }
        ],
        dataSelect: {
            shortcuts: [
                {
                    text: '一周',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                },
                {
                    text: '一个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    }
                },
                {
                    text: '三个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end];
                    }
                }
            ]
        }
    };
  },
  methods: {
    //初始化
    init() {
      this.handleSearch();
    },
    //请求数据
    handleSearch() {
      //request参数处理
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isGetCount: true,
        orderSn: this.searchOrderSn,
        orderStatus: this.searchOrderStatus,
        startTime:this.searchStartDate,
        endTime:this.searchEndDate
      };
      console.log(params);
      //response数据处理
      providerOrdersAPI.get.r(params).then(res => {
        if(res.data){
            this.data = res.data
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
        console.log("总记录数:" + res.headers.total);
      });
    },
    //切换页码
    changepage(index) {
      this.pageIndex = index;
      this.handleSearch();
    },
    //切换页码大小
    changeSize(size) {
      this.pageSize = size;
      this.handleSearch();
    },
    //选择时间
    getDate(value) {
        this.searchStartDate = value[0];
        this.searchEndDate = value[1];
    },
    exportData (type) {
        // this.$refs.tableCsv.exportCsv({
        //     filename: '数据导出',
        //     original: false
        // });
      //request参数处理
      let params = {
        orderSn: this.searchOrderSn,
        sellerMobile: this.searchSellerMobile,
        orderState: this.searchOrderState,
        startTime:this.searchStartDate,
        endTime:this.searchEndDate
      };
      //response数据处理
      orderAPI.down.r(params).then(res => {
    　　var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
    　　var downloadElement = document.createElement('a');
    　　var href = window.URL.createObjectURL(blob); //创建下载的链接
    　　downloadElement.href = href;
    　　downloadElement.download = '订单.xls'; //下载后文件名
    　　document.body.appendChild(downloadElement);
    　　downloadElement.click(); //点击下载
    　　document.body.removeChild(downloadElement); //下载完成移除元素
    　　window.URL.revokeObjectURL(href); //释放掉blob对象 
       instance.defaults.responseType = 'json';
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
