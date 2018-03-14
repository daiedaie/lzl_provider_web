<style lang="less">
    @import '../../../styles/editable-table.less';
</style>

<template>
    <div>
        <Table :height="tableHeight" highlight-row ref="refs" :columns="columnsList" :data="thisTableData" @on-sort-change='sortchange' @on-row-click="clickedOnce" border disabled-hover></Table>
    </div>
</template>

<script>
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
            tableHeight: 650,  
            columns: [],
            thisTableData: []
        };
    },
    created () {
        this.init();
    },
    methods: {
        clickedOnce(value){
            this.$emit('click-one-time',value);
        },
        //排序
        sortchange(value){
            switch(value.column.sortable){
                case 1:this.$emit('table-sort1',value.order);break;
                case 2:this.$emit('table-sort2',value.order);break;
            }
        },
        init () {
            let vm =this;
            this.thisTableData = JSON.parse(JSON.stringify(this.value));
            this.columnsList.forEach(item => {
                //单张图片点击放大
                if (item.showpic) {
                    item.render = (h, param) => {
                        let imgs = '';
                        switch(item.showpic){
                            case 1:imgs = param.row.organization;break;
                            case 2:imgs = param.row.sellerLogo;;break;
                            case 3:imgs = param.row.qrcode;break;
                            case 4:imgs = param.row.masterImg;break;
                            case 5:imgs = param.row.pic;break;
                            case 6:imgs = param.row.avatar;break;
                            case 7:imgs = param.row.image;break;
                            case 8:imgs = param.row.lzlQrcode;break;
                        }
                        return h('img', {
                                attrs: {
                                    class: 'admin-upload-celllook',
                                    src: IMGURL+imgs
                                }
                                ,
                                on: {
                                    'click' (event) {
                                         vm.$emit('show-pic', imgs);
                                    }
                                }
                            })
                    };
                }
                //多张图片点击放大
                if (item.showpics) {
                    item.render = (h, param) => {
                        let imgs = param.row.bussinessLicenseImage.split(",");
                        let children = [];
                        for(let item in imgs){
                            children.push(h('img', {
                                attrs: {
                                    class: 'admin-upload-celllook',
                                    src: IMGURL+imgs[item]
                                }
                                ,
                                on: {
                                    'click' (event) {
                                         vm.$emit('show-pic', imgs[item]);
                                    }
                                }
                            }));
                        }
                        return h('div', children);
                    };
                }
                //条件过滤筛选
                if (item.filter) {
                    item.filterRemote=(h,param)=>{
                        switch(item.filter){
                            case 1:vm.$emit('table-filter1',h[0]);break;
                            case 2:vm.$emit('table-filter2',h[0]);break;
                        }
                    }
                }
                //需要二次确认的，商家审核
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        if(currentRowData.state===1 || currentRowData.status===1){
                            let children = [];
                            item.handle.forEach(item => {
                                     children.push(h('Poptip', {
                                        props: {
                                            confirm: true,
                                            title: '您确定此次操作吗?',
                                            transfer: true
                                        },
                                        on: {
                                            'on-ok': () => {
                                                switch(item){
                                                    case '通过':vm.$emit('on-pass', currentRowData.id);break;
                                                    case '拒绝':vm.$emit('on-refuse', currentRowData.id);;break;
                                                    case '下架':vm.$emit('on-remove', currentRowData);;break;
                                                }
                                            }
                                        }
                                        }, [
                                        h('Button', {
                                            props: {
                                                type: '通过'===item?'success':'error',
                                            },
                                            style: {
                                                margin: '0 5px'
                                            }
                                        },item)
                                    ]));
                            });
                            return h('div', children);
                        }else{
                            return h('label', '已处理');
                        }
                    };
                }
                //编辑
                if (item.deal) {
                    item.render = (h, param) => {
                        let currentRowData = this.thisTableData[param.index];
                        let children = [];
                        item.deal.forEach(item => {
                            children.push(
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        margin: '0 5px'
                                    },
                                    on: {
                                        'click' (event) {
                                            vm.$emit('on-edit', currentRowData);
                                        }
                                    }
                                },item)
                            );
                        });
                        return h('div', children);
                    };
                }
            });
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
