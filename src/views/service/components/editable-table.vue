<style lang="less">
    @import '../../../styles/common.less';
    @import './table.less';
</style>

<template>
    <div>
        <can-edit-table 
            v-model="editInlineAndCellData" 
            @on-cell-change="handleCellChange" 
            @on-change="handleChange"
            @on-delete="handleDel"  
            :hover-show="true" 
            :editIncell="true" 
            :columns-list="editInlineAndCellColumn"
        ></can-edit-table>
    </div>
</template>

<script>
import canEditTable from './components/canEditTable.vue';
export default {
    name: 'editable-table',
    props:{
    	editInlineAndCellData:Array,
    	editInlineAndCellColumn:Array
    },
    components: {
        canEditTable
    },
    methods: {
        handleDel (val, index) {
            this.$Message.success('删除了第' + (index + 1) + '行数据');
        },
        handleCellChange (val, index, key) {
            this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
        },
        handleChange (val, index) {
            this.$Message.success('修改了第' + (index + 1) + '行数据');
        }
    },
};
</script>
