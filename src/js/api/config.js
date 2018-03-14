import Vue from 'vue';
import axios from 'axios';
import store from '../../store/index';

//global.PROJECT_URL = 'http://test.724h.com/apiadmin/'
global.PROJECT_URL = 'http://localhost:8088/'
global.URL_ORDERS = 'orders'
global.URL_SELLERAPPLY = 'sellerApply'
global.URL_SELLER = 'seller'
global.URL_SYSTEMCONFIG = 'systemConfig'
global.URL_SYSTEMADMIN = 'systemAdmin'
global.URL_SYSTEMRESOURCES = 'systemResources'
global.URL_SYSTEMROLES = 'systemRoles'
global.URL_SYSTEMRESOURCESROLES = 'systemResourcesRoles'
global.URL_PPLAT_PRODUCT = 'platProduct'
global.URL_PRODUCT = 'product'
global.URL_PRODUCT_CATE = 'productCate'
global.URL_PRODUCT_BRAND = 'productBrand'
global.URL_MEMBER = 'member'
global.URL_FEEDBACK = 'feedback'
global.URL_PCINDEXBANNER = 'pcIndexBanner'
global.URL_PLATPROMOTIONMODEL = 'platPromotionModel'
global.URL_PLATPROMOTIONSUBJECT = 'platPromotionSubject'
global.URL_PRESELL = 'presell'

global.URL_TAXRATE = 'taxRate'
global.URL_REPOSITORY = 'repository'
global.URL_GOODSCATE = 'goodsCate'

const instance = axios.create({
  baseURL: PROJECT_URL,
  timeout: TIMEOUT
});

instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
instance.defaults.withCredentials = true
//ajax错误处理
const catchError = function (error) {
  if (error.response) {
    switch (error.response.status) {
      case 302:
        //清空信息
        store.commit('logout');
        //跳转到登录界面
        location.href = "#/login";
      break;
      case 400:
        // console.log(error);
        // console.log(error.response.data.errors[0].defaultMessage);
        Vue.prototype.$Message.error(error.response.data.errors[0].defaultMessage || "请求参数异常");
        break;
      case 401:
        sessionStorage.removeItem('user');
        Vue.prototype.$message({
          message: error.response.data || '密码错误或账号不存在！',
          type: 'warning',
          onClose: function () {
            location.reload();
          }
        });
        break;
      case 403:
        location.href = "#/403";
        break;
      case 500:
        Vue.prototype.$Message.error(error.response.data.message || '服务端异常，请联系技术支持！');
        break;
      default:
        Vue.prototype.$Message.error("服务端异常，请联系技术支持！！");
    }
  }else{
    Vue.prototype.$Message.error("服务端异常，请联系技术支持！！！");
  }
  return Promise.reject(error);
}
//错误处理
instance.interceptors.response.use(function (response) {
  return response;
}, catchError);

export default instance;