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
                        <Input v-model="searchName" placeholder="请输入账号..." class="search-table" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toPost" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table  @on-delete="remove" @on-change="put" v-model="data" :columns-list="columns" :roles="roles"></can-edit-table>
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
                  <Input v-model="formItem.name" placeholder="请输入账号..."></Input>
              </FormItem>
              <FormItem label="密码">
                  <Input type="password" v-model="formItem.password" placeholder="请输入密码">
                      <span slot="prepend">
                          <Icon :size="14" type="locked"></Icon>
                      </span>
                  </Input>
              </FormItem>
              <FormItem label="角色">
                  <Select v-model="formItem.roleId">
                      <Option v-for="item in roles" :value="item.id" :key="item.id">{{ item.rolesName }}</Option>
                  </Select>
              </FormItem>
              <FormItem label="联系电话">
                  <Input v-model="formItem.tel" placeholder="请输入联系电话..."></Input>
              </FormItem>
          </Form>
        </Modal>
    </div>
</template>

<script>
import * as table from "./data/search";
import canEditTable from './components/canEditTable.vue';
import * as api from "../../api/system/system-admin";
import * as apiRole from "../../api/system/system-roles";
export default {
  name: "system-admin",
  components: {
      canEditTable
  },
  data() {
    return {
      total: 0,
      pageIndex: 1,
      roles:[],
      pageSize: 10,
      searchName: "",
      modalPost:false,
      columns:table.admin_columns,
      data: [],
      formItem:{"name":"","password":"","roleId":"","tel":"","status":1}
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
        name: this.searchName
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
