export const columns =[
    {
        key: 'taxRateId',
        title: '序号',
        //className: 'column-hidden'
    },
    {
        key: 'taxRateName',
        title: '税率名称', 
        editable: true
    },
    {
        key: 'rate',
        title: '税率', 
        editable: true
    },
    {
        key: 'createTime',
        title: '创建时间'
    },
    {
    	key: 'modifyTime',
    	title: '修改时间'
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];