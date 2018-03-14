export const columns =[
    {
        key: 'repositoryName',
        title: '仓库名称',
        width: "80"
    },
    {
        key: 'address',
        title: '地址',
        align: "center",
        width: "300"
    },
    {
    	key: 'realVirtualStr',
    	title: '仓库虚实',
    	align: "center",
        width: "20"
    },
    {
    	key: 'statusStr',
    	title: '库存状态',
    	align: "center",
        width: "20"
    },
    {
    	key: 'availableStr',
    	title: '是否停用',
    	align: "center",
        width: "20"
    },
    {
    	key: 'levelStr',
    	title: '仓库层次',
    	align: "center",
        width: "20"
    },
    {
        key: 'createTime',
        title: '创建时间',
        align: "center",
        width: "25"
    },
    {
    	key: 'modifyTime',
    	title: '修改时间',
    	align: "center",
        width: "25"
    },
    {
        title: "操作",
        type: "action",
        align: "center",
        width: "150"
    }
];

export const realVirtualList = [
	{value: '',label: '全部'},
    {value: 1 ,label: '实仓'},
    {value: 0 ,label: '虚仓'}  
];

export const statusList = [
	{value: '',label: '全部'},
    {value: '1' ,label: '正常'},
    {value: '2' ,label: '缺货'},
    {value: '3' ,label: '已满'}  
];

export const availableList = [
	{
		value:'',
		label:'全部'
	},
	{
		value: 1,
		label:'正常'
	},
	{
		value: 0,
		label:'停用'
	}
];

export const levelList = [
	{
		value:'',
		label:'全部'
	},
	{
		value: '0',
		label:'一级'
	},
	{
		value: '-1',
		label:'二级'
	}
];