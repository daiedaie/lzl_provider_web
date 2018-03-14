export const columns = [
    {
        key: 'id',
        title: '编号',
        width: "70"
    },
    {
        key: 'name',
        title: '名称',
        width: "20"
    },
    {
        key: 'pic',
        title: '图片',
        width: "90",
        align: 'center',
        type: "pic",
        showpic:5
    },
    {
        key: 'statusStr',
        align: 'center',
        title: '状态',
        width: "40"
    },
    {
    	key: 'gradeStr',
    	align: 'center',
    	title: '分类级别',
    	width: "30"
    },
    {
        key: 'createTime',
        align: 'center',
        title: '创建时间',
        width: "20"
    },
    {
    	key: 'updateTime',
    	align: 'center',
    	title: '更新时间',
    	width: "20"
    },
    {
        title: "操作",
        type: "action",
        align: "center",
        width: "100"
    }
];

export const statusList = [
	{value: '', label: '全部'},
	{value: 1, label: '提交审核'},
	{value: 2, label: '审核通过'},
	{value: 3, label: '审核失败'},
	{value: 4, label: '停用'}
];
 

export const levelList = [
	/*{
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
	}*/
];
