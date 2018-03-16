<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
.radioClass{
	width: 150px;  
    height: 80px;  
}
.bannerImg{
	width: 120px;  
    height: 80px; 
}
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
                        <Input v-model="params.name" placeholder="请输入分类名称" class="search-table" />
                        <Select v-model="params.status" placeholder="请选择状态" class="search-table">
                        	<Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择创建时间" class="search-table"></DatePicker>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toLevelType" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <tree-grid 
                            :items='data' 
                            :columns='columns'
                             @on-row-delete="remove" 
                             @on-row-edit="toEdit"
                        ></tree-grid>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
        
        <Modal :title="titlePostOrPut" v-model="modalPostOrPut" @on-ok="postOrPut" scrollable class-name="vertical-center-modal">         
          <Form :model="formItem" :label-width="100">
              <FormItem label="分类名称：">
                  <Row>
		              <Col span="22"><Input v-model="formItem.name" placeholder="请输入"></Input></Col>
		          </Row>
              </FormItem>
              <FormItem label="分类图标：">
                  <Row>
		              <Col span="8">
		              	<Upload
		                    ref="upload"
		                    :show-upload-list="false" :on-success="handleSuccess"
		                    :format="['jpg','jpeg','png']" :max-size="1024" with-credentials 
		                    :on-format-error="picHandleFormatError" :on-exceeded-size="handleMaxSize"
		                    type="drag" :action="uploadURL" class="bannerImg">
		                        <!-- 此处为什么可以回显？虽然后台返回了图片的名称，但该处的imgName并未被赋值 -->
		                        <img :src="imgUrl+imgName" class="bannerImg" >
		                </Upload>
		              </Col>
		              <Col span="8"><label>(图标要求：480*300)</label></Col>
		          </Row>
              </FormItem>

              <FormItem label="状态：">
                  <Row>
		              <Col span="16">
		              	  <Select v-model="formItem.status" placeholder="请输入">
		                  	<Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
		                  </Select>
		              </Col>
		          </Row>
              </FormItem>

              <!-- levelCopy的此部分只用于编辑显示，不传向后台 -->
              <div v-if="this.levelCopy != null && this.levelCopy != ''">
              	  <FormItem label="分类级别：">
                  	  <label>{{this.levelCopy==="0"?"一级":"二级"}}</label>
                  	  <Icon v-if="this.levelCopy==='0'" type="code-working" size="15" style="color: red"></Icon>
                  	  <Icon v-if="this.levelCopy==='-1'" type="code" size="15" style="color: red"></Icon>
              	  </FormItem>
              </div>
              <!-- this.levelType的此部分只用于新增显示，数据不传向后台 -->
              <div v-if="this.titlePostOrPut === '新增' && this.levelType != null && this.levelType != ''">
              	  <FormItem label="分类级别：">
	                  <label>{{this.levelType==="0"?"一级":"二级"}}</label>
	                  <Icon v-if="this.levelType==='0'" type="code-working" size="15" style="color: red"></Icon>
	                  <Icon v-if="this.levelType==='-1'" type="code" size="15" style="color: red"></Icon>
              	  </FormItem>
              </div>
              <!-- this.levelType的此部分只用于新增显示，数据传向后台 -->
              <div v-if="this.titlePostOrPut === '新增' && this.levelType === '-1'">
              	  <FormItem label="所属一级类别：">
	                  <Row>
			              <Col span="16">
			              	  <Select v-model="formItem.pid" placeholder="请输入">
			                  	<Option v-for="item in topLevelList" :value="item.id" :key="item.id">{{item.name}}</Option>
			                  </Select>
			              </Col>
			          </Row>
              	  </FormItem>
              </div>
              
          </Form>
        </Modal>
        <Modal v-model="modalLevel" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <span style="font-size:16px;">请选择分类级别</span>
	        </p>
	        <div style="text-align:center;height:auto">
                <RadioGroup v-model="levelType" @on-change="radioGroupOnChange" type="button" size="large">
			        <Row>
			            <Col span="11" style="text-align: left"><Radio class="radioClass" label="0">一级</Radio></Col>
				        <Col span="11" offset="2" style="text-align: left"><Radio class="radioClass" label="-1">二级</Radio></Col>
				    </Row>
			    </RadioGroup>
	        </div>
	        <div slot="footer">
	            <Button type="error" long @click="toPost">确定</Button>
	        </div>
	    </Modal>
    </div>
</template>

