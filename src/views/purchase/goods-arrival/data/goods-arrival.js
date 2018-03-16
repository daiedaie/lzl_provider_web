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
            return h('label', state===-1?'待审核':(state===0?'未通过':(state===1?'已通过':(state===2?'未付款的订单':(state===3?'已付款待确认':(state===4?'已确认待发货':(state===5?'已发货待收货':(state===6?'已送达待取货':(state===7?'已收货待评价':(state===8?'已完成的订单':'取消的订单'))))))))));
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
        handle: ['arrival']
    }
];

