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
                        <Input v-model="searchOrderSn" placeholder="请输入订单编号..." class="search-table" />
                        <Select v-model="searchOrderStatus" placeholder="请选择订单状态..." class="search-table">
                            <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择下单时间..." class="search-table"></DatePicker>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toPost" style="float:right"><Button type="primary">新增</Button></span>
                        <!-- <Button type="primary" size="large" @click="exportData" style="float:right"><Icon type="ios-download-outline"></Icon> 导出数据</Button> -->
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table :loading="loading" @on-service="toService" v-model="data" :columns-list="columns"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>
                    
                </Card>
                
            </Col>
        </Row>
        <Modal :title="postOrPutTitle" v-model="modalPostOrPut" :styles="{top: '20px'}" class-name="vertical-center-modal">         
        	<p slot="header" style="color:#f60;text-align:center">
	            <Icon type="android-cart" size="18" style="color: #3399ff"></Icon>
	            <span style="font-size:18px;">采购清单</span>
	        </p>
	        <div style="text-align:center">
	            <Form :model="formItem" :label-width="0" label-position="left">
	        		<FormItem>
			    		<Row :gutter="16">
			    			<Col span="11" style="text-align: left">商品名称</Col>
			    			<Col span="5" style="text-align: left">单价(￥)</Col>
			    			<Col span="4" style="text-align: left">数量</Col>
			    		</Row><!-- <Input v-model="item.goodsName" readonly placeholder="请输入商品名称..."/> -->
			    		<div v-for = "(item,index) in ordersGoods">  
				    		<Row :gutter="16">
				                <!-- 之所以新增时也显示一行，是因为 fullReductionContent的初始中有一个空对象-->
				                <Col span="11" style="text-align: left"><Cascader v-model="item.goodsName" @on-change="onCascaderChange" :data="cascaderGoodsData" trigger="hover" :render-format="format"></Cascader></Col>
				                <Col span="5" style="text-align: left"><Input v-model="item.moneyPrice" readonly/></Col>
				                <Col span="4" style="text-align: left"><InputNumber @on-change="onInputNumberChange" :max="10" :min="1" v-model="item.number"></InputNumber></Col>
					            <Col v-if="index == 0" span="4" style="text-align: left"><Button type="primary" @click="handleAdd" shape="circle" size="small">添加商品</Button></Col>
				            	<Col v-if="index != 0" span="4" style="text-align: left"><Button type="text" @click="handleRemove(index)" shape="circle" size="small" icon="close-circled"></Button></Col>
				            </Row>
			            </div>
			    	</FormItem>
			    	<FormItem>
			    		<Row>
			    			<Col span="2" style="text-align: left">发票：</Col>
			    			<Col span="4"  style="text-align: left">
			    				<Select v-model="invoiceStatus" placeholder="请选择">
					    			<Option v-for="item in invoiceStatusList" :value="item.value" :key="item.value">{{item.label}}</Option>
					    		</Select>
			    			</Col>
			    			<Col span="3" offset="10" style="text-align: right">总金额：￥</Col>
			    			<Col span="2" style="text-align: left">{{this.totalMoney}}</Col>
			    		</Row>
			    	</FormItem>
			   	</Form>
	        </div>
	        <div slot="footer">
	            <Button type="error" @click="postCart">确认</Button>
	        </div>
        </Modal>
        <Modal v-model="refundTypeModal" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <span style="font-size:16px;">请选售后服务类型</span>
	        </p>
	        <div style="text-align:center;height:auto">
                <RadioGroup v-model="refundType" @on-change="radioGroupOnChange" type="button" size="large">
			        <Row>
			            <Col span="11" style="text-align: left"><Radio class="radioClass" label="1">仅退款</Radio></Col>
				        <Col span="11" offset="2" style="text-align: left"><Radio class="radioClass" label="2">仅退货</Radio></Col>
				    </Row>
			        <br>
			        <Row>
			            <Col span="11" style="text-align: left"><Radio class="radioClass" label="3">临期换货</Radio></Col>
				        <Col span="11" offset="2" style="text-align: left"><Radio class="radioClass" label="4">退款退货</Radio></Col>
				    </Row>
			    </RadioGroup>
	        </div>
	        <div slot="footer">
	            <Button type="error" long @click="service">确定</Button>
	        </div>
	    </Modal>
    </div>
</template>

