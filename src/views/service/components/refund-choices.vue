<style scoped>
table{
  	width:40%;
}

td{
  	height:70px;
  	padding:15px;
  	text-align:left;
  	vertical-align:bottom;
}

.refundChoices{
  	font-size:18px;
}
.imgChoices{
  	width:40px;
  	height:40px;
}
</style>

<template>
	<table>
		<tr>
			<td id="firstTd"><Button @click="handlePage(1)" type="dashed" long>
				<table>
					<tr>
						<td><img class="imgChoices" alt="refundMoney" src="../../../images/refundMoney.png"></td>
						<td>
							<b class="refundChoices">仅退款</b>
							<p>根据供应商约定进行</p>
						</td>
					</tr>
				</table>
			</Button></td>
			
			<td><Button @click="handlePage(2)" type="dashed" long>
				<table>
					<tr>
						<td><img class="imgChoices" alt="refundGoods" src="../../../images/refundGoods.png"></td>
						<td>
							<b class="refundChoices">仅退货</b>
							<p>根据供应商约定进行</p>
						</td>
					</tr>
				</table>
			</Button></td>
		</tr>
		<tr>
			<td><Button @click="handlePage(3)" type="dashed" long>
				<table>
					<tr>
						<td><img class="imgChoices" alt="changeGoods" src="../../../images/changeGoods.png"></td>
						<td>
							<b class="refundChoices">仅换货</b>
							<p>根据供应商约定进行</p>
						</td>
					</tr>
				</table>
			</Button></td>
			
			<td><Button @click="handlePage(4)" type="dashed" long>
				<table>
					<tr>
						<td><img class="imgChoices" alt="refundMoneyGoods" src="../../../images/refundMoneyGoods.png"></td>
						<td>
							<b class="refundChoices">退款退货</b>
							<p>根据供应商约定进行</p>
						</td>
					</tr>
				</table>
			</Button></td>
		</tr>
	</table>
    
</template>
<script>
import Vue from 'vue';
import $ from 'jquery';

export default {
    name: "refundChoices",
    props: {
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
    		
    	}
    },
    
    methods: {
    	handlePage(num) {
    		this.$emit('toFooterPage', num);
    		console.log("所选择的page：" + num);
    		console.log($('#firstTd').get(0).tagName);
    	}
    }
}
</script>