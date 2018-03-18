import instance from './index';
const preUrlPath = '/refund';

//查询商品
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改商品
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除商品
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增商品
const post = {
  r: params => {
    return instance.post(`${preUrlPath}`,params)
  }
};

const down = {
  r: params => {
    // 在实例已创建后修改默认值
    instance.defaults.responseType = 'blob';
    return instance.get(`${preUrlPath}/down`, {params})
  }
};


export {
  get,
  put,
  remove,
  post,
  down
}