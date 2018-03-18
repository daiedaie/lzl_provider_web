<style lang="less" scoped>
@import "../../../styles/common.less";
@import "../../../styles/table.less";
table{
  width:50%;
}

td{
  height:70px;
  padding:15px;
  text-align:left;
  vertical-align:bottom;
}

#orderDetail{
	font-size:20px;
}

#choices{
	/* font-size:17px; */
	/* color:red; */
}
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col>
                <Card :bordered="false" dis-hover>
                    <Icon type="clipboard" size="20" style="color: #3399ff"></Icon>
                        <label id="orderDetail"><b>此订单详情</b></label>
                    	<br>
                    <Row class="margin-top-10 margin-bottom-20" style="stripe">
                        <Table :columns="orderRefundColumns" :data="orderRefundData" ref="tableCsv"></Table>
                    </Row>
                    
                    <Row class="margin-top-10" style="stripe">
	                    <template>
							<div>
						        <Row :gutter="10">
						            <Col>
						                <Card :bordered="false" dis-hover>
						                    <!-- <Icon type="clipboard" size="15" style="color: #3399ff"></Icon> -->
						                        <label id="choices"><b style="color:red;">{{ refundType }}</b><b>(请选择商品)</b></label>
						                    	<br>
						                    <Row class="margin-top-10 margin-bottom-20" style="stripe">
						                        <Table border ref="selection" @on-selection-change="onSelectionChange" :columns="othersColumns" :data="othersColumnsData"></Table>
						                    </Row>
						                    <Row class="margin-top-10">
						                    	<Col span="2"><div class="selectButton" @click="getSelectGoods"><Button type="error" long>选好了</Button></div></Col>
						                    	<Col span="22"><Page style="float:right;" :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  @on-change="changepage"></Page></Col>
						                    </Row>
						
						                </Card>
						            </Col>
						            
						        </Row>
						    </div>
						</template>
                    </Row>
                    
                </Card>
            </Col>
        </Row>
        
        <Modal v-model="toConfirm" width="820">
	      <p slot="header" style="color:black;text-align:center">
	          <!-- <Icon type="information-circled"></Icon> -->
	          <span><b style="font-size:20px;">请填写已选商品数量</b></span>
	      </p> 
	      <div style="text-align:center">
	          	<Row class="margin-top-0 margin-bottom-1">
	          		<modal-table :edit-inline-and-cell-data='modalTableData' :edit-inline-and-cell-column='modalColumnsList'></modal-table>
	          	</Row>
	      </div>
	      <div slot="footer">
	      	  <Row class="margin-top-0">
	          		<Col span="22"><Page style="float:left;" :total="totalSelected" :page-size='pageSizeSelected' :current='pageIndexSelected' class="page"  @on-change="changepageSelected"></Page></Col>
	          		<Col span="2"><Button type="primary" size="large" :loading="modal_loading" @click="confirm">提交</Button></Col>
	          </Row>
	      </div> 
	  </Modal>
        
    </div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import * as table from "../data/search";
import instance from '../../../api/index';
import * as providerOrdersAPI from "../../../api/provider-orders";
import * as ordersGoodsAPI from "../../../api/orders-goods";
import modalTable from "./editable-table.vue";

