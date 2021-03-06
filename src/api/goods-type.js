import instance from './index';
const preUrlPath = '/goodsType';

//查询商品类型
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改商品类型
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除商品类型
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增商品类型
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