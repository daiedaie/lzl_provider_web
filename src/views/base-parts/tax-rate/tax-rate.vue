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
                        <Input v-model="params.taxRateName" placeholder="请输入税率名称" class="search-table" />
                        <span @click="handleSearch" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        <span @click="toPost" style="margin: 0 40px;float:right"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <can-edit-table  @on-delete="remove" @on-change="put" v-model="data" :columns-list="columns"></can-edit-table>
                    </Row>
                    <Row class="margin-top-10">
                        <Page :total="total" show-elevator :page-size='params.pageSize' :current='params.pageIndex' class="page" show-total  show-sizer @on-change="changepage" @on-page-size-change="changeSize"></Page>
                    </Row> 
                </Card>
            </Col>
        </Row>
        <Modal title="新增" v-model="modalPost" @on-ok="post" class-name="vertical-center-modal">         
          <Form :model="formItem" :label-width="80">
              <FormItem label="税率名称">
                  <Input v-model="formItem.taxRateName" placeholder="请输入"></Input>
              </FormItem>
              <FormItem label="税率">
                  <Input v-model="formItem.rate" placeholder="请输入"></Input>
              </FormItem>
          </Form>
        </Modal>
    </div>
</template>

<script>
import * as table from "./data/tax-rate";
import canEditTable from '../../my-components/table-edit/canEditTable.vue';
import * as api from "../../../js/api/request";
export default {
  name: "tax-rate",
  components: {
      canEditTable
  },
  data() {
    return {
      params:{pageIndex: 1, pageSize: 10,isGetCount: true,taxRateName:''},
      total: 0,
      modalPost:false,
      columns:table.columns,
      data: [],
      formItem:{"taxRateName":"","rate":""}
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
      api.get.request(URL_TAXRATE,this.params).then(res => {
        if (res.data) {
          this.data = res.data;
        } else {
          this.data = [];
            if(this.params.pageIndex!=1){
                this.params.pageIndex=1;
                this.handleSearch();
            }
        }
        this.total = parseInt(res.headers.total);
      });
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
    //新增界面展示
    toPost (index) {
      this.modalPost=true;
    },
    //新增数据
    post () {
      api.post.request(URL_TAXRATE,this.formItem).then(res => {
        this.handleSearch();
      });  
    },
    //删除数据
    remove (val,index) {
      let taxRateId = val[index].taxRateId;
      api.remove.request(URL_TAXRATE,taxRateId).then(res => {
        this.handleSearch();
      });      
    },
    //更新数据
    put (val,index) {
      api.put.request(URL_TAXRATE,val[index]).then(res => {
        this.handleSearch();
      });  
    }
  },
  mounted() {
    this.init();
  }
};

</script>
