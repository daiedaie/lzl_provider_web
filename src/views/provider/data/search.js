export const user_columns =[
    {
        key: 'userId',
        title: 'id',
        className: 'column-hidden'
    },
    {
        key: 'username',
        title: '用户账号', 
        editable: true
    },
    {
        key: 'providerRolesId',
        title: '角色', 
        options: true
    },
    {
        key: 'phone',
        title: '联系电话', 
        editable: true
    },
    {
        key: 'state',
        title: '状态',
        width: 100,
        status:true
    },
    {
        key: 'createTime',
        title: '创建时间'
    },
    {
        title: '操作',
        align: 'center',
        width: 200,
        key: 'handle',
        handle: ['edit', 'delete']
    }
];

export const roles_columns = [
    {
        key: 'providerRolesName',
        title: '角色名称',
        editable: true
    },
    {
        key: 'content',
        title: '角色描述',
        editable: true
    },
    {
        key: 'providerRolesCode',
        title: '角色编码',
        editable: true
    },
    {
        key: 'status',
        title: '状态',
        roleStatus:true
        /*
        render: (h, params) => {
            let state = params.row.status;
            return h('label', state===1?'正常':'删除');
        }
        */
    },
    {
        key: 'modifyTime',
        title: '更新时间'
    },
    {
        key: 'createTime',
        title: '创建时间'
    },
    {
        title: '操作',
        align: 'center',
        width: 280,
        key: 'handle',
        handle: ['edit','permission','delete']
    }
];

