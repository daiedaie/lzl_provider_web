export const admin_columns =[
    {
        key: 'id',
        title: 'id',
        className: 'column-hidden'
    },
    {
        key: 'name',
        title: '账号', 
        editable: true
    },
    {
        key: 'roleName',
        title: '角色', 
        options: true
    },
    {
        key: 'tel',
        title: '联系电话', 
        editable: true
    },
    {
        key: 'status',
        title: '状态',
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
        key: 'rolesName',
        title: '角色名称',
        editable: true
    },
    {
        key: 'content',
        title: '角色描述',
        editable: true
    },
    {
        key: 'roleCode',
        title: '角色编码'
    },
    {
        key: 'status',
        title: '状态',
        render: (h, params) => {
            let state = params.row.status;
            return h('label', state===1?'正常':'删除');
        }
    },
    {
        key: 'updateTime',
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

