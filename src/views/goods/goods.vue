<style lang="less">
@import "../../styles/common.less";
@import "./components/table.less";
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
                        <Input v-model="searchGoodsId" style="width:130px" placeholder="请输入商品编号..." class="search-table" />
                        <Input v-model="searchFullName" style="width:130px" placeholder="请输入商品名称..." class="search-table" />
                        <!-- <Input v-model="searchGoodsTypeId" placeholder="请输入商品类别..." class="search-table" /> -->
                        <Select v-model="searchGoodsTypeId" style="width:130px" placeholder="请选择商品类别..." class="search-table">
                            <Option v-for="item in rolesAdded" :value="item.goodsTypeId" :key="item.goodsTypeId">{{ item.goodsTypeName }}</Option>
                        </Select>
                        <Select v-model="searchStatus" style="width:130px" placeholder="请选择商品状态..." class="search-table">
                            <Option v-for="item in goodsStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择上架时间..." class="search-table"></DatePicker>
                        
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        
                        <Button type="primary" style="margin:0 30px;float:right" @click.prevent="toPost">新增</Button>
                    </Row>
                    
                    <!--<Row class="margin-top-10 searchable-table-con1">-->
                    <Row class="margin-top-10" style="stripe">
                    	<can-edit-table :loading="loading" @on-delete="remove" @on-change="put" v-model="data" :columns-list="columns" :roles="roles" :repositories="repositories" :providers="providers"></can-edit-table>
                    	<!-- 
                        <Table :columns="columns" :data="data"></Table>
                    	<can-edit-table  @on-delete="remove" @on-change="put" v-model="data" :columns-list="columns" :roles="goodsType"></can-edit-table>
                    	 -->
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>
                    
                </Card>
                
            </Col>
            
            <Modal title="新增" v-model="modalPost" @on-ok="post" class-name="vertical-center-modal">         
		        <Form :model="formItem" :label-width="80">
		            <FormItem label="商品名称">
		                <Input v-model="formItem.fullName" placeholder="请输入商品名称..."></Input>
		            </FormItem>
		            <FormItem label="商品类别">
		            	<Select v-model="formItem.goodsTypeId" style="width:160px" placeholder="请输入商品所属类别...">
		            		<Option v-for="item in roles" :value="item.goodsTypeId" :key="item.goodsTypeId">{{ item.goodsTypeName }}</Option>
		            	</Select>
		            </FormItem>
		            <FormItem label="常用仓库">
		            	<Select v-model="formItem.repositoryId" style="width:160px" placeholder="请输入商品常用仓库...">
		            		<Option v-for="item in repositories" :value="item.repositoryId" :key="item.repositoryId">{{ item.repositoryName }}</Option>
		            	</Select>
		            </FormItem>
		            <FormItem label="常用供应商">
		            	<Select v-model="formItem.providerId" style="width:160px" placeholder="请输入商品常用供应商...">
		            		<Option v-for="item in providers" :value="item.providerId" :key="item.providerId">{{ item.providerName }}</Option>
		            	</Select>
		            </FormItem>
		        </Form>
		    </Modal>
		    
        </Row>
	</div>
    
</template>

