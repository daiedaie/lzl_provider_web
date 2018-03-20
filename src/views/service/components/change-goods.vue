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
</style>

<template>
	<table>
		<tr>
			<td><Button @click="handlePage(1)" type="success" long>仅退款</Button></td>
			<td><Button @click="handlePage(2)" type="error" long>仅退货</Button></td>
		</tr>
		<tr>
			<td><Button @click="handlePage(3)" type="primary" long>仅换货</Button></td>
			<td><Button @click="handlePage(4)" type="error" long>退款退货</Button></td>
		</tr>
	</table>
    
</template>
<script>
import Vue from 'vue';

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
    	}
    }
}
</script>