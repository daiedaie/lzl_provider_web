import instance from './config';

//查询
const get = {
  request: (url,params) => {
    instance.defaults.responseType = 'json';
    return instance.get(url,{params})
  }
};
//更新
const put = {
  request: (url,params) => {
    return instance.put(url, params)
  }
};
//新增
const post = {
  request: (url,params) => {
    return instance.post(url, params)
  }
};
//删除
const remove = {
  request: (url,params) => {
    return instance.delete(url+`/`+params)
  }
};
//下载
const down = {
  request: (url,params) => {
    instance.defaults.responseType = 'blob';
    return instance.get(url+`/down`, {params})
  }
};
/*************************************************************上面是通用，下面是特殊 ***********************************************/
//管理员登录
const login = {
  request: (url,params) => {
    return instance.post(url+`/login`, params)
  }
};
//systemRoles查询资源
const getResources = {
  request: (url,params) => {
    return instance.get(url+`/resources/`+params)
  }
};

//二维码合成
const composeQrcode = {
  request: (url,params) => {
    return instance.get(url+`/composeQrcode`, {params})
  }
};

export {
  get,
  put,
  post,
  remove,
  down,
  login,
  getResources,
  composeQrcode
}
