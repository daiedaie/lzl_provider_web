<style lang="less">
@import "../../../styles/common.less";
@import "../../../styles/table.less";
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
                        <Input v-model="searchOrderSn" placeholder="请输入订单编号" class="search-table" />
                        <Select v-model="searchOrderStatus" placeholder="请选择订单状态" class="search-table">
                            <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择下单时间" class="search-table"></DatePicker>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table :loading="loading" @on-check="toCheck" v-model="data" :columns-list="columns" :provider="provider"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>
                    
                </Card>
                
            </Col>
        </Row>
        <Modal v-model="goToCheck" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <span style="font-size:20px;">审核信息</span>
	        </p>
	        <div style="text-align:center">
	            <Form :model="formItem" :label-width="100">
			        <FormItem label="是否通过审核：">
			            <Select v-model="formItem.orderStatus" placeholder="请选择">
			                <Option value="1">通过</Option>
			                <Option value="0">未通过</Option>
			                <Option value="-1">待审核</Option>
			            </Select>
			        </FormItem>
			        <FormItem v-if="this.formItem.orderStatus != null && this.formItem.orderStatus == 1" label="供应商：">
			            <Select v-model="formItem.providerId" placeholder="请选择">
			                <Option v-for="item in providerList" :value="item.providerId" :key="item.providerId">{{item.providerName}}</Option>
			                <Option value="0">附近实仓</Option>
			            </Select>
			        </FormItem>
			    </Form>
	        </div>
	        <div slot="footer">
	            <Button type="error" long  @click="check">确认</Button>
	        </div>
	    </Modal>
    </div>
</template>

<script>
import * as table from "./data/check-orders";
import instance from '../../../api/index';
import canEditTable from '../../my-components/table-edit/canEditTable.vue';
import * as providerOrdersAPI from "../../../api/provider-orders";
import * as api from "../../../js/api/request.js";
export default {
  name: "check-orders",
  components: {
      canEditTable
  },
  data() {
    return {
      loading:true,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      searchOrderSn: "",
      searchOrderStatus: "",
      searchStartDate:"",
      searchEndDate:"",
      columns: table.columns,
      data: [],
      
      provider:[{providerId:"", providerName:""}],
      providerList:[],
      
      formItem:{},
      goToCheck:false,
      
      orderStatusList: [
            {
                value: '',
                label: '全部'
            },
            {
                value: -1,
                label: '待审核'
            },
            {
                value: 0,
                label: '未通过'
            },
            {
                value: 1,
                label: '已通过'
            },
            {
                value: 7,
                label: '已完成'
            },
            {
                value: 8,
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
      this.loading = true;
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
            this.data = res.data;
            this.handleGetProvider();
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
        this.loading = false;
        console.log("总记录数:" + res.headers.total);
      });
      
      api.get.request(URL_PROVIDERS).then(res => {
  		if(res.data){
  			this.providerList = res.data;
  		}else{
  			this.providerList = [];
  		}
  	  })
    },
  	//查询Provider
    handleGetProvider(){
    	this.provider = [];
    	let idsStr = "";
    	for(let i=0; i< this.data.length; i++){
    		let providerId = this.data[i].providerId;
    		if(providerId != -1 && providerId != 0){
    			idsStr = idsStr + providerId + ",";
    		}else if(providerId == -1){
    			this.provider.push({providerId:providerId, providerName:"未选择"});
    		}else if(providerId == 0){
    			this.provider.push({providerId:providerId, providerName:"附近实仓"});
    		}
    	}
    	api.get.request(URL_PROVIDERS, {idsStr: idsStr}).then(res => {
    		if(res.data){
    			let temp = res.data;
    			for(let i=0; i<temp.length; i++){
    				this.provider.push({providerId:temp[i].providerId, providerName:temp[i].providerName});
    			}
    		}
    	})
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
    
    toCheck(val,index) {
    	this.formItem = {};
    	this.formItem = val[index];
    	this.goToCheck = true;
    },
    
    check () {
    	api.put.request(URL_PROVIDERORDERS, this.formItem).then(res => {
    		this.handleSearch();
        });
    	this.goToCheck = false;
    },
    
  },
  mounted() {
	 this.init();
  }
};
</script>
