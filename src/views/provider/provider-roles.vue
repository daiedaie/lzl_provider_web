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
                        <Input v-model="searchProviderRolesName" placeholder="请输入角色名称..." class="search-table" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        
                        <span @click="toPost" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table  @on-delete="remove" @on-change="put" @on-resources="toPermission" v-model="data" :load="loading" :columns-list="columns"></can-edit-table>
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
                <Input v-model="formItem.providerRolesName" placeholder="请输入角色名称..."></Input>
            </FormItem>
            <FormItem label="角色描述">
                <Input v-model="formItem.content" placeholder="请输入角色描述..."></Input>
            </FormItem>
            <FormItem label="角色编码">
                <Input v-model="formItem.providerRolesCode" placeholder="请输入角色编码..."></Input>
            </FormItem>
          </Form>
        </Modal>
        <Modal title="权限分配" v-model="modalOther" @on-cancel="cancel" @on-ok="permission" class-name="vertical-center-modal"> 
          <Scroll height="450">
            <Tree :data="resources" show-checkbox multiple  @on-check-change="treeSelect"></Tree>
          </Scroll>        
        </Modal>
    </div>
</template>

<script>
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as api from "../../api/provider/provider-roles";
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
      searchProviderRolesName: "",
      modalPost:false,
      modalOther:false,
      loading:false,
      resourcesIds:[],
      roleId:0,
      columns: table.roles_columns,
      data: [],
      formItem:{"providerRolesName":"","content":"","providerRolesCode":"","status":1, "createTime":new Date().getTime()},
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
      this.loading = true;
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        isGetCount: true,
        providerRolesName: this.searchProviderRolesName
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
    //分配权限界面展示(将所有的权限都展示出来，无论其是不是该用户的权限)
    toPermission (val,index) {
      this.roleId = val[index].providerRolesId;
      //①. 通过apiResources查询出所有的资源，并查询出该角色所拥有的资源，该角色所拥有的资源显示为选中状态
      apiResources.get.r({providerRolesId:this.roleId}).then(res => {
        this.resources = res.data;
      });
      //到达 分配权限界面 之前还要查询到该角色的所有权限，原因如下：
      //②. 通过api查询出该角色所拥有的资源
      
      // 从ProviderRolesController类中查询出该角色拥有的资源resourcesIds
      // 要先给this.resourcesIds赋值，因为treeSelect(data)不一定被执行，
      // 当treeSelect不被执行时，resourcesIds就为空了，保存时就出问题了
      api.getResources.r(val[index].providerRolesId).then(res => {
    	  this.resourcesIds = res.data;
      });
      
      this.modalOther=true;
    },
    // 权限选择(选择时自动触发，只需将选到的内容的id记录下来便可)
    // 点击复选框时触发        返回值:当前已勾选节点的数组
    treeSelect(data){
      //console.log(data);
      let resources_id = [];
      for (let i = 0; i < data.length; i++) {
    	  //data中存储的是所有的system_resources对象
          resources_id.push(data[i].id);
      }
      this.resourcesIds = resources_id;
    },
    //分配权限
    permission () {
      let params = {
    	providerRolesId: this.roleId,
        resourcesIds: this.resourcesIds,
      };
      alert(params.providerRolesId);
      alert(params.resourcesIds);
      api.permission.r(params).then(res => {
        this.$Message.success('权限分配成功');
      });
      // 分配权限成功之后，要清除分配记录，以免影响下次对其他角色的权限分配
      this.resourcesIds = [];
      this.roleId = 0;
      this.handleSearch();
    },
    cancel () {
        // 分配权限未成功，也要清除toPermission中的分配记录，以免影响下次对其他角色的权限分配
        this.resourcesIds = [];
        this.resources = [];
        this.roleId = 0;
    },
    //新增界面展示
    toPost (index) {
      // 防止回显
      this.formItem = {"status":1, "createTime":new Date().getTime()},
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
      let id = val[index].providerRolesId;
      api.remove.r(id).then(res => {
        this.handleSearch();
      });
    },
    //更新数据
    put (val,index) {
      let rowData = val[index];
      rowData.modifyTime = new Date().getTime();
      api.put.r(rowData).then(res => {
        this.handleSearch();
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
