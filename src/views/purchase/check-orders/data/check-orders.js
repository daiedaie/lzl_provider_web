export const columns = [
	{
        key: 'orderSn',
        title: '订单号'
    },
    {
        key: 'sellerName',
        title: '商家名称'
    },
    {
        key: 'mobile',
        title: '商家电话'
    },
    {
        key: 'payTime',
        title: '下单时间'
    },
    {
        key: 'orderStatus',
        title: '订单状态',
        render: (h, params) => {
            let state = params.row.orderStatus;
            return h('label', state===8?'已取消':(state===-1?'待审核':(state===0?'未通过':(state===1?'已通过':(state===7||state===6?'已完成':'进行中')))));
        }
    },
    {
    	key: 'providerId',
    	title: '供应商',
    	label:true
    },
    {
        key: 'remark',
        title: '订单备注'
    },
    {
    	key: 'handle',
        title: '操作',
        align: 'center',
        width: 120,
        handle: ['check']
    }
];

