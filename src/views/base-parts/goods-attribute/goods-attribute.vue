<style lang="less">
@import "../../../styles/common.less";
@import "../../../styles/table.less";
</style>

<template>
	<div>
        <Row :gutter="10">
            <Col>
                <Card>
                   <p slot="title">
                        <Icon type="mouse"></Icon>
                        	点击搜索进行搜索
                    </p>
                    <Row>
                        <Input v-model="params.goodsAttributeName" style="width:130px" placeholder="请输入属性名称" class="search-table" />
                        <Select v-model="params.status" placeholder="请选择状态" class="search-table">
                        	<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <Button type="primary" style="margin:0 30px;float:right" @click.prevent="toPost">新增</Button>
                    </Row>
                    
                    <Row class="margin-top-10" style="stripe">
                    	<can-edit-table v-model="data" :columns-list="columns" @on-edit='toEdit'></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='params.pageSize' :current='params.pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>
                    
                </Card>
                
            </Col>
            <Modal :title="postOrPutTitle" v-model="modalPostOrPut" @on-ok="postOrPutMethod" class-name="vertical-center-modal">         
          		<Form :model="formItem" :label-width="110">
		            <FormItem label="商品性质名称：">
		                <Input v-model="formItem.goodsAttributeName" placeholder="请输入商品性质名称"></Input>
		            </FormItem>
		            <FormItem label="商品所属类别：">
		            	<Cascader @on-change="dealCascader" :data="fatherCascader" :load-data="loadData" change-on-select placeholder="请选择分类" class="search-table ivu-input-wrapper"></Cascader>
		            </FormItem>
		            <FormItem label="成本计算方法：">
		            	<Select v-model="formItem.costCalculateMethod" style="width:160px" placeholder="成本计算方法">
		            		<Option v-for="item in calculateMethodList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		            	</Select>
		            </FormItem>
		            <FormItem label="税率名称：">
		            	<Select v-model="formItem.taxRateId" style="width:160px" placeholder="税率名称">
		            		<Option v-for="item in taxRateList" :value="item.taxRateId" :key="item.taxRateId">{{ item.taxRateName }}</Option>
		            	</Select>
		            </FormItem>
		            <FormItem label="状态：">
		            	<Select v-model="formItem.status" style="width:160px" placeholder="状态">
		            		<Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		            	</Select>
		            </FormItem>
		        </Form>
        	</Modal>
        </Row>
	</div>
    
</template>

<script>
import Vue from 'vue';
import * as table from "./data/goods-attribute";
import canEditTable from '../../my-components/table-edit/common.vue';
import * as common from "../../../js/util/common";
import * as api from "../../../js/api/request";
import {formatDate} from '../../../js/util/common.js';

export default {
  name: "goodsAttribute",
  components: {
      canEditTable
  },
  data() {
    return {
      params:{pageIndex: 1,pageSize: 10,isGetCount: true,goodsAttributeName:"", status:""},
      loading : true,
      total: 0,
      
      modalPost:false,
      formItem:{},
      
      columns: table.columns,
      data: [],
      
      postOrPutTitle:'',
      modalPostOrPut:false,
      
      statusList:table.statusList,
      calculateMethodList:table.calculateMethodList,
      fatherCascader:[],
      taxRateList:[]
    };
  },
  filters: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, "yyyy-MM-dd hh:mm:ss");
      }
  },
  methods: {
    //初始化
    init() {
      this.handleSearch();
      this.handleCascader();
    },
    //请求数据
    handleSearch() {
      this.loading = true;
      
      api.get.request(URL_GOODSATTRIBUTE,this.params).then(res => {
        if(res.data){
            this.data = res.data;
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
      });
      
      api.get.request(URL_TAXRATE).then(res => {
        if(res.data){
            this.taxRateList = res.data;
        }else{
            this.data = [];
        }
      });

      this.loading = false;
    },
    
    postOrPutMethod() {
    	if(this.postOrPutTitle === "新增"){
    		this.post();
    	}
    	if(this.postOrPutTitle === "编辑"){
    		this.put();
    	}
    },
    //新增界面展示
    toPost (index) {
    	this.postOrPutTitle = "新增";
    	this.modalPostOrPut=true;
    },
    post () {
    	api.post.request(URL_GOODSATTRIBUTE, this.formItem).then(res => {
        this.handleSearch();
      });  
    },
  	//进入编辑界面
    toEdit (value) {
        this.formItem=value;
        this.postOrPutTitle="编辑";
        this.modalPostOrPut=true;
    },
    //更新数据
    put (val,index) {
    	let rowData = val[index];
    	
    	api.put.request(URL_GOODSATTRIBUTE, rowData).then(res => {
        	this.handleSearch();
      	});  
    },
  	//处理分类查询条件
    dealCascader(value){
        if(value.length===1){
            this.params.cateGradeOneId=value[0];
            this.params.productCateId='';
        }else{
            this.params.productCateId=value[1];
            this.params.cateGradeOneId='';
        }
    },
  	//请求级联下拉框数据
    handleCascader() {
      api.get.request(URL_GOODSCATE + "/goodsCateForAttribute",{pid:0,iviewCascader:1}).then(res => {
        this.fatherCascader = res.data
      });
    },
    //级联二级数据
    loadData (item, callback) {
        item.loading = true;
        api.get.request(URL_GOODSCATE + "/goodsCateForAttribute",{pid:item.value,iviewCascader:1}).then(res => {
            item.children = res.data
        });
        setTimeout(() => {
            item.loading = false;
            callback();
        }, 500);
    },
  	//切换页码
    changepage(index) {
      this.params.pageIndex = index;
      this.handleSearch();
    },
    //切换页码大小
    changeSize(size) {
      this.params.pageSize = size;
      this.handleSearch();
    },
  },
  
  //页面加载完，在该处发起请求
  mounted() {
    this.init();
  }
};
</script>
