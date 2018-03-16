<style lang="less">
    @import '../../../styles/editable-table.less';
</style>

<template>
    <div>
        <Table :height="tableHeight" highlight-row ref="refs" :columns="columnsList" :data="thisTableData"  border disabled-hover></Table>
    </div>
</template>

<script>
const editButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: currentRow.editting ? 'success' : 'primary',
            loading: currentRow.saving
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                if (!currentRow.editting) {
                    if (currentRow.edittingCell) {
                        for (let name in currentRow.edittingCell) {
                            currentRow.edittingCell[name] = false;
                            vm.edittingStore[index].edittingCell[name] = false;
                        }
                    }
                    vm.edittingStore[index].editting = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                } else {
                    vm.edittingStore[index].saving = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    let edittingRow = vm.edittingStore[index];
                    edittingRow.editting = false;
                    edittingRow.saving = false;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                }
            }
        }
    }, currentRow.editting ? '保存' : '编辑');
};
const refundServiceButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要此操作吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-refundService', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '处理请求')
    ]);
};
const refundServiceLabel = (vm, h, state) => {
	return h('label', '- -');
};

const serviceButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要售后服务吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-service', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '售后服务')
    ]);
};
const serviceLabel = (vm, h, state) => {
	return h('label', state==-1?'待审核':(state==0?'未通过':(state==1?'已通过':(state==2?'未付款':'已取消'))));
};

const arrivalCheckButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要此操作吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-arrivalCheck', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '入库验收')
    ]);
};
const arrivalCheckLabel = (vm, h, state) => {
	return h('label', '- -');
};

const arrivalButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要此操作吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-arrival', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '确认收货')
    ]);
};
const arrivalLabel = (vm, h, state) => {
	return h('label', '- -');
};

const checkButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要此操作吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-check', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '审核')
    ]);
};

const checkLabel = (vm, h, state) => {
	return h('label', state==0?'未通过':'已通过');
};

