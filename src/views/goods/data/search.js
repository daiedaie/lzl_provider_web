export const columns = [
    {
        key: 'goodsId',
        title: '商品编码'
        //width: 90
        //className: 'column-hidden'
    },
    {
        key: 'fullName',
        title: '商品名称',
        editable: true
    },
    {
        key: 'goodsTypeId',
        title: '商品类别',
        //width: 90,
        options: true
    },
    {
        key: 'status',
        title: '商品状态',
        status:true
        
        //width: 100,
        /*
        render: (h, params) => {
            return h('label', params.row.status===1?'正常出售':'下架商品');
        }
        */
    },
    {
        key: 'repositoryId',
        title: '常用仓库'
        //width: 90
    },
    {
        key: 'providerId',
        title: '常用供应商'
    },
    {
        key: 'beginDate',
        title: '上架时间'
    },
    {
        key: 'invalidDate',
        title: '下架时间'
    },
    {
        key: 'createTime',
        title: '创建时间'
        //className: 'column-hidden'
    },
    {
    	key: 'handle',
        title: '操作',
        align: 'center',
        width: 200,
        handle: ['edit', 'delete']
    }
    /*
    {
        title: '操作',
        key: 'action',
        width: 160,
        //color:'#2d8cf0',
        className: 'primary-column',
        align: 'center',
        render: (h, params) => {
            return h('div', [
            	h('Icon', {
                    props: {
                        type: 'edit'
                    },
                    style: {
                        marginRight: '-5px'
                    }
                }),
                h('Button', {
                    props: {
                    	//type: 'primary',
                    	type:'text',
                        size: 'small'
                    },
                    style: {
                        marginRight: '15px'
                    },
                    on: {
                        click: () => {
                            this.put(params.row, params.index)
                        }
                    }
                }, '编辑'),
                
                h('Icon', {
                    props: {
                        type: 'trash-a'
                    },
                    style: {
                        marginRight: '-5px'
                    }
                }),
                h('Button', {
                    props: {
                    	//type: 'error',
                    	type:'text',
                        size: 'small'
                    },
                    on: {
                        click: () => {
                            remove(params.row, params.index)
                        }
                    }
                }, '删除')
                
            ]);
        }
    }
    */
];

export const searchTable3 = [
];
