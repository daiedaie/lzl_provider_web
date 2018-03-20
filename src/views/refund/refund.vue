<style lang="less">
@import "../../styles/common.less";
@import "./components/table.less";
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
                        <Input v-model="searchOrderSn" style="width:130px" placeholder="请输入订单编号..." class="search-table" />
                        <Select v-model="searchType" style="width:130px" placeholder="请选服务类型..." class="search-table">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-model="searchApplyStatus" style="width:130px" placeholder="请选择售后状态..." class="search-table">
                            <Option v-for="item in applyStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择申请时间..." class="search-table"></DatePicker>
                        
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                   		
                   		<Button type="primary" size="large" @click="exportData" style="float:right"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
                    </Row>
                    
                    <Row class="margin-top-10" style="stripe">
                        <Table :loading="loading" :columns="columns" :data="data"></Table>
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
import Vue from 'vue';
import * as table from "./data/search";
import * as refundAPI from "../../api/refund";
import {formatDate} from '../../libs/date.js';
export default {
  name: "refund",
  data() {
    return {
      loading : true,
      
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      
      searchOrderSn: "",
      searchType: "",
      searchApplyStatus: "",
      
      searchStartDate:"",
      searchEndDate:"",
      
      date:1516000761000,
      
      columns: table.columns,
      data: [],
      
      typeList: table.typeList,
      applyStatusList: table.applyStatusList,
      
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
  filters: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }
  },
  methods: {
    //初始化
    init() {
      this.handleSearch();
    },
    //请求数据
    handleSearch() {
      this.loading = true;
      //request参数处理
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isGetCount: true,
        
        orderSn: this.searchOrderSn,
        type: this.searchType,
        applyStatus: this.searchApplyStatus,
        
        startTime:this.searchStartDate,
        endTime:this.searchEndDate
        
      };
      //这里才是发出的request请求，请求地址在get.函数中
      //response数据处理
      refundAPI.get.r(params).then(res => {
        if(res.data){
            this.data = res.data;
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
      });

      this.loading = false;
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
	       type: this.searchOrderSn,
	       applyStatus: this.searchApplyStatus,
	       
	       startTime:this.searchStartDate,
	       endTime:this.searchEndDate
	    };
	    //response数据处理
	    refundAPI.down.r(params).then(res => {
	  　　var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
	  　　var downloadElement = document.createElement('a');
	  　　var href = window.URL.createObjectURL(blob); //创建下载的链接
	  　　downloadElement.href = href;
	  　　downloadElement.download = '退款退货详细信息.xls'; //下载后文件名
	  　　document.body.appendChild(downloadElement);
	  　　downloadElement.click(); //点击下载
	  　　document.body.removeChild(downloadElement); //下载完成移除元素
	  　　window.URL.revokeObjectURL(href); //释放掉blob对象 
	     instance.defaults.responseType = 'json';
	    });
	},

  },
  
  //页面加载完，在该处发起请求
  mounted() {
    this.init();
  }
};
</script>
