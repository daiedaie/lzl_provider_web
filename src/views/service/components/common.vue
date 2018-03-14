<style lang="less">
    @import '../../../styles/editable-table.less';
</style>

<template>
    <div>
        <Table :columns="columnsList" :data="thisTableData"></Table>
    	<number-input :name='dfhdfgdfg'></number-input>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    name: 'modalTable',
    props: {
        columnsList: Array,
        thisTableData:Array,
        //该value指tableData整个表格的数据
        value: Array
    },
    data () {
        return {
            //设定该表的长度
        	columns: [],
            thisTableData: [],
            pageSizeSelected:5
        };
    },

    created () {
        //当该template创建成功时触发
    	this.init();
    },
    methods: {
        init () {
            let vm =this;
            //先将对象string化，再将该string型的对象数据转化为JSON型数据
            this.thisTableData = JSON.parse(JSON.stringify(this.value));
            //该item指每列的属性
            this.columnsList.forEach(item => {
                //可编辑数量
                if (item.refundNumber) {
                    //对该item列进行渲染，即将该列的内容替换为render函数return的内容
                	item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        
                        return h('number-input');
                      };
                    };
                  	//可改变值
                    if (item.refundMoney) {
                        //对该item列进行渲染，即将该列的内容替换为render函数return的内容
                    	item.render = (h, param) => {
                            let currentRowData = this.thisTableData[param.index];
                            let moneyRefund = currentRowData.number * currentRowData.moneyPrice;
                            return  h('label', moneyRefund);
                        };
                    };
                  	//可改变值
                    if (item.refundTaxMoney) {
                        //对该item列进行渲染，即将该列的内容替换为render函数return的内容
                    	item.render = (h, param) => {
                            let currentRowData = this.thisTableData[param.index];
                            let taxMoneyRefund = currentRowData.number * currentRowData.moneyPrice * 0.05;
                            return  h('label', taxMoneyRefund);
                        };
                    };
                });
          },
    },
    //mounted函数和created函数差不多
    mounted() {  
        // 设置表格高度  
        //this.tableHeight = window.innerHeight - this.$refs.refs.$el.offsetTop -TABLE_HEIGHT
    },  
    watch: {
        //监听value值的变化，data参数表示value变化后的内容，该value表示tableData表格数据
    	//一旦表格数据有变，就执行init()函数，重写设定每行状态
        value (data) {
            this.init();
        }
    }
}; 

Vue.component('number-input', {
    render: function(createElement) {
        var self = this;
        return createElement('input', {
            domProps: {
                value: self.name
            },
            on: {
                change: function(event) {
                    alert(event.target.value);
                	//self.$emit('input', event.target.value);
                }
            }
        })
    },
    props: {
        name: String
    }
});
</script>
