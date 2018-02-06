export const columns = [
    /*
	{
        key: 'id',
        title: '序号'
    },
    */
    {
        key: 'orderSn',
        title: '订单编号'
    },
    /*
    {
    	key: 'mobile',
    	title: '供应商电话'
    },
    */
    {
        key: 'goodsMoney',
        title: '商品金额'
    },
    {
        key: 'expressMoney',
        title: '运费'
    },
    {
        key: 'taxMoney',
        title: '税额'
    },
    {
        key: 'ordersMoney',
        title: '实付金额'
    },
    {
        key: 'invoiceStatus',
        title: '是否开票'
    },
    {
        key: 'paymentName',
        title: '付款要求',
        render: (h, params) => {
            let state = params.row.paymentName;
            return h('label', state===1?'全额支付':(state===2?'货到付款':'分期支付'));
        }
    },
    {
        key: 'paymentMode',
        title: '付款方式',
        render: (h, params) => {
            let state = params.row.paymentMode;
            return h('label', state===1?'支付宝':(state===2?'微信':(state===3?'银行转账':'现金')));
        }
    },
    {
        key: 'orderStatus',
        title: '订单状态',
        render: (h, params) => {
            let state = params.row.orderStatus;
            return h('label', state===7?'已取消':(state===5||state===6?'已完成':'进行中'));
        }
    },
    {
        key: 'deliveryman',
        title: '送货人'
    },
    {
        key: 'payTime',
        title: '下单时间'
    },
    {
        key: 'finishTime',
        title: '完成时间'
    },
    /*
    {
        key: 'updateTime',
        title: '修改时间'
    },
    */
    {
        key: 'remark',
        title: '订单备注'
    }
];

export const searchTable3 = [
];
