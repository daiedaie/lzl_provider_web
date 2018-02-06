import instance from '../index';
const preUrlPath = 'providerUser';

//供应商用户登录
const login = {
  r: params => {
    return instance.post(`${preUrlPath}/login`, params)
  }
};

//查询供应商用户
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改编辑供应商用户
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除编辑供应商用户
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
