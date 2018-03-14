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
                        <Input v-model="searchUsername" placeholder="请输入账号..." class="search-table" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toPost" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table  @on-delete="remove" @on-change="put" v-model="data" :load="loading" :columns-list="columns" :roles="roles"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='pageSize' :current='pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row> 
                </Card>
            </Col>
        </Row>
        <!-- <post-form :roles="roles" :formItem="formItem" :modalPost="modalPost"></post-form> -->
        <Modal title="新增" v-model="modalPost" @on-ok="post" class-name="vertical-center-modal">         
          <Form :model="formItem" :label-width="80">
              <FormItem label="账号">
                  <Input v-model="formItem.username" placeholder="请输入账号..."></Input>
              </FormItem>
              <FormItem label="密码">
                  <Input type="password" v-model="formItem.password" placeholder="请输入密码">
                      <span slot="prepend">
                          <Icon :size="14" type="locked"></Icon>
                      </span>
                  </Input>
              </FormItem>
              <FormItem label="角色">
                  <Select v-model="formItem.providerRolesId">
                      <Option v-for="item in roles" :value="item.providerRolesId" :key="item.providerRolesId">{{ item.providerRolesName }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="联系电话">
                  <Input v-model="formItem.phone" placeholder="请输入联系电话..."></Input>
              </FormItem>
          </Form>
        </Modal>
    </div>
</template>

<script>
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as api from "../../api/provider/provider-user";
import * as apiRole from "../../api/provider/provider-roles";
export default {
  name: "provider-user",
  components: {
      canEditTable
  },
  data() {
    return {
      total: 0,
      pageIndex: 1,
      roles:[],
      pageSize: 10,
      searchUsername: "",
      modalPost:false,
      loading:true,
      columns:table.user_columns,
      data: [],
      formItem:{"username":"","password":"","providerRolesId":"","phone":"","state":1,"createTime":new Date().getTime()}
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
        username: this.searchUsername
      };
      //response数据处理
      api.get.r(params).then(res => {
        if (res.data) {
          this.data = res.data;
        } else {
          this.data = [];
          this.pageIndex = 1;
        }
        this.total = parseInt(res.headers.total);
      });
      apiRole.get.r().then(res => {
        this.roles = res.data;
        console.log(this.roles);
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
    //新增界面展示
    toPost (index) {
      this.formItem = {"state":1,"createTime":new Date().getTime()};
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
      let id = val[index].userId;
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
