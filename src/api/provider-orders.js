import instance from './index';
const preUrlPath = '/providerOrders';

//查询订单
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
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
  down
}
