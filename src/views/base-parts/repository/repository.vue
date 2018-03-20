<style lang="less">
@import "../../../styles/common.less";
@import "../../../styles/table.less";
.radioClass{
	width: 150px;  
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
                        <Input v-model="params.repositoryName" placeholder="请输入仓库名称" class="search-table" />
                        <Select v-model="params.status" placeholder="请选择仓库状态" class="search-table">
                        	<Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                        <Select v-model="params.available" placeholder="请选择仓库是否可用" class="search-table">
                        	<Option v-for="item in availableList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                        <DatePicker type="daterange" :options="dataSelect" @on-change="getDate" placement="bottom-end" placeholder="请选择仓库创建时间" class="search-table"></DatePicker>
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toLevelType" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <tree-grid :items='data' :columns='columns' @on-row-delete="remove" @on-row-edit="toEdit"></tree-grid>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal :title="titlePostOrPut" v-model="modalPostOrPut" @on-ok="postOrPut" scrollable class-name="vertical-center-modal">         
          <Form :model="formItem" :label-width="100">
              <FormItem label="仓库名称：">
                  <Row>
		              <Col span="22"><Input v-model="formItem.repositoryName" placeholder="请输入"></Input></Col>
		          </Row>
              </FormItem>
              <FormItem label="仓库地址：">
              	  <Row>
		              <Col span="22"><Input v-model="formItem.address" placeholder="请输入"></Input></Col>
		          </Row>
              </FormItem>
              <FormItem label="仓库虚实：">
                  <Row>
		              <Col span="16">
		              	  <Select v-model="formItem.realVirtual" placeholder="请输入">
		                  	<Option v-for="item in realVirtualList" :value="item.value" :key="item.value">{{item.label}}</Option>
		                  </Select>
		              </Col>
		          </Row>
              </FormItem>
              <FormItem label="库存状态：">
                  <Row>
		              <Col span="16">
		              	  <Select v-model="formItem.status" placeholder="请输入">
		                  	<Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
		                  </Select>
		              </Col>
		          </Row>
              </FormItem>
              <FormItem label="是否停用：">
                  <Row>
		              <Col span="16">
		              	  <Select v-model="formItem.available" placeholder="请输入">
		                  	<Option v-for="item in availableList" :value="item.value" :key="item.value">{{item.label}}</Option>
		                  </Select>
		              </Col>
		          </Row>
              </FormItem>
              <!-- levelCopy的此部分只用于编辑显示，不传向后台 -->
              <div v-if="this.levelCopy != null && this.levelCopy != ''">
              	  <FormItem label="仓库层次：">
                  	  <label>{{this.levelCopy==="0"?"一级":"二级"}}</label>
                  	  <Icon v-if="this.levelCopy==='0'" type="code-working" size="15" style="color: red"></Icon>
                  	  <Icon v-if="this.levelCopy==='-1'" type="code" size="15" style="color: red"></Icon>
                  	  <!-- <Row>
		              <Col span="16">
		              	  <Select v-model="formItem.level" placeholder="请输入">
		                  	<Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                  </Select>
		              </Col>
		              </Row> -->
              	  </FormItem>
              </div>
              <!-- this.levelType的此部分只用于新增显示，数据不传向后台 -->
              <div v-if="this.titlePostOrPut === '新增' && this.levelType != null && this.levelType != ''">
              	  <FormItem label="仓库层次：">
	                  <label>{{this.levelType==="0"?"一级":"二级"}}</label>
	                  <Icon v-if="this.levelType==='0'" type="code-working" size="15" style="color: red"></Icon>
	                  <Icon v-if="this.levelType==='-1'" type="code" size="15" style="color: red"></Icon>
              	  </FormItem>
              </div>
              <!-- this.levelType的此部分只用于新增显示，数据传向后台 -->
              <div v-if="this.titlePostOrPut === '新增' && this.levelType === '-1'">
              	  <FormItem label="所属一级仓库：">
	                  <Row>
			              <Col span="16">
			              	  <Select v-model="formItem.levelType" placeholder="请输入">
			                  	<Option v-for="item in topLevelList" :value="item.repositoryId" :key="item.repositoryId">{{item.repositoryName}}</Option>
			                  </Select>
			              </Col>
			          </Row>
              	  </FormItem>
              </div>
              
          </Form>
        </Modal>
        <Modal v-model="modalLevel" width="360">
	        <p slot="header" style="color:#f60;text-align:center">
	            <span style="font-size:16px;">请选择仓库层次</span>
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
import * as table from "./data/repository";
import * as common from "../../../js/util/common";
import treeGrid from '../../my-components/table-edit/treeGrid2.0.vue';
import * as api from "../../../js/api/request";
import {formatDate} from '../../../js/util/common.js';
export default {
  name: "repository",
  components: {
	  treeGrid
  },
  data() {
    return {
      params:{repositoryName:"", status:"", available:"",searchStartTime:"",searchEndTime:""},
      modalPostOrPut:false,
      modalLevel:false,
      levelType: '0',
      levelCopy: '',
      
      titlePostOrPut:'',
      columns:table.columns,
      data: [],
      
      dataSelect: common.dataSelect,
      
      formItem:{},
      realVirtualList: table.realVirtualList,
      statusList: table.statusList,
      availableList: table.availableList,
      topLevelList: [],

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
      api.get.request(URL_REPOSITORY,this.params).then(res => {
    	if (res.data) {
          this.data = res.data;
        } else {
          this.data = [];
        }
      });
      
      api.get.request(URL_REPOSITORY + "/getTopLevel").then(res => {
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
    	//将levelCopy置空，不
    	this.levelCopy = "";
    	this.formItem = {};
    	this.formItem.levelType = this.levelType;
    	this.titlePostOrPut = "新增";
    	this.modalPostOrPut=true;
    },
    //新增数据
    post () {
      if(this.levelType==='0'){
    	  this.formItem.levelType = 0;
      }
      api.post.request(URL_REPOSITORY,this.formItem).then(res => {
        this.handleSearch();
      });  
      this.formItem = {};
    },
  	//删除数据
    remove(data, event, index) {
    	let id = data.repositoryId;
    	api.remove.request(URL_REPOSITORY, id).then(res => {
            this.handleSearch();
        });  
    },
  	
    toEdit(data, event, index) {
    	this.titlePostOrPut = "编辑";
    	this.formItem = {};
    	this.formItem = data;
    	if(this.formItem.levelStr != null && this.formItem.levelStr != ""){
    		if(this.formItem.levelStr === "一级"){
	    		this.levelCopy = "0";
    		}
    		if(this.formItem.levelStr === "二级"){
	    		this.levelCopy = "-1";
    		}
    	}
    	this.modalPostOrPut=true;
    },
  	//更新数据
    put() {
    	api.put.request(URL_REPOSITORY,this.formItem).then(res => {
            this.handleSearch();
        }); 
    },
  	//选择时间
    getDate(value) {
        this.params.searchStartTime = value[0];
        this.params.searchEndTime = value[1];
    }
    
  },
  mounted() {
    this.init();
  }
};

</script>
