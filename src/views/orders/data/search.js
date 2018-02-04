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
        key: 'sellerMobile',
        title: '商家电话'
    },
    {
        key: 'moneyOrder',
        title: '付款金额'
    },
    {
        key: 'orderState',
        title: '订单状态',
        render: (h, params) => {
            let state = params.row.orderState;
            return h('label', state===7?'已取消':(state===5||state===6?'已完成':'进行中'));
        }
    },
    {
        key: 'deliveryType',
        title: '配送方式',
        render: (h, params) => {
            return h('label', params.row.deliveryType===1?'配送':'自提');
        }
    },
    {
        key: 'memberName',
        title: '用户名'
    },
    {
        key: 'createTime',
        title: '创建时间'
    }
];

export const searchTable3 = [
];
