import instance from '../index';
const preUrlPath = 'systemResources';

//查询资源
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改编辑资源
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除资源
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增资源
const post = {
  r: params => {
    return instance.post(`${preUrlPath}`,params)
  }
};

export {
  get,
  put,
  remove,
  post
}
