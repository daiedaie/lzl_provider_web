<style scoped>
table{
  	width:50%;
}

td{
  	height:70px;
  	padding:15px;
  	text-align:left;
  	vertical-align:bottom;
}

h2{
  	align: center;
}

h3{
  	align: center;
}

#caption{
	float: center;
	font-size: 30px;
	margin: 0 auto; 
	text-align: center;
}

.selectButton{
	 /* width:120px;
	 height:80px; 
	 border:1px solid #F00; */
}
</style>

<template>

	<div>
        <Row :gutter="10">
            <Col>
                <Card :bordered="false" dis-hover>
                    <!-- <Icon type="clipboard" size="15" style="color: #3399ff"></Icon> -->
                        <label id="orderDetail"><b style="color:red;">{{refundType}}</b><b>(请选择商品)</b></label>
                    	<br>
                    <Row class="margin-top-10 margin-bottom-20" style="stripe">
                        <Table border ref="selection" @on-select="onSelect" @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange" :columns="othersColumns" :data="othersColumnsData"></Table>
                    </Row>
                    <Row class="margin-top-10">
                    	<Col span="2"><div class="selectButton" @click="getSelectGoods"><Button type="error" long>选好了</Button></div></Col>
                    	<Col span="22"><Page style="float:right;" :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  @on-change="changepage"></Page></Col>
                    </Row>

                </Card>
            </Col>
            
            <Modal v-model="toConfirm" width="720">
		        <p slot="header" style="color:black;text-align:center">
		            <!-- <Icon type="information-circled"></Icon> -->
		            <span><b style="font-size:20px;">请填写已选商品数量</b></span>
		        </p>
		        <div style="text-align:center">
		        	<modal-table></modal-table>
		            <Row class="margin-top-10">
                    	<Col span="2"><div class="selectButton" @click="getSelectGoods"><Button type="error" long>选好了</Button></div></Col>
                    	<Col span="22"><Page style="float:right;" :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  @on-change="changepage"></Page></Col>
                    </Row>
		            <p>xxx</p>
		            <p>After this task is deleted, the downstream 10 tasks will not be implemented.</p>
		            <p>Will you delete it?</p>
		        </div>
		        <div slot="footer">
		            <Button type="error" size="large" :loading="modal_loading" @click="confirm">提交</Button>
		        </div>
		    </Modal>
		    
        </Row>
    </div>
</template>
<script>
import Vue from 'vue';
import * as ordersGoodsAPI from "../../../api/orders-goods";
import * as modalTable from "./common.vue";
export default {
    name: "refundOthers",
    components:{
    	modalTable
    },
    props: {
    	othersColumns: Array,
    	othersColumnsData: Array,
    	total: [String, Number],
    	pageIndex: [String, Number],
    	refundType: String,
    	
    	loading : Boolean,
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        roles:Array,
        repositories:Array,
        providers:Array,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
    	return {
    		pageSize: 5,
    		goodsSelected:[],
    		
    		idsPerPageList:[
    			{
        			idsStr:''
        		}
    		],
    		idsStrAll: '',
    		
    		toConfirm:false,
    		modal_loading:false,
    		
    		columnsList:[],
    		thisTableData:[]
    	}
    },
    
    methods: {
    	handlePage(num) {
    		this.$emit('toFooterPage', num);
    		console.log("所选择的page：" + num);
    	},
    	//改变页码时也要将idsStrAll传给后台，否则将丢失之前的所有选择
    	changepage(pageIndex) {
    		this.$emit('changePageNum', pageIndex, this.idsStrAll);
    	},
    	
    	getSelectGoods() {
    		this.toConfirm = true;
    		
    	},
    	
    	confirm() {
    		alert("zzzz");	
    		//this.modal_loading = true;
    	},
    	
    	onSelect(selection, row) {
			//alert("选中：" + row.goodsName);
    		//alert("一共选中了多少条数据：" + selection.length);
    	},
    	
    	onSelectCancel(selection, row) {
    		//alert("取消选中：" + row.goodsName);
    		//alert("还剩多少条数据：" + selection.length);
    	},
    	
    	onSelectAll(selection) {
   			let goodsStr = "";
    		selection.forEach(goods => {
    			if(goodsStr === ""){
    				goodsStr += goods.goodsName;
    			}else{
    				goodsStr += "," + goods.goodsName;
    			}
    		});
    		//alert("全部选中的商品名称：" + goodsStr);
    	},
    	
    	onSelectionChange(selection) {
    		let ids = "";
    		selection.forEach(goods => {
    			if(ids === ""){
    				ids += goods.id;
    			}else{
    				ids += "," + goods.id;
    			}
    		});
			
    		console.log("当前页选中的ids::" + ids);
    		//set方法好像是覆盖原有数据		×
    		Vue.set(this.idsPerPageList, this.pageIndex - 1, {
    			idsStr: ids
    		})
    		console.log("Vue.set后的ids::" + this.idsPerPageList[this.pageIndex - 1].idsStr);
    		
    		for(let i=0; i<this.idsPerPageList.length; i++){
    			console.log("idsPerPageList中的每个ids:::::" + this.pageIndex+ "::" + this.idsPerPageList[i].idsStr);
    			if(this.idsPerPageList[i].idsStr != ""){
    				if(this.idsStrAll == ""){
	    				this.idsStrAll += this.idsPerPageList[i].idsStr;
	    			}else{
	    				this.idsStrAll = this.idsStrAll + "," + this.idsPerPageList[i].idsStr;
	    			}
    			}
    		}
    		console.log("------" + this.idsStrAll);
    		this.idsPerPageList.forEach(idsPerPage => {
    			if(idsPerPage.idsStr != ""){
    				if(this.idsStrAll === ""){
	    				this.idsStrAll += idsPerPage.idsStr;
	    			}else{
	    				this.idsStrAll = this.idsStrAll + "," + idsPerPage.idsStr;
	    			}
    			}
    		})
    		console.log("------" + this.idsStrAll);
    		let idsStrAllArray = this.idsStrAll.split(",");
    		//去除idsStrAllArray数组中的重复项
    		let newArr = [];
    		for(let i = 0;i < idsStrAllArray.length;i++){
    		　　 if(newArr.indexOf(idsStrAllArray[i]) == -1){
    		　　　　newArr.push(idsStrAllArray[i]);
    		　　}
    		}
    		this.idsStrAll = newArr.join(",");
    		
    		console.log("所有页面所选中的idsStrAll：" + this.idsStrAll);

    		this.$emit("getSelectStatus", this.idsStrAll);
    		
    	}
    	
    }
}
</script>