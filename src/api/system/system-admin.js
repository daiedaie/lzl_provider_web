import instance from '../index';
const preUrlPath = 'systemAdmin';

//管理员登录
const login = {
  r: params => {
    return instance.post(`${preUrlPath}/login`, params)
  }
};

//查询管理员
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改编辑管理员
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除编辑管理员
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增编辑管理员
const post = {
  r: params => {
    return instance.post(`${preUrlPath}`, params)
  }
};

export {
  login,
  get,
  put,
  remove,
  post
}
