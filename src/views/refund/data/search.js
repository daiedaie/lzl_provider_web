export const columns = [
    {
        key: 'refundId',
        title: '序号'
    },
    {
        key: 'orderSn',
        title: '订单编号'
    },
    {
        key: 'type',
        title: '服务类型 ',
        render: (h, params) => {
        	let value = params.row.type;
            return h('label', value===1?'仅退款':(value===2?'仅退货':(value===3?'仅换货':(value===4?'退款退货':'其他'))));
        }
    },
    {
        key: 'goodsMoney',
        title: '商品金额'
    },
    {
        key: 'taxMoney',
        title: '税额 '
    },
    {
        key: 'expressMoney',
        title: '运费 '
    },
    {
        key: 'refundExpressMoney',
        title: '退货运费 '
    },
    {
        key: 'moneyBack',
        title: '实退金额 '
    },
    {
        key: 'invoiceStatus',
        title: '发票',
        render: (h, params) => {
        	let value = params.row.invoiceStatus;
            return h('label', value===0?'无发票':'有发票');
        }
    },
    {
    	key: 'refundMode',
    	title: '退款方式',
    	render: (h, params) => {
        	let value = params.row.refundMode;
            return h('label', value===1?'支付宝':(value===2?'微信':(value===3?'银行转账':(value===4?'现金':'其他'))));
        }
    },
    {
    	key: 'applyStatus',
    	title: '申请状态',
    	render: (h, params) => {
        	let value = params.row.applyStatus;
            return h('label', value===1?'已通过':(value===2?'待审核':(value===3?'待收款':(value===4?'待收货':(value===5?'已收货':(value===6?'已收款':(value===7?'待评价':(value===8?'已完成':'申请驳回'))))))));
        }
    },
    {
        key: 'consignee',
        title: '取货人'
    },
    {
        key: 'applyTime',
        title: '申请时间'
    },
    {
        key: 'finishTime',
        title: '完成时间'
    },
    {
        key: 'remark',
        title: '备注'
    }
    
];

export const typeList = [
    {
        value: '',
        label: '全部'
    },
    {
        value: '1',
        label: '仅退款'
    },
    {
        value: '2',
        label: '仅退货'
    },
    {
        value: '3',
        label: '仅换货'
    },
    {
        value: '4',
        label: '退款退货'
    }
];

export const applyStatusList = [
    {
        value: '',
        label: '全部'
    },
    {
        value: '1',
        label: '已通过'
    },
    {
        value: '2',
        label: '待审核'
    },
    {
        value: '3',
        label: '待收款'
    },
    {
        value: '4',
        label: '待收货'
    },
    {
        value: '5',
        label: '已收货'
    },
    {
        value: '6',
        label: '已收款'
    },
    {
        value: '7',
        label: '待评价'
    },
    {
        value: '8',
        label: '已完成'
    },
    {
        value: '9',
        label: '申请驳回'
    }
];
