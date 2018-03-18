<style></style>
<template>
	<div>
		<Row :gutter="10">
			<Col>
				<Card>
			        <p slot="title">
			            <Icon type="ios-analytics"></Icon>
			            	测试页
			        </p>
			        <Row>
			        	<p :is="testRouter" :others-columns="othersColumns" :others-columns-data="othersColumnsData"></p>
			        </Row>
			    </Card>
			</Col>
		</Row>
	</div>
</template>

<script>
import Vue from "vue";
import $ from "jquery";
import refundMoney from "../service/components/refund-money.vue";
import refundOthers from "../service/components/refund-others.vue";

export default {
	name: "testRouter",
	/* props:{
		othersColumns:Array,
		othersColumnsData:Array
	}, */
	components:{
		refundMoney,
		refundOthers
	},
	
	data() {
		return {
			testRouter: "refund-others",
			
			othersColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
            		key: 'goodsName',
            		title: '商品名称'
            	},
            	{
            		key: 'goodsBrandId',
            		title: '品牌'
            	},
            	{
            		key: 'pic',
            		title: '商品图片'
            	},
            	{
            		key: 'specInfo',
            		title: '规格'
            	},
            	{
            		key: 'goodsCateId',
            		title: '商品分类'
            	},
            	{
            		key: 'moneyPrice',
            		title: '商品单价'
            	},
            	{
            		key: 'number',
            		title: '购买数量'
            	},
            	{
            		key: 'providerId',
            		title: '所属供应商'
            	}
            ],
            othersColumnsData: [
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                },
                {
                	goodsName: 'John Brown',
                	goodsBrandId: 18,
                	pic: 'New York No. 1 Lake Park',
                	specInfo: '2016-10-03',
                	goodsCateId: '2016-10-03',
                	moneyPrice: '2016-10-03',
                	number: '2016-10-03',
                	providerId: '2016-10-03'
                }
            ]
		}
	},
	
	methods:{
		
	}
}
</script>