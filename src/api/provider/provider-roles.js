import instance from '../index';
const preUrlPath = 'providerRoles';

//查询角色
const get = {
  r: params => {
    return instance.get(`${preUrlPath}`,{params})
  }
};

//修改角色
const put = {
  r: params => {
    return instance.put(`${preUrlPath}`, params)
  }
};

//删除管理员
const remove = {
  r: params => {
    return instance.delete(`${preUrlPath}/`+params)
  }
};

//新增管理员
const post = {
  r: params => {
    return instance.post(`${preUrlPath}`, params)
  }
};

//分配权限
// 分配权限时使用的是SystemResourcesRolesController，并没有使用${preUrlPath}
// 分配权限 是对 SystemResourcesRoles表的增删改查
const permission = {
  r: params => {
    return instance.put(`providerResourcesRoles`, params)
  }
};


//查询资源
// 查询资源时，使用的是ProviderRolesController，查询该角色下的所有资源
// 不过其底层使用的仍是systemResourcesService.getResourceIdByRoleId(roleId, scope)
// 根据角色ID查询资源
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
