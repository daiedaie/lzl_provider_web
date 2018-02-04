import instance from '../index';
const preUrlPath = 'systemRoles';

//查询角色
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改编辑角色
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

//分配权限
const permission = {
  r: params => {
    return instance.put(`systemResourcesRoles`, params)
  }
};


//查询资源
const getResources = {
  r: params => {
    return instance.get(`${preUrlPath}/resources/`+params)
  }
};


export {
  get,
  put,
  remove,
  post,
  permission,
  getResources
}
