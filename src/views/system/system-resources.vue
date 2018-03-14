<template>
        <Row :gutter="10">
            <Col>
                <Card>
                    <Row>
                        <span @click="toPost" style="float:left"><Button type="primary">新增</Button></span>
                    </Row>
                    <Row class="margin-top-10" style="stripe">
                        <tree-grid 
                            :items='data' 
                            :columns='columns'
                            @on-row-click='rowClick'
                            @on-row-delete='rowDelete'
                            @on-selection-change='selectionClick'
                            @on-sort-change='sortClick'
                        ></tree-grid>
                    </Row>

                </Card>
            </Col>
            <Modal title="新增" v-model="modalPost" @on-ok="post" class-name="vertical-center-modal">         
                <Form :model="formItem" :label-width="80">
                    <FormItem label="名称">
                        <Input v-model="formItem.url" placeholder="请输入资源名称..."></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="formItem.content" placeholder="请输入资源备注..."></Input>
                    </FormItem>
                </Form>
            </Modal>
        </Row>
</template>
<script>
import TreeGrid from "./components/treeGrid2.0";
import * as api from "../../api/system/system-resources";
export default {
  components: {
    TreeGrid
  },
  data() {
    return {
      modalPost:false,
      formItem:{"url":"","content":""},
      columns: [
        // {
        //   type: "selection",
        //   width: "50"
        // },
        {
          title: "编码",
          key: "id",
          width: "150"
        },
        {
          title: "名称",
          key: "url",
          width: "150"
        },
        {
          title: "备注",
          key: "content",
          width: "150"
        },
        {
          title: "创建时间",
          key: "createTime",
          width: "150"
        },
        {
          title: "操作",
          type: "action",
          actions: true,
          width: "100",
          align:"center"
        }
      ],
      data: []
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
        isGetCount: true
        //name: this.searchName
      };
      //response数据处理
      api.get.r(params).then(res => {
        this.data = res.data;
      });
    },
    rowClick(data, index, event) {
      console.log("当前行数据:" + data.code);
      console.log("点击行号:" + index);
      console.log("点击事件:" + event);
    },
    rowDelete(data, index, event) {
      api.remove.r(data.id).then(res => {
        this.handleSearch();
      });
    },
    //新增界面展示
    toPost (index) {
      this.modalPost=true;
    },
    post () {
      api.post.r(this.formItem).then(res => {
        this.handleSearch();
      });  
    },
    selectionClick(arr) {
      console.log("选中数据id数组:" + arr);
    },
    sortClick(key, type) {
      console.log("排序字段:" + key);
      console.log("排序规则:" + type);
    }
  },
  mounted() {
    this.init();
  }
};
</script>