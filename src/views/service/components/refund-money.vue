<style>
/* ==============图片上传样式=========== */
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
/* ==============图片上传样式=========== */
	form.refundForm{
		width:400px;
	}
	.choices{
		/* font-size:17px; */
		color:red;
	}
	#orderDetail{
		font-size:20px;
	}
</style>

<template>
    <div>
        <Row :gutter="10">
            <Col>
                <Card :bordered="false" dis-hover>
                    <Icon type="clipboard" size="20" style="color: #3399ff"></Icon>
                        <label id="orderDetail"><b>此订单详情</b></label>
                    	<br>
                    <Row class="margin-top-10 margin-bottom-20" style="stripe">
                        <Table :columns="orderRefundColumns" :data="orderRefundData" ref="tableCsv"></Table>
                    </Row>

                    <Row class="margin-top-10" style="stripe">
	                    <Form class="refundForm" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90">
					        <label class="choices"><b>退款服务</b></label>
					        <br><br>
					        <FormItem label="退款原因：" prop="reason">
					            <Select v-model="formValidate.reason" placeholder="选择退款原因">
					                <Option value="lack">货物不全</Option>
					                <Option value="wrong">货不对号</Option>
					                <Option value="broken">货物损坏</Option>
					                <Option value="others">其他原因</Option>
					            </Select>
					        </FormItem>
					        
					        <FormItem label="退款金额：" prop="moneyBack">
					            <label>￥{{ this.moneyBackCopy }}</label>
					            <!-- <Input v-model="formValidate.moneyBack" placeholder="退款金额"></Input> -->
					        </FormItem>
					        
					        <FormItem label="退款方式：" prop="refundMode">
					            <Select v-model="formValidate.refundMode" placeholder="选择退款方式">
					                <Option value="alipay">支付宝</Option>
					                <Option value="WeChat">微信</Option>
					                <Option value="card">银行卡</Option>
					                <Option value="cash">现金</Option>
					                <Option value="others">其他方式</Option>
					            </Select>
					        </FormItem>
					        
					        <FormItem label="退款说明：" prop="refundDesc">
					            <Input v-model="formValidate.refundDesc" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入内容..."></Input>
					        </FormItem>
					        
					        <FormItem label="上传图片：" prop="refundPics">
					            <!-- <Input v-model="formValidate.refundDesc" type="file" id="pic_selector" multiple></Input>multiple，可选择多张图片   -->
					        	<template>
								    <div class="demo-upload-list" v-for="item in uploadList">
								        <template v-if="item.status === 'finished'">
								            <img :src="item.url">
								            <div class="demo-upload-list-cover">
								                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
								                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
								            </div>
								        </template>
								        <template v-else>
								            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
								        </template>
								    </div>
								    <Upload
								        ref="upload"
								        :show-upload-list="false"
								        :default-file-list="defaultList"
								        :on-success="handleSuccess"
								        :format="['jpg','jpeg','png']"
								        :max-size="2048"
								        :on-format-error="handleFormatError"
								        :on-exceeded-size="handleMaxSize"
								        :before-upload="handleBeforeUpload"
								        multiple
								        type="drag"
								        action="//jsonplaceholder.typicode.com/posts/"
								        style="display: inline-block;width:58px;">
								        <div style="width: 58px;height:58px;line-height: 58px;">
								            <Icon type="camera" size="20"></Icon>
								        </div>
								    </Upload>
								    <Modal title="View Image" v-model="visible">
								        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
								    </Modal>
							    </template>
					        </FormItem>
					        
					        <FormItem>
					            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
					            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
					        </FormItem>
					    </Form>
	                    
                    </Row>
                    
                </Card>
                
            </Col>
            
        </Row>
    </div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import * as table from "../data/search";
import instance from '../../../api/index';
import * as providerOrdersAPI from "../../../api/provider-orders";

export default {
	name: "refundMoney",
	data () {
        return {
            orderSn:0,

		    orderRefundColumns: table.orderRefundColumns,
		    orderRefundData: [],
			
		    moneyBackCopy:'',
		    
        	formValidate: {
                type: '1',
                reason: '',
                moneyBack: '',
                refundMode: '',
                
                refundDesc: '',
                refundPics: '',
            },
            ruleValidate: {
                reason: [
                    { required: true, message: '该项不能为空', trigger: 'change' }
                ],
                refundMode: [
                	{ required: true, message: '该项不能为空', trigger: 'change' }
                ],
            },
            //=======图片上传数据=================================
            defaultList: [
                {
                    'name': 'a42bdcc1178e62b4694c830f028db5c0',
                    'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                },
                {
                    'name': 'bc7521e033abdd1e92222d733590f104',
                    'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                }
            ],
            imgName: '',
            visible: false,
            uploadList: []
          //=======图片上传数据=================================
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
	        orderSn: this.orderSn
	      };
	      
	      providerOrdersAPI.get.r(params).then(res => {
	        if(res.data){
	            this.orderRefundData = res.data;
	            
	            let orderGoodsData = this.orderRefundData[0].ordersGoods;
	            let totalGoodsMoney = 0;
	            for(let i=0;i<orderGoodsData.length;i++){
	            	totalGoodsMoney += orderGoodsData[i].moneyPrice * orderGoodsData[i].number;
	            }
	            
	            let payMoney = totalGoodsMoney - this.orderRefundData[0].expressMoney - this.orderRefundData[0].taxMoney;
	            this.formValidate.moneyBack = payMoney;
	            this.moneyBackCopy = payMoney;
	            
	        }else{
	            this.orderRefundData = [];
	        }
	      });
	    },
	    
	    //===============表单提交=============================
	    handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
      	//===============表单提交=============================
    	  
        //==============图片上传方法==============================
		handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            console.log("图片上传成功");
        	if(refundPics ===''){
            	refundPics += file.name;
            }else{
            	refundPics = refundPics + ',' + file.name;
            }
        	file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            console.log("所有图片:" + refundPics);
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: 'Up to five pictures can be uploaded.'
                });
            }
            return check;
        }
        //==============图片上传方法==============================
    },
    
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
        this.orderSn = this.$route.params.orderSn;
    	this.init();
    }
}
</script>
