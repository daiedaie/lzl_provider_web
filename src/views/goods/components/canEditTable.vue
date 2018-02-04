<style lang="less">
    @import './editable-table.less';
</style>

<template>
    <div>
        <Table :ref="refs" :columns="columnsList" :data="thisTableData"  border disabled-hover></Table>
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
                    //当点击编辑时，赋予该行编辑状态的一些属性
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
                //那些可编辑状态的属性的设置，就是在这样的onclick事件中设置或修改的
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
          	//那些可编辑状态的属性的设置，就是在这样的onclick事件中设置或修改的
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
            value: param.goodsTypeId
        },
        attrs: {
            label:param.goodsTypeName
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
        }
    },
    data () {
        return {
            columns: [],
            thisTableData: [],
            edittingStore: []
        };
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            let vm = this;
            //获取search中定义的所有可编辑的column，将这些列放入到数组editableCell中
            let editableCell = this.columnsList.filter(item => {
                if (item.editable) {
                    if (item.editable === true) {
                        return item;
                    }
                }
            });
            //将所有的表格数据复制一份，复杂成json的形式
            let cloneData = JSON.parse(JSON.stringify(this.value));
            //获取所有正在编辑的row，并将他们都放入到res数组中
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
            //将正在编辑的row行存储到edittingStore数组中
            this.thisTableData = res;
            this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
            //处理search中定义的每一列
            this.columnsList.forEach(item => {
                //如果该列是可编辑的，则将其显示为编辑状态
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
                //显示操作列
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let children = [];
                        item.handle.forEach(item => {
                            if (item === 'edit') {
                                children.push(editButton(this, h, currentRowData, param.index));
                            } else if (item === 'delete') {
                                children.push(deleteButton(this, h, currentRowData, param.index));
                            }
                        });
                        return h('div', children);
                    };
                }
                //显示select列
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
                                            placeholder:currentRowData.goodsTypeName
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['goodsTypeId'] = event;
                                            }
                                        }
                                    }, 
                                    children
                            );
                        }
                    };
                }
                //显示status状态列
                if (item.status) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        let state = currentRow[item.key];
                        // let stateName = state===1?'正常':(state===2?'冻结':'删除');
                        let stateName = state===1?'正常出售':'下架商品';
                        if (!currentRow.editting) {
                            let state = currentRow[item.key];
                            return h('label', stateName);
                        } else {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            //id和rolesName只是一个标识，因为cellOption函数中指定的param中的属性就是id和rolesName
                            //为了能够复用(和角色Roles),所以就统统都用这两个变量了
                            let statusArray = [{"goodsTypeId":"1","goodsTypeName":"正常出售"},{"goodsTypeId":"0","goodsTypeName":"下架商品"}];
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
        //修改后点击保存或点击删除，则将处理后的数据进行返回。
        //将该行的一些编辑状态的属性删除，然后该行就能像其他行一样正常显示了
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
    watch: {
       	//观察value的值，当value值变化时，就调用初始化函数
    	value (data) {
            this.init();
        }
    }
};
</script>
