<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
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
                        <Input v-model="searchRolesName" placeholder="请输入角色名称..." class="search-table" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        
                        <span @click="toPost" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table  @on-delete="remove" @on-change="put" @on-resources="toPermission" v-model="data" :columns-list="columns"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row>                    
                </Card>                
            </Col>
        </Row>
        <Modal title="新增" v-model="modalPost" @on-ok="post" class-name="vertical-center-modal">         
          <Form :model="formItem" :label-width="80">
            <FormItem label="角色名称">
                <Input v-model="formItem.rolesName" placeholder="请输入角色名称..."></Input>
            </FormItem>
            <FormItem label="角色描述">
                <Input v-model="formItem.content" placeholder="请输入角色描述..."></Input>
            </FormItem>
            <FormItem label="角色编码">
                <Input v-model="formItem.roleCode" placeholder="请输入角色编码..."></Input>
            </FormItem>
          </Form>
        </Modal>
        <Modal title="权限分配" v-model="modalOther"  @on-ok="permission" class-name="vertical-center-modal"> 
          <Scroll height="450">
            <Tree :data="resources" show-checkbox multiple  @on-check-change="treeSelect"></Tree>
          </Scroll>        
        </Modal>
    </div>
</template>

<script>
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as api from "../../api/system/system-roles";
import * as apiResources from "../../api/system/system-resources";
export default {
  name: "seller-order",
  components: {
      canEditTable
  },
  data() {
    return {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      searchRolesName: "",
      modalPost:false,
      modalOther:false,
      resourcesIds:[],
      roleId:0,
      columns: table.roles_columns,
      data: [],
      formItem:{"rolesName":"","content":"","roleCode":""},
      resources: []
    };
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
        rolesName: this.searchRolesName
      };
      //response数据处理
      api.get.r(params).then(res => {
        if(res.data){
            this.data = res.data
        }else{
            this.data = [];
            this.pageIndex=1;
        }
        this.total = parseInt(res.headers.total);
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
    //分配权限界面展示
    toPermission (val,index) {
      this.roleId = val[index].id;
      apiResources.get.r({rolesId:val[index].id}).then(res => {
        this.resources = res.data;
      });
      //获取该角色下的权限
      api.getResources.r(val[index].id).then(res => {
        this.resourcesIds = res.data;
      });
      this.modalOther=true;
    },
    //权限选择
    treeSelect(data){
      let resources_id = [];
      for (let i = 0; i < data.length; i++) {
          resources_id.push(data[i].id);
      }
      this.resourcesIds = resources_id;
    },
    //分配权限
    permission () {
      let params = {
        rolesId: this.roleId,
        resourcesIds: this.resourcesIds,
      };
      api.permission.r(params).then(res => {
        this.$Message.success('权限分配成功');
      });
      this.resourcesIds = [];
      this.roleId = 0;
      this.handleSearch();
    },
    //新增界面展示
    toPost (index) {
      this.modalPost=true;
    },
    //新增数据
    post () {
      api.post.r(this.formItem).then(res => {
        this.handleSearch();
      });  
    },
    //删除数据
    remove (val,index) {
      let id = val[index].id;
      api.remove.r(id).then(res => {
        this.handleSearch();
      });      
    },
    //更新数据
    put (val,index) {
      api.put.r(val[index]).then(res => {
        this.handleSearch();
      });  
    }
  },
  mounted() {
    this.init();
  }
};
</script>
