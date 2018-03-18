import instance from './index';
const preUrlPath = 'repositories';

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

export {
  get,
  put
}
