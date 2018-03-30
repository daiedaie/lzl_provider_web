import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '邻之邻 - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/form/article-publish/preview.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

export const service = {
    path: '/service',
    name: 'service',
    meta: {
        title: '退货退款'
    },
    component: () => import('@/views/service/service.vue')
};

export const refundMoney = {
		path: '/refund-money',
		name: 'refund-money',
		meta: {
			title: '仅退款'
		},
		component: () => import('@/views/service/components/refund-money.vue')
};

export const refundGoods = {
		path: '/refund-goods',
		name: 'refund-goods',
		meta: {
			title: '仅退货'
		},
		component: () => import('@/views/service/components/refund-goods.vue')
};

export const changeGoods = {
		path: '/change-goods',
		name: 'change-goods',
		meta: {
			title: '仅换货'
		},
		component: () => import('@/views/service/components/change-goods.vue')
};

export const refundMoneyGoods = {
		path: '/refund-money-goods',
		name: 'refund-money-goods',
		meta: {
			title: '退货退款'
		},
		component: () => import('@/views/service/components/refund-money-goods.vue')
};

export const refundOthers = {
		path: '/refund-others',
		name: 'refund-others',
		meta: {
			title: '退货退款'
		},
		component: () => import('@/views/service/components/refund-others.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue') }, // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	{
        path: '/provider-system',
        icon: 'social-windows',
        name: 'provider-system',
        title: '系统管理',
        //access: 'userAccess',   
        component: Main,
        children: [
            { path: 'providerUser', title: '管理员管理', name: 'providerUser', access: 'providerUser:read',icon: 'ios-person', component: () => import('@/views/provider/provider-user.vue') },
            { path: 'providerRoles', title: '角色管理', name: 'providerRoles', access: 'providerRoles:read',icon: 'ios-people', component: () => import('@/views/provider/provider-roles.vue') },
            { path: 'systemResources', title: '资源管理', name: 'system-resources', access: 'systemResources:read',icon: 'android-folder', component: () => import('@/views/system/system-resources.vue') }
        ]
    },
	/**
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
        ]
    },
    */
    {
        path: '/orders',
        icon: 'ios-grid-view',
        name: 'orders',
        title: '订单管理',
        access: 'orders',
        component: Main,
        children: [
            { path: 'sellerOrder', title: '商家订单', name: 'seller-order',icon: 'search', component: () => import('@/views/orders/seller-order.vue') }
        ]
    },
    /*{
        path: '/providerOrders',
        icon: 'ios-grid-view',
        name: 'providerOrders',
        title: '供应商订单',
        //access: 'dontShow',
        component: Main,
        children: [
            { path: 'provider-Orders', title: '订单管理', name: 'provider-Orders', icon: 'android-list', component: () => import('@/views/provider-orders/provider-orders.vue') }
        ]
    },*/
    {
        path: '/goodsIndex',
        icon: 'ios-grid-view',
        name: 'goodsView',
        title: '商品详情',
        //access: 'goods',
        component: Main,
        children: [
            { path: 'goods', title: '商品管理', access: 'goods', name: 'goods', icon: 'android-cart', component: () => import('@/views/goods/goods.vue') }
        ]
    },
    {
        path: '/purchase',
        icon: 'social-windows',
        name: 'purchase',
        title: '采购管理',
        component: Main,
        children: [
        	{ path: 'provider-Orders', title: '订单管理', name: 'provider-Orders', icon: 'android-list', component: () => import('@/views/purchase/provider-orders/provider-orders.vue') },
        	//{ path: 'providerOrders', title: '订单服务', name: 'providerOrders', icon: 'android-list', component: () => import('@/views/purchase/provider-orders/provider-orders.vue') },
        	{ path: 'check-Orders', title: '订单审核', name: 'check-Orders', icon: 'android-list', component: () => import('@/views/purchase/check-orders/check-orders.vue') },
        	{ path: 'goods-Arrival', title: '采购到货通知', name: 'goodsArrival', icon: 'android-list', component: () => import('@/views/purchase/goods-arrival/goods-arrival.vue') },
        	{ path: 'arrival-Check', title: '入库验收', name: 'arrivalCheck', icon: 'android-list', component: () => import('@/views/purchase/arrival-check/arrival-check.vue') },
        	{ path: 'refund-Service', title: '售后服务', name: 'refundService', icon: 'android-list', component: () => import('@/views/purchase/refund-service/refund-service.vue') },
        	//{ path: 'refund', title: '退款退货管理', name: 'refund', access: 'refund:read',icon: 'ios-person', component: () => import('@/views/refund/refund.vue') },
            //{ path: 'invoice', title: '发票管理', name: 'invoice', access: 'invoice:read',icon: 'ios-people', component: () => import('@/views/invoice/invoice.vue') }
        ]
    },
    {
    	path: '/baseParts',
    	icon: 'social-windows',
    	name: 'baseParts',
    	title: '基础设施',
    	component: Main,
    	children: [
    		{ path: 'measureGroup', title: '计量单位组管理', name: 'measure-group', access: 'measureGroup:read',icon: 'ios-person', component: () => import('@/views/base-parts/measure-group/measure-group.vue') },
    		{ path: 'measure', title: '计量单位管理', name: 'measure', access: 'measure:read',icon: 'ios-person', component: () => import('@/views/base-parts/measure/measure.vue') },
    		{ path: 'providerType', title: '单位类别管理', name: 'provider-type', access: 'providerType:read',icon: 'ios-person', component: () => import('@/views/base-parts/provider-type/provider-type.vue') },
    		{ path: 'goodsAttribute', title: '商品性质管理', name: 'goods-attribute', access: 'goodsAttribute:read',icon: 'ios-person', component: () => import('@/views/base-parts/goods-attribute/goods-attribute.vue') },
    		{ path: 'goodsCate', title: '商品类别管理', name: 'goods-cate', access: 'goodsCate:read',icon: 'ios-person', component: () => import('@/views/goods/goods-cate.vue') },
    		{ path: 'repository', title: '仓库管理', name: 'repository', access: 'repository:read',icon: 'ios-person', component: () => import('@/views/base-parts/repository/repository.vue') },
    		{ path: 'taxRate', title: '税率管理', name: 'tax-rate', access: 'taxRate:read',icon: 'ios-people', component: () => import('@/views/base-parts/tax-rate/tax-rate.vue') }
    	]
    },
    {
        path: '/test',
        icon: 'ios-grid-view',
        name: 'test',
        title: '测试',
        component: Main,
        children: [
            { path: 'testPage', title: '测试页', name: 'testPage', icon: 'ios-analytics', component: () => import('@/views/test-page/testPage.vue') }
        ]
    },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404,
    service,
    refundMoney,
    refundGoods,
    changeGoods,
    refundMoneyGoods,
    refundOthers
];
