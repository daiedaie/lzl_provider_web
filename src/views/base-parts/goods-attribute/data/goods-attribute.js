export const columns =[
    {
        key: 'goodsAttributeName',
        title: '商品性质名称'
    },
    {
        key: 'goodsTypeId',
        title: '物品所属类别',
        align: "center"
    },
    {
    	key: 'costCalculateMethod',
    	title: '成本计算方法',
    	align: "center"
    },
    {
    	key: 'taxRateId',
    	title: '税率名称',
    	align: "center"
    },
    {
    	key: 'status',
    	title: '状态',
    	align: "center"
    },
    {
        key: 'createTime',
        title: '创建时间',
        align: "center",
    },
    {
    	key: 'modifyTime',
    	title: '修改时间',
    	align: "center",
    },
    {
        title: '操作',
        align: 'center',
        width: 100,
        key: 'deal',
        deal: ['编辑']
    }
];

export const statusList = [
	{value: '',label: '全部'},
    {value: '1' ,label: '正常使用'},
    {value: '2' ,label: '已废弃'}
];

export const calculateMethodList = [
	{value: '',label: '全部'},
	{value: '1' ,label: '全月平均'},
	{value: '2' ,label: '移动平均'},
	{value: '3' ,label: '先进先出'},
	{value: '4' ,label: '后进先出'},
	{value: '5' ,label: '个别计价'},
	{value: '6' ,label: '计划价'},
	{value: '7' ,label: '实际差价率'},
	{value: '8' ,label: '最后进价'}
];
