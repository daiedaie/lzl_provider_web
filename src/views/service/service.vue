<style lang="less" scoped>
@import "../../styles/common.less";
@import "../../styles/table.less";
#orderDetail{
	font-size:20px;
}
.page{
	/* float:right; */
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
                    <!-- <Row class="margin-top-10">
                        <Page style="float:right;" :total="total" show-elevator :page-size-opts='pageSizeOpts' :page-size='pageSize' :current='pageIndex' class="page" show-total  @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row> -->
                    <Row class="margin-top-10" style="stripe">
	                    <div style="width:auto;height:auto">								<!-- others-columns为订单中商品的字段，others-columns-data为订单商品的数据 -->
		                    <p :is="footerContent" @getSelectStatus="getSelectStatus" @toFooterPage="setFooterPage" @changePageNum="changepage" :refund-type="refundType" :total="total" :pageIndex="pageIndex" :others-columns="othersColumns" :others-columns-data="othersColumnsData"></p>
	                    </div>
                    </Row>
                    
                    
                </Card>
                
            </Col>
            
        </Row>
    </div>
</template>

<script>
import Vue from 'vue';
import * as table from "./data/search";
import refundChoices from "./components/refund-choices.vue";
import refundMoney from "./components/refund-money.vue";
import refundOthers from "./components/refund-others.vue";
import instance from '../../api/index';
import * as providerOrdersAPI from "../../api/provider-orders";
import * as ordersGoodsAPI from "../../api/orders-goods";

export default {	
	name: "service",
	components: {
		refundChoices,
		refundMoney,
		refundOthers
	},
	data() {
		return {
			id: "xx",
			value:[],
			
			footerContent: 'refund-choices',
			
			total: 0,
		    pageIndex: 1,
		    pageSize: 5,
		   
		    refundType: '',
		    
		    orderSn:0,
		    
		    orderRefundColumns: table.orderRefundColumns,
		    orderRefundData: [],
		    
		    othersColumns: table.othersColumns,
		    othersColumnsData:[],
		    
		    idsStrAll: ''
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
	            this.othersColumnsData = res.data
	        }else{
	            this.othersColumnsData = [];
	            this.pageIndex=1;
	        }
	        this.total = parseInt(res.headers.total);
	      });
	      
	      providerOrdersAPI.get.r(params2).then(res => {
	        if(res.data){
	            this.orderRefundData = res.data
	        }else{
	            this.orderRefundData = [];
	        }
	      });
	    },
	    //更换底端显示
	    setFooterPage(num) {
	    	if(num == '1'){
	    		this.refundType = "退款服务";
	    		this.$router.push({ name: 'refund-money', params: { 'orderSn': this.orderSn }});
	    	}else if(num == '2' || num == '3' || num == '4'){
	    		this.$router.push({ name: 'refund-others', params: { 'num': num, 'orderSn': this.orderSn }});
	    	}
	    },
	    
	    getSelectStatus(idsStrAll) {
	    	console.log("进入父组件的getSelectStatus方法，idsStrAll参数：" + idsStrAll);
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
	    changepage(index, idsAll) {
	      //alert("进入父组件，并将页面改变为：" + index);
	      this.pageIndex = index;
	      this.idsStrAll = idsAll;
	      this.handleSearch();
	    },
	},
	
	watch: {
		//当只有一个参数时，表示改变后的值
		footerContent (newVal, preVal) {
			console.log('改变之后的值:' + newVal + ';改变之前的值:' + preVal);
        }
    },
	mounted() {
    	this.orderSn = this.$route.params.orderSn;
    	this.init();
  	} 
}
</script>