export default {
    name: "refundGoods",
    components:{
    	modalTable
    },
    data() {
    	return {
    		total: 0,
		    pageIndex: 1,
		    pageSize: 5,
    		
		    totalSelected: 0,
		    pageIndexSelected: 1,
		    pageSizeSelected: 5,
		    
			goodsSelected:[],
    		
    		idsPerPageList:[
    			{
        			idsStr:''
        		}
    		],
    		idsStrAll: '',
    		
    		toConfirm:false,
    		modal_loading:false,
    		
		    orderSn:0,
		    
		    orderRefundColumns: table.orderRefundColumns,
		    orderRefundData: [],
		    
		    othersColumns: table.othersColumns,
		    othersColumnsData:[],
		    refundType: '',
		    
		    modalColumnsList:table.modalColumns,
		    modalTableData:[]
    	}
    },
    
    methods: {
    	//初始化
	    init() {
	      this.handleSearch();
	    },
	    //请求数据
	    handleSearch() {
	      //request参数处理
	      let params1 = {
	        pageIndex: this.pageIndex,
	        pageSize: this.pageSize,
	        isGetCount: true,
	        ordersSn: this.orderSn,
	        idsStrAll: this.idsStrAll
	      };
	      let params2 = {
	        orderSn: this.orderSn
	      };
	      
	      //response数据处理
	      ordersGoodsAPI.get.r(params1).then(res => {
	        if(res.data){
	            this.othersColumnsData = res.data;
	        }else{
	            this.othersColumnsData = [];
	            this.pageIndex=1;
	        }
	        this.total = parseInt(res.headers.total);
	      });
	      
	      providerOrdersAPI.get.r(params2).then(res => {
	        if(res.data){
	            this.orderRefundData = res.data;
	        }else{
	            this.orderRefundData = [];
	        }
	      });
	    },
	    
	    getSelectGoods() {
	    	this.ordersGoodsSelectedSearch();
	    	this.toConfirm = true;
    	},
    	confirm() {
    		this.$Message.success('操作成功！');
    		this.toConfirm = false;
    		//this.modal_loading = true;
    	},
    	//当选择发生改变时，获取选中的id组成的字符串idsStrAll
    	onSelectionChange(selection) {
    		let ids = "";
    		selection.forEach(goods => {
    			if(ids === ""){
    				ids += goods.id;
    			}else{
    				ids += "," + goods.id;
    			}
    		});
			
    		Vue.set(this.idsPerPageList, this.pageIndex - 1, {
    			idsStr: ids
    		})
			//this.idsStrAll = "";就这行代码太重要了，调了好久都没发现，于是放弃该种方式，在使用其他方法的过程中才想到是这里出的问题
    		//赋值前先将原有的数据全部清零
			this.idsStrAll = "";
    		for(let i=0; i<this.idsPerPageList.length; i++){
    			console.log("idsPerPageList中的每个ids:::::" + (i + 1) + "页::" + this.idsPerPageList[i].idsStr);
    			if(this.idsPerPageList[i].idsStr != ""){
    				if(this.idsStrAll == ""){
	    				this.idsStrAll = this.idsPerPageList[i].idsStr;
	    			}else{
	    				this.idsStrAll = this.idsStrAll + "," + this.idsPerPageList[i].idsStr;
	    			}
    			}
    		}

    		console.log("所有页面所选中的idsStrAll：" + this.idsStrAll);
    		this.getSelectStatus(this.idsStrAll);
    	},
    	//当选择发生改变时，调用该方法到后台处理选中的数据，将其_checked设置为true
	    getSelectStatus(idsStrAll) {
	    	let params = {
	   	        pageIndex: this.pageIndex,
	   	        pageSize: this.pageSize,
	   	        isGetCount: true,
	   	        ordersSn: this.orderSn,
	   	     	idsStrAll:idsStrAll
	   	    };
	    	ordersGoodsAPI.get.r(params).then(res => {
		        if(res.data){
		            this.othersColumnsData = res.data;
		        }else{
		            this.othersColumnsData = [];
		            this.pageIndex=1;
		        }
		        this.total = parseInt(res.headers.total);
		    });
		    
	    },
	    //切换页码
	    changepage(index) {
	      	this.pageIndex = index;
	      	this.handleSearch();
	    },
	    changepageSelected(index){
	    	this.pageIndexSelected = index;
	    	this.ordersGoodsSelectedSearch();
	    },
	    //查询选中的ordersGoods
	    ordersGoodsSelectedSearch(){
	    	let params = {
	   	        pageIndex: this.pageIndexSelected,
	   	        pageSize: this.pageSizeSelected,
	   	        isGetCount: true,
	   	        ordersSn: this.orderSn,
	   	        idsStrAll: this.idsStrAll,
	   	        flag:'modalSelectedShow'
    	    };
	    	
	    	ordersGoodsAPI.get.r(params).then(res => {
		        if(res.data){
		            this.modalTableData = res.data;
		        }else{
		            this.modalTableData = [];
		            this.pageIndexSelected=1;
		        }
		        this.totalSelected = parseInt(res.headers.total);
		    });
	    	console.log("modalTableData:" + this.modalTableData + ",totalSelected:" + this.totalSelected);
	    },
	    
	    onEdit(currentRowData){
	    	alert("ccc");
	    }
	},
	
	watch: {
		//当只有一个参数时，表示改变后的值
		idsStrAll (newVal, preVal) {
			console.log('改变之后的值:' + newVal + ';改变之前的值:' + preVal);
        }
    },
    
    mounted() {
    	this.orderSn = this.$route.params.orderSn;
    	let num = this.$route.params.num;
    	
    	if(num == '2'){
			this.refundType = "退货服务";
		}
		if(num == '3'){
			this.refundType = "换货服务";
		}
		if(num == '4'){
			this.refundType = "退款退货服务";
		}
		
    	this.init();
  	} 
}
</script>