<script>
import Vue from 'vue';
import * as table from "./data/search";
import instance from '../../../api/index';
import canEditTable from '../../my-components/table-edit/canEditTable.vue';
import * as providerOrdersAPI from "../../../api/provider-orders";
import * as api from "../../../js/api/request.js";
export default {
  name: "provider-orders",
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
      modalPostOrPut:false,
      postOrPutTitle:"",
      
      refundTypeModal:false,
      refundType:"",
      
      cascaderGoodsData:[],
      
      formItem:{},
      ordersGoods:[
    	  {
    		  goodsName:[],
    		  moneyPrice:'',
    		  number:0
    	  }
      ],
      invoiceStatus:'',
      totalMoney:"",
      
      invoiceStatusList: [
          {
              value: 1,
              label: '需要'
          },
          {
              value: 0,
              label: '不需要'
          }
      ],
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
    format (labels, selectedData) {
    	const index = labels.length - 1;
        const data = selectedData[index] || false;
        if (data && data.label) {
            return labels[index];
        }
        return labels[index];
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
      
      this.handleCascader();
      //response数据处理
      api.get.request(URL_PROVIDERORDERS, params).then(res => {
        if(res.data){
            this.data = res.data;
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
        this.loading = false;
      });
    },
    toPost() {
    	this.modalPostOrPut =true;
    },
    postCart() {
    	//let ordersGoods = JSON.stringify(this.ordersGoods);
    	let params = {
    		"ordersGoods":this.ordersGoods,
    		"invoiceStatus":this.invoiceStatus,
    		"totalMoney":this.totalMoney
    	};
    	let codconfirm_remark = JSON.stringify(params);
    	api.post.request(URL_PROVIDERORDERS, {"codconfirm_remark" : codconfirm_remark}).then(res => {
    		this.handleSearch();
        });
    	this.modalPostOrPut =false;
    },
  	//添加购买商品
    handleAdd() {
    	if(this.ordersGoods.length < 10){
	    	this.ordersGoods.push({
	    		goodsName:"",
	    		moneyPrice:"",
	    		number:""
	        });
    	}
    },
    //去除购买商品
    handleRemove(index) {
    	this.ordersGoods.splice(index,1);
    },
  	//将售后服务类型设置到this.refundType中
    radioGroupOnChange(radioLabel) {
    	this.refundType = radioLabel;
    },
    //切换页码
    changepage(index) {
      this.pageIndex = index;
      this.handleSearch();
    },
  	//请求级联下拉框数据 
    handleCascader() {
      api.get.request(URL_GOODSCATE, {cascaderGoodsCate:1, cascaderGoods:2}).then(res => {
        this.cascaderGoodsData = res.data;
        for(let i=0; i<res.data.length; i++){
	        for(let j=0; j<res.data[i].children.length; j++){
	        	if(res.data[i].children[j].goodsChildren != null && res.data[i].children[j].goodsChildren.length > 0){
		        	this.cascaderGoodsData[i].children[j].children = res.data[i].children[j].goodsChildren;
		        }
	        }
        }
      });
    },
    onCascaderChange(value, selectedData) {
    	let goodsId = value[value.length - 1];
    	//let goodsId = this.ordersGoods[index].goodsName.toString().substring(this.ordersGoods[index].goodsName.toString().lastIndexOf(",") + 1); //加1 很重要
    	let goods = [];
    	let index = "";
    	api.get.request(URL_GOODS, {goodsId : goodsId}).then(res => {
            if(res.data){
                goods = res.data;
            }else{
            	goods = [];
            }
        });
    	//alert(this.ordersGoods.length);//1  该1是默认的初始化值  × 不是初始化值，此处v-model已将其赋值
   		//不延时，有时获取不到goods
    	setTimeout(() => {
   				for(let i=0; i<this.ordersGoods.length; i++){
   		       		if(goodsId == this.ordersGoods[i].goodsName.toString().substring(this.ordersGoods[i].goodsName.toString().lastIndexOf(",") + 1)){
   		       			index = i;break;
   		       		}
   		       	}
   		    	//alert(this.ordersGoods[0].goodsName).toString();//10,1021,19
   		    	Vue.set(this.ordersGoods, index, {
   		    		goodsName:this.ordersGoods[index].goodsName, //此处v-model已将其赋值
   		    		moneyPrice:goods[0].price,
   		    		number:1
   		    	})
   		   		//初始添加时更新总金额
   		    	let temp = 0;
   		    	for(let i=0; i<this.ordersGoods.length; i++){
   		    		temp += this.ordersGoods[i].moneyPrice * this.ordersGoods[i].number;
   		    	}
   		    	this.totalMoney = temp;
   		},500); 
    	
    },
    //时刻更新总金额
    onInputNumberChange() {
    	let temp = 0;
    	for(let i=0; i<this.ordersGoods.length; i++){
    		temp += this.ordersGoods[i].moneyPrice * this.ordersGoods[i].number;
    	}
    	this.totalMoney = temp;
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
  	//选择售后服务类型
    toService(val,index) {
    	this.formItem = {};
        this.formItem = val[index];
        this.refundTypeModal = true;
    },
    //售后服务
    service () {
      this.formItem.active = this.refundType;
      api.put.request(URL_PROVIDERORDERS, this.formItem).then(res => {
    	  this.handleSearch();
      });
      this.refundTypeModal = false;
    },
    
    exportData (type) {
        // this.$refs.tableCsv.exportCsv({
        //     filename: '数据导出',
        //     original: false
        // });
      //request参数处理
      let params = {
        orderSn: this.searchOrderSn,
        //sellerMobile: this.searchSellerMobile,
        orderStatus: this.searchOrderStatus,
        startTime:this.searchStartDate,
        endTime:this.searchEndDate
      };
      //response数据处理
      providerOrdersAPI.down.r(params).then(res => {
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
