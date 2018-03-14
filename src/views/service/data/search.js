export const orderRefundColumns = [
	{
        key: 'orderSn',
        title: '订单编号'
    },
    {
        key: 'goodsMoney',
        title: '商品总金额',
        render: (h, params) => {
        	let data = params.row.ordersGoods;
            let totalGoodsMoney = 0;
            for(let i=0;i<data.length;i++){
            	totalGoodsMoney += data[i].moneyPrice * data[i].number;
            }
            return h('label', totalGoodsMoney);
        }
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
        title: '实付金额',
        render: (h, params) => {
        	let data = params.row.ordersGoods;
            let totalGoodsMoney = 0;
            for(let i=0;i<data.length;i++){
            	totalGoodsMoney += data[i].moneyPrice * data[i].number;
            }
            let payMoney = totalGoodsMoney - params.row.expressMoney - params.row.taxMoney;
            return h('label', payMoney);
        }
    },
    {
        key: 'invoiceStatus',
        title: '有无发票',
        render: (h, params) => {
        	let state = params.row.invoiceStatus;
        	return h('label', state===1?'有':'无');
        }
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
        key: 'name',
        title: '收货人'
    },
    {
        key: 'payTime',
        title: '下单时间'
    },
    {
        key: 'finishTime',
        title: '完成时间'
    },
    {
        key: 'remark',
        title: '订单备注'
    }
];

export const othersColumns = [
	{
        type: 'selection',
        width: 60,
        align: 'center'
    },
	{
		key: 'goodsName',
		title: '商品名称'
	},
	{
		key: 'goodsBrandId',
		title: '品牌'
	},
	{
		key: 'pic',
		title: '商品图片'
	},
	{
		key: 'specInfo',
		title: '规格'
	},
	{
		key: 'goodsCateId',
		title: '商品分类'
	},
	{
		key: 'moneyPrice',
		title: '商品单价'
	},
	{
		key: 'number',
		title: '购买数量'
	},
	{
		key: 'providerId',
		title: '所属供应商'
	}
];

export const modalColumns = [
	{
		key: 'goodsName',
		title: '商品名称',
	},
	{
		key: 'barCode',
		title: '条形码'
	},
	{
		key: 'number',
		title: '退货数量',
		width:160,
		align:'center',
		editable: true
	},
	{
		key: 'refundMoney',
		title: '退货金额'
	},
	{
		key: 'taxMoney',
		title: '退货税额'
	},
	{
		key: 'expressMoney',
		title: '退货运费'
	},
	{
		key: 'remark',
		title: '备注'
	},
    {
        title: '操作',
        align: 'center',
        width: 100,
        key: 'handle',
        handle: ['delete']
    }
];

