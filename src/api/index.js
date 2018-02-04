import Vue from 'vue';
import axios from 'axios';
import store from '../store/index';

const instance = axios.create({
  baseURL: 'http://localhost:8088',
  timeout: 100000
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
        Vue.prototype.$Message.error("请求参数异常");
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
        // Vue.prototype.$Message.error('无访问权限，请联系公司管理员');
        break;
      case 500:
        Vue.prototype.$Message.error(error.response.data);
        break;
      default:
        Vue.prototype.$Message.error("服务端异常，请联系技术支持");
    }
  }
  return Promise.reject(error);
}
//错误处理
instance.interceptors.response.use(function (response) {
  return response;
}, catchError);



export default instance;