<script>
import * as table from "./data/goods-cate";
import canEditTable from '../my-components/table-edit/common.vue';
import * as common from "../../js/util/common";
import TreeGrid from '../my-components/table-edit/treeGrid2.0';
import * as api from "../../js/api/request";
import {formatDate} from '../../js/util/common.js';
export default {
  name: "goods-cate",
  components: {
      canEditTable,
      TreeGrid
  },
  data() {
    return {
      params:{name:'', status:'', searchStartTime:'', searchEndTime:''},
      columns: table.columns,
      data: [],
      topLevelList: [],
      
      imgName: '',visible: false,//Modal展示控制
      imgUrl:IMGURL,
      uploadURL:PROJECT_URL+URL_GOODSCATE+'/picUpload',
      
      modalPostOrPut:false,
      titlePostOrPut:'',
     
      modalLevel:false,
      levelType: '0',
      levelCopy: '',
      
      formItem:{},
      statusList:table.statusList,
      
      dataSelect: common.dataSelect,
    };
  },
  methods: {
    //初始化
    init() {
      this.handleSearch();
    },
    //请求数据
    handleSearch() {
      //response数据处理
      api.get.request(URL_GOODSCATE,this.params).then(res => {
        if(res.data){
            this.data = res.data
        }else{
            this.data = [];
        }
      });
      api.get.request(URL_GOODSCATE + "/getTopLevel").then(res => {
      	if (res.data) {
            this.topLevelList = res.data;
          } else {
            this.topLevelList = [];
          }
      });
    },
  //进入仓库层次选择的Modal
    toLevelType() {
    	this.levelType = '0'; //默认仓库层次为一级
    	this.modalLevel = true;
    },
    //将选择的结果设置到this.levelType中
    radioGroupOnChange(levelLabel) {
    	this.levelType = levelLabel;
    },
    postOrPut() {
    	if(this.titlePostOrPut === "新增"){
    		this.post();
    	}
    	if(this.titlePostOrPut === "编辑"){
    		this.put();
    	}
    },
    //新增界面展示
    toPost () {
    	this.modalLevel = false;
    	//将levelCopy置空，不使edit的回显内容显示
    	this.levelCopy = "";
    	this.formItem = {};
    	this.imgName = "";
    	this.formItem.pid = this.levelType;
    	this.titlePostOrPut = "新增";
    	this.modalPostOrPut=true;
    },
    //新增数据
    post () {
      if(this.levelType==='0'){
    	  this.formItem.pid = 0;
    	  this.formItem.grade = 1;
      }else{
    	  this.formItem.grade = 2;
      }
      this.formItem.pic = this.imgName;
      api.post.request(URL_GOODSCATE,this.formItem).then(res => {
        this.handleSearch();
      });  
      this.formItem = {};
    },
  	//删除数据
    remove(data, event, index) {
    	let id = data.id;
    	api.remove.request(URL_GOODSCATE, id).then(res => {
            this.handleSearch();
        });  
    },
  	
    toEdit(data, event, index) {
    	this.titlePostOrPut = "编辑";
    	this.formItem = {};
    	this.formItem = data;
    	this.imgName = data.pic;
    	if(this.formItem.pid != null){
    		if(this.formItem.pid == 0){
	    		this.levelCopy = "0";
    		}
    		if(this.formItem.pid != 0){
	    		this.levelCopy = "-1";
    		}
    	}
    	this.modalPostOrPut=true;
    },
  	//更新数据
    put() {
    	this.formItem.pic = this.imgName;
    	api.put.request(URL_GOODSCATE,this.formItem).then(res => {
            this.handleSearch();
        }); 
    },
    
    //展示图片详情
    handleView (name) {
        this.imgName = IMGURL+name;
        this.visible = true;
    },
  	//选择时间
    getDate(value) {
        this.params.searchStartTime = value[0];
        this.params.searchEndTime = value[1];
    },
  //文件上传
    picHandleFormatError(file) {
        this.$Notice.warning({
            title: '文件格式不正确，仅支持jpg或png或jpeg',duration:4
        });
    },
    handleMaxSize (file) {
        this.$Notice.warning({
            title: '文件大小不能超过1M',duration:4
        });
    },
    handleSuccess (res, file) {
        this.imgName=res;
        this.$Notice.success({
            title: '上传成功',duration:2
        });
    },
    handleError (res, file) {
        this.$Notice.error({
            title: file?file.message:"上传异常，请联系系统管理员",duration:4
        });
    },
  },
  mounted() {
    this.init();
  }
};
</script>
