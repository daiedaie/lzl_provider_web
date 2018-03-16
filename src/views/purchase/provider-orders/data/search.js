export const columns = [
	{
        type: 'expand',
        width: 50,
        render: (h, params) => {
            let children = [];
            let data = params.row.ordersGoods;
            let totalMoney = 0;
            
            for(let i=0;i<data.length;i++){
                let childrenRow = [];
                
                let childrenCol1 = [];
                let childrenCol2 = [];
                let childrenCol3 = [];
                let childrenCol4 = [];
                //span是不换行的，可以连续span。
                childrenCol1.push(h('span','名称：'));
                childrenCol1.push(h('span',data[i].goodsName));
                childrenCol2.push(h('span','单价：'));
                childrenCol2.push(h('span',data[i].moneyPrice + '元'));
                childrenCol3.push(h('span','数量：'));
                childrenCol3.push(h('span',data[i].number));
                
                totalMoney += data[i].moneyPrice * data[i].number;
                
                childrenRow.push(h('Col', {
                    props: {
                    	//设定每列的长度span:7
                    	span:7
                    }
                    },childrenCol1));
                childrenRow.push(h('Col', {
                    props: {
                        span:7
                    }
                    },childrenCol2));
                childrenRow.push(h('Col', {
                    props: {
                        span:7
                    }
                    },childrenCol3));
                
                if(i+1 === data.length){
                	childrenCol4.push(h('span','总金额：'));
                    childrenCol4.push(h('span',totalMoney + '元'));
                    
                    childrenRow.push(h('Col', {
	                    props: {
	                        span:21
	                    }
                    },childrenCol4));
                }
                
                children.push(h('row',childrenRow));
            }
            totalMoney = 0;
            return h('div', children);
        }
    },
	{
        key: 'orderSn',
        title: '订单号'
    },
    /*
    {
    	key: 'mobile',
    	title: '供应商电话'
    },
    */
    /*{
        key: 'goodsMoney',
        title: '商品金额'
    },*/
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
        title: '有无发票',
        render: (h, params) => {
        	let state = params.row.invoiceStatus;
        	return h('label', state===1?'有':'无');
        }
    },
    /*{
        key: 'paymentName',
        title: '付款要求',
        render: (h, params) => {
            let state = params.row.paymentName;
            return h('label', state===1?'全额支付':(state===2?'货到付款':'分期支付'));
        }
    },*/
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
            return h('label', state===8?'已取消':(state===-1?'待审核':(state===0?'未通过':(state===1?'已通过':(state===7||state===6?'已完成':'进行中')))));
        }
    },
    /*{
        key: 'deliveryman',
        title: '送货人'
    },*/
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
    },
    {
    	key: 'handle',
        title: '操作',
        align: 'center',
        width: 120,
        handle: ['service']
    }
];

export const searchTable3 = [
];