const deleteButton = (vm, h, currentRow, index) => {
    return h('Poptip', {
        props: {
            confirm: true,
            title: '您确定要删除这条数据吗?',
            transfer: true
        },
        on: {
            'on-ok': () => {
                vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, [
        h('Button', {
            style: {
                margin: '0 5px'
            },
            props: {
                type: 'error',
                placement: 'top'
            }
        }, '删除')
    ]);
};
const permissionButton = (vm, h, currentRow, index) => {
    return h('Button', {
        props: {
            type: 'warning'
        },
        style: {
            margin: '0 5px'
        },
        on: {
            'click': () => {
                vm.$emit('on-resources', vm.handleBackdata(vm.thisTableData), index);
            }
        }
    }, '分配权限');
};
const incellEditBtn = (vm, h, param) => {
    if (vm.hoverShow) {
        return h('div', {
            'class': {
                'show-edit-btn': vm.hoverShow
            }
        }, [
            h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            })
        ]);
    } else {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'edit'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                }
            }
        });
    }
};
const saveIncellEditBtn = (vm, h, param) => {
    return h('Button', {
        props: {
            type: 'text',
            icon: 'checkmark'
        },
        on: {
            click: (event) => {
                vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
            }
        }
    });
};
const cellInput = (vm, h, param, item) => {
    return h('Input', {
        props: {
            type: 'text',
            value: vm.edittingStore[param.index][item.key]
        },
        on: {
            'on-change' (event) {
                let key = item.key;
                vm.edittingStore[param.index][key] = event.target.value;
            }
        }
    });
};
const cellOption = (h, param) => {
    return h('Option', {
        props: {
            value: param.id
        },
        attrs: {
            label:param.rolesName
        },
    });
};
export default {
    name: 'canEditTable',
    props: {
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        roles:Array,
        editIncell: {
            type: Boolean,
            default: false
        },
        hoverShow: {
            type: Boolean,
            default: false
        },
        taxRate:Array,
        provider:Array
    },
    data () {
        return {
            tableHeight: 650, 
            columns: [],
            thisTableData: [],
            edittingStore: [],
            
            cascaderText: '未选择',
            
            data: [{
                value: 'beijing',
                label: '北京',
                children: [
                    {
                        value: 'gugong',
                        label: '故宫'
                    },
                    {
                        value: 'tiantan',
                        label: '天坛'
                    },
                    {
                        value: 'wangfujing',
                        label: '王府井'
                    }
                ]
            }, {
                value: 'jiangsu',
                label: '江苏',
                children: [
                    {
                        value: 'nanjing',
                        label: '南京',
                        children: [
                            {
                                value: 'fuzimiao',
                                label: '夫子庙',
                            }
                        ]
                    },
                    {
                        value: 'suzhou',
                        label: '苏州',
                        children: [
                            {
                                value: 'zhuozhengyuan',
                                label: '拙政园',
                            },
                            {
                                value: 'shizilin',
                                label: '狮子林',
                            }
                        ]
                    }
                ],
            }]
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            let cloneData = JSON.parse(JSON.stringify(this.value));
            let res = [];
            res = cloneData.map((item, index) => {
                let isEditting = false;
                if (this.thisTableData[index]) {
                    if (this.thisTableData[index].editting) {
                        isEditting = true;
                    } else {
                        for (const cell in this.thisTableData[index].edittingCell) {
                            if (this.thisTableData[index].edittingCell[cell] === true) {
                                isEditting = true;
                            }
                        }
                    }
                }
                if (isEditting) {
                    return this.thisTableData[index];
                } else {
                    this.$set(item, 'editting', false);
                    let edittingCell = {};
                    editableCell.forEach(item => {
                        edittingCell[item.key] = false;
                    });
                    this.$set(item, 'edittingCell', edittingCell);
                    return item;
                }
            });
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            this.columnsList.forEach(item => {
                if (item.editable) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            if (this.editIncell) {
                                return h('Row', {
                                    props: {
                                        type: 'flex',
                                        align: 'middle',
                                        justify: 'center'
                                    }
                                }, [
                                    h('Col', {
                                        props: {
                                            span: '22'
                                        }
                                    }, [
                                        !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                    ]),
                                    h('Col', {
                                        props: {
                                            span: '2'
                                        }
                                    }, [
                                        currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : incellEditBtn(this, h, param)
                                    ])
                                ]);
                            } else {
                                return h('span', currentRow[item.key]);
                            }
                        } else {
                            return h('Input', {
                                props: {
                                    type: 'text',
                                    value: currentRow[item.key]
                                },
                                on: {
                                    'on-change' (event) {
                                        let key = param.column.key;
                                        vm.edittingStore[param.index][key] = event.target.value;
                                    }
                                }
                            });
                        }
                    };
                }
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let children = [];
                        item.handle.forEach(item => {
                            if (item === 'permission') {
                                children.push(permissionButton(this, h, currentRowData, param.index));
                            } else if (item === 'edit') {
                                children.push(editButton(this, h, currentRowData, param.index));
                            } else if (item === 'delete') {
                                children.push(deleteButton(this, h, currentRowData, param.index));
                            }else if(item === 'check'){
                            	let state = currentRowData.orderStatus;
                            	if(state == -1){
                            		children.push(checkButton(this, h, currentRowData, param.index));
                            	}else{
	                            	children.push(checkLabel(this, h, state));
                            	}
                            }else if(item === 'arrival'){
                            	let state = currentRowData.orderStatus;
                            	if(state == 6){
                            		children.push(arrivalButton(this, h, currentRowData, param.index));
                            	}else{
	                            	children.push(arrivalLabel(this, h, state));
                            	}
                            }else if(item === 'arrivalCheck'){
                            	let state = currentRowData.orderStatus;
                            	if(state == 7){
                            		children.push(arrivalCheckButton(this, h, currentRowData, param.index));
                            	}else{
	                            	children.push(arrivalCheckLabel(this, h, state));
                            	}
                            }else if (item === 'service') {
                            	let state = currentRowData.orderStatus;
                            	if(state == 3 || state == 4 || state == 5 || state == 6 || state == 7 || state == 8){
                            		children.push(serviceButton(this, h, currentRowData, param.index));
                            	}else{
	                            	children.push(serviceLabel(this, h, state));
                            	}
                            }else if(item === 'refundService'){
                            	let state = currentRowData.orderStatus;
                            	let active = currentRowData.active;
                            	if(state == 3 || state == 4 || state == 5 || state == 6 || state == 7 || state == 8){
                            		if(active == 1 || active == 2 || active == 3 || active == 4){
                                		children.push(refundServiceButton(this, h, currentRowData, param.index));
                                	}
                            	}else{
                            		children.push(refundServiceLabel(this, h, active));
                            	}
                            }
                        }); 
                        return h('div', children);
                    }; 
                }
                if (item.label) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let providerId = currentRowData.providerId;
                        let status = currentRowData.orderStatus;
                        
                        if(status == -1 || status == 0){
                        	return h('label', '未选择');
                        }else{
                        	if(providerId == -1){
                            	return h('label', '未选择');
                            }else if(providerId == 0){
                            	return h('label', '附近实仓');
                            }else{
                            	let providerName = "";
                            	for(let i=0; i<this.provider.length; i++){
                            		if(providerId == this.provider[i].providerId){
                            			providerName = this.provider[i].providerName;
                            		}
                            	}
                            	return h('label', providerName);
                            }
                        }
                    }; 
                }
                //下拉选择
                if (item.options) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        if (!currentRow.editting) {
                            return h('span', currentRow[item.key]);
                        } else {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            this.roles.forEach(item => {
                                children.push(cellOption(h, item));
                            });
                            return h('Select',
                                    {
                                        attrs:{
                                            placeholder:currentRowData.roleName
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['roleId'] = event;
                                            }
                                        }
                                    }, 
                                    children
                            );
                        }
                    };
                }
                if (item.status) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        let state = currentRow[item.key];
                        // let stateName = state===1?'正常':(state===2?'冻结':'删除');
                        let stateName = state===1?'正常':'冻结';
                        if (!currentRow.editting) {
                            let state = currentRow[item.key];
                            return h('label', stateName);
                        } else {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            let statusArray = [{"id":"1","rolesName":"正常"},{"id":"2","rolesName":"冻结"}];
                            statusArray.forEach(item => {
                                children.push(cellOption(h, item));
                            });
                            return h('Select',
                                    {
                                        attrs:{
                                            placeholder:stateName
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['status'] = event;
                                            }
                                        }
                                    }, 
                                    children
                            );
                        }
                    };
                }
            });
        },
        handleBackdata (data) {
            let clonedData = JSON.parse(JSON.stringify(data));
            clonedData.forEach(item => {
                delete item.editting;
                delete item.edittingCell;
                delete item.saving;
            });
            return clonedData;
        }
    },
    mounted() {  
        // 设置表格高度  
        this.tableHeight = window.innerHeight - this.$refs.refs.$el.offsetTop -TABLE_HEIGHT
    },  
    watch: {
        value (data) {
            this.init();
        }
    }
};
</script>
