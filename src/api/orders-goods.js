import instance from './index';
const preUrlPath = '/ordersGoods';

//查询订单商品
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改订单商品
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除订单商品
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增订单商品
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