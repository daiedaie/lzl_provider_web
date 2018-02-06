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
                        	<a href="#" slot="extra" @click.prevent="toPost" style="margin: 0 40px;">
            					<Icon type="android-add-circle"></Icon>
					                                     新增
					        </a>
					        
                    </p>
                    <Row>
                        <Input v-model="searchGoodsId" placeholder="请输入商品编号..." class="search-table" />
                        <Input v-model="searchFullName" placeholder="请输入商品名称..." class="search-table" />
                        
                        <Input v-model="searchGoodsTypeId" placeholder="请输入商品类别..." class="search-table" />
                        <Select v-model="searchStatus" placeholder="请选择商品状态..." class="search-table">
                            <Option v-for="item in goodsStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择下架时间..." class="search-table"></DatePicker>
                        
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    </Row>
                    
                    <!--<Row class="margin-top-10 searchable-table-con1">-->
                    <Row class="margin-top-10" style="stripe">
                    	<can-edit-table  @on-delete="remove" @on-change="put" v-model="data" :columns-list="columns" :roles="roles"></can-edit-table>
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
		                <Input v-model="formItem.goodsTypeId" placeholder="请输入商品所属类别..."></Input>
		            </FormItem>
		        </Form>
		    </Modal>
		    
        </Row>
	</div>
    
</template>

<script>
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as goodsAPI from "../../api/goods";
import * as goodsTypeAPI from "../../api/goods-type";
import {formatDate} from '../../libs/date.js';
export default {
  name: "goods",
  components: {
      canEditTable
      //postForm
  },
  data() {
    return {
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
    	  "goodsTypeId":"",
    	  "createTime":formatDate (new Date(), "yyyy-MM-dd hh:mm:ss"),
    	  "beginDate":formatDate (new Date(), "yyyy-MM-dd hh:mm")
      },
      
      roles:[],
      
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
            this.data = res.data
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
    	  }else{
    		  this.roles = [];
    	  }
      });
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
    	console.log(val[index]);
    	console.log(this.roles);
    	goodsAPI.put.r(val[index]).then(res => {
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