<script>
import Vue from 'vue';
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as goodsAPI from "../../api/goods";
import * as goodsTypeAPI from "../../api/goods-type";
import * as repositoriesAPI from "../../api/repositories";
import * as providersAPI from "../../api/providers";
import {formatDate} from '../../libs/date.js';
export default {
  name: "goods",
  components: {
      canEditTable
      //postForm
  },
  data() {
    return {
      loading : true,
      total: 0,
      goodsType:[],
      
      pageIndex: 1,
      pageSize: 10,
      searchGoodsId: "",
      searchFullName: "",
      
      searchGoodsTypeId: "",
      searchStatus: "",
      searchStartDate:"",
      searchEndDate:"",
      
      modalPost:false,
      formItem:{
    	  "fullName":"",
    	  "barCode": new Date().getTime(),
    	  "goodsTypeId":"",
    	  "status":1,
    	  "repositoryId":"",
    	  "beginDate":formatDate (new Date(), "yyyy-MM-dd hh:mm"),
    	  "createTime":formatDate (new Date(), "yyyy-MM-dd hh:mm:ss")
      },
      
      roles:[],
      
      repositories:[],
      
      providers:[],
      
      rolesAdded:[],
      
      date:1516000761000,
      
      columns: table.columns,
      data: [],
      
      goodsStateList: [
            {
                value: '',
                label: '全部'
            },
            {
                value: '0',
                label: '下架商品'
            },
            {
                value: '1',
                label: '正常出售'
            }
        ],
        dataSelect: {
            shortcuts: [
                {
                    text: '一周',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end];
                    }
                },
                {
                    text: '一个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end];
                    }
                },
                {
                    text: '三个月',
                    value () {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end];
                    }
                }
            ]
        }
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
    },
    //请求数据
    handleSearch() {
      this.loading = true;
      //request参数处理
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isGetCount: true,
        goodsId: this.searchGoodsId,
        fullName: this.searchFullName,
        
        goodsTypeId: this.searchGoodsTypeId,
        status:this.searchStatus,
        startTime:this.searchStartDate,
        endTime:this.searchEndDate
        
      };
      //这里才是发出的request请求，请求地址在get.函数中
      //response数据处理
      goodsAPI.get.r(params).then(res => {
        if(res.data){
            this.data = res.data;
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
      });
      //查询商品所属类型集合
      goodsTypeAPI.get.r().then(res =>{
    	  if(res.data){
    		  this.roles = res.data;
    		  
    		  if(this.rolesAdded.length === 0){
    			  Vue.set(this.rolesAdded, 0 ,{
    				  goodsTypeId : '',
    				  goodsTypeName : '全部'
    			  });
    			  this.roles.forEach(role => {
    				  this.rolesAdded.push({
    					  goodsTypeId : role.goodsTypeId,
    	    			  goodsTypeName : role.goodsTypeName
    				  });
    	          });
    		  }
    	  }else{
    		  this.roles = [];
    		  this.rolesAdded = [];
    	  }
      });
      
      repositoriesAPI.get.r().then(res => {
    	  if(res.data){
    		  this.repositories = res.data;
    	  }else {
    		  this.repositories = [];
    	  }
      });
      
      providersAPI.get.r().then(res => {
    	  if(res.data){
    		  this.providers = res.data;
    	  }else {
    		  this.providers = [];
    	  }
      });
      this.loading = false;
    },
    //切换页码
    changepage(index) {
      this.pageIndex = index;
      this.handleSearch();
    },
    //切换页码大小
    changeSize(size) {
      this.pageSize = size;
      this.handleSearch();
    },
    //选择时间
    getDate(value) {
        this.searchStartDate = value[0];
        this.searchEndDate = value[1];
    },
  	//新增界面展示
    toPost (index) {
      this.modalPost=true;
    },
    post () {
    	goodsAPI.post.r(this.formItem).then(res => {
        this.handleSearch();
      });  
    },
  	//删除数据
    remove (val,index) {
      let goodsId = val[index].goodsId;
      goodsAPI.remove.r(goodsId).then(res => {
        this.handleSearch();
      });      
    },
    //更新数据
    put (val,index) {
    	let rowData = val[index];
    	if(rowData.status === '0'){
    		//console.log('修改时间：' + new Date().getTime());
    		rowData.invalidDate = new Date().getTime();
    	}
    	/* 
    	if(rowData.status === '1'){
    		rowData.beginDate = new Date().getTime();
    	} */
    	goodsAPI.put.r(rowData).then(res => {
        	this.handleSearch();
      });  
    }

  },
  
  //页面加载完，在该处发起请求
  mounted() {
    this.init();
  }
};
</script>
