<style lang="less">
    @import './editable-table.less';
</style>

<template>
    <div>
        <Table :loading="loading" :ref="refs" :columns="columnsList" :data="thisTableData"  border disabled-hover></Table>
    </div>
</template>

<script>
import refundService from './refundService.vue';

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

const serviceLabel = (vm, h, state) => {
	return h('label', state==-1?'待审核':(state==0?'未通过':(state==1?'已通过':(state==2?'未付款':'已取消'))));
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
const cellOptionRepository = (h, param) => {
    return h('Option', {
        props: {
            value: param.repositoryId
        },
        attrs: {
            label:param.repositoryName
        },
    });
};
const cellOptionProvider = (h, param) => {
    return h('Option', {
        props: {
            value: param.providerId
        },
        attrs: {
            label:param.providerName
        },
    });
};
export default {
    name: 'canEditTable',
    components: {
        refundService
    },
    props: {
        loading : Boolean,
        refs: String,
        columnsList: Array,
        value: Array,
        url: String,
        roles:Array,
        repositories:Array,
        providers:Array,
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
            //loading:true
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
            //处理search中定义的每一列，对每一列进行遍历，item就是一个具体的某一列
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
                	//表示在当前列进行render，以下return都是对当前列的渲染
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let children = [];
                        item.handle.forEach(item => {
                            if (item === 'edit') {
                                children.push(editButton(this, h, currentRowData, param.index));
                            } else if (item === 'service') {
                            	let state = currentRowData.orderStatus;
                            	if(state == 3 || state == 4 || state == 5 || state == 6 || state == 7){
                            		children.push(serviceButton(this, h, currentRowData, param.index));
                            	}else{
	                            	children.push(serviceLabel(this, h, state));
                            	}
                            }
                        });
                        return h('div', children);
                    };
                }
                //显示select列
                if (item.options) {
                	//表示在当前列进行render，以下return都是对当前列的渲染
                    item.render = (h, param) => {
                    	//获取该行数据
                        let currentRow = this.thisTableData[param.index];
                        let goodsTypeNameSelect = '';
                        this.roles.forEach(role => {
                        	//该item就是每一列
                            if (role.goodsTypeId === currentRow[item.key]) {
                                goodsTypeNameSelect = role.goodsTypeName;
                            }
                        });
                        if (!currentRow.editting) {
                            return h('span', goodsTypeNameSelect);
                        } else {
                        	//index对应所操作的行，以下为获取所操作行的数据
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            this.roles.forEach(item => {
                            	//该处的item为每个role，该role是一个Roles对象，里面有Roles对象的所有属性
                                //children中放入的是option选项，cellOption方法对当前列也进行了下拉选项的渲染
                            	children.push(cellOption(h, item));
                            });
                            return h('Select',
                                    {
                                        attrs:{
                                            placeholder:goodsTypeNameSelect
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['goodsTypeId'] = event;
                                            }
                                        }
                                    }, 
                                    //children中就是cellOption方法渲染的所有下来选项
                                    children
                            );
                        }
                    };
                }
                //显示repositories对应的select列
                if (item.RepositoryOptions) {
                	//表示在当前列进行render，以下return都是对当前列的渲染
                    item.render = (h, param) => {
                    	//获取该行数据
                        let currentRow = this.thisTableData[param.index];
                        let repositoryNameSelect = '';
                        this.repositories.forEach(repository => {
                        	//该item就是每一列
                            if (repository.repositoryId === currentRow[item.key]) {
                            	repositoryNameSelect = repository.repositoryName;
                            }
                        });
                        if (!currentRow.editting) {
                            return h('span', repositoryNameSelect);
                        } else {
                        	//index对应所操作的行，以下为获取所操作行的数据
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            this.repositories.forEach(repository => {
                            	//该处的item为每个role，该role是一个Roles对象，里面有Roles对象的所有属性
                                //children中放入的是option选项，cellOption方法对当前列也进行了下拉选项的渲染
                            	children.push(cellOptionRepository(h, repository));
                            });
                            return h('Select',
                                    {
                                        attrs:{
                                            placeholder:repositoryNameSelect
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['repositoryId'] = event;
                                            }
                                        }
                                    }, 
                                    //children中就是cellOption方法渲染的所有下来选项
                                    children
                            );
                        }
                    };
                }
                //显示Provider对应的select列
                if (item.ProviderOptions) {
                	//表示在当前列进行render，以下return都是对当前列的渲染
                    item.render = (h, param) => {
                    	//获取该行数据
                        let currentRow = this.thisTableData[param.index];
                        let providerNameSelect = '';
                        this.providers.forEach(provider => {
                        	//该item就是每一列
                            if (provider.providerId === currentRow[item.key]) {
                            	providerNameSelect = provider.providerName;
                            }
                        });
                        if (!currentRow.editting) {
                            return h('span', providerNameSelect);
                        } else {
                        	//index对应所操作的行，以下为获取所操作行的数据
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            this.providers.forEach(provider => {
                            	//该处的item为每个role，该role是一个Roles对象，里面有Roles对象的所有属性
                                //children中放入的是option选项，cellOption方法对当前列也进行了下拉选项的渲染
                            	children.push(cellOptionProvider(h, provider));
                            });
                            return h('Select',
                                    {
                                        attrs:{
                                            placeholder:providerNameSelect
                                        },
                                        on: {
                                            'on-change' (event) {
                                                vm.edittingStore[param.index]['providerId'] = event;
                                            }
                                        }
                                    }, 
                                    //children中就是cellOption方法渲染的所有下来选项
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
                /* 
              	//显示下架时间状态列
                if (item.invalidDate) {
                    item.render = (h, param) => {
                        let currentRow = this.thisTableData[param.index];
                        //根据key来获取该列的值
                        let state = currentRow[item.key];
                        // let stateName = state===1?'正常':(state===2?'冻结':'删除');
                        let stateName = state===null?'--':state;
                        if (!currentRow.editting) {
                            let state = currentRow[item.key];
                            return h('label', stateName);
                        } else {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            //id和rolesName只是一个标识，因为cellOption函数中指定的param中的属性就是id和rolesName
                            //为了能够复用(和角色Roles),所以就统统都用这两个变量了
                            let statusArray = [{"goodsTypeId":null,"goodsTypeName":"--"},{"goodsTypeId":"","goodsTypeName":state}];
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
                                                vm.edittingStore[param.index]['invalidDate'] = event;
                                            }
                                        }
                                    }, 
                                    children
                            );
                        }
                    };
                }
                 */
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
