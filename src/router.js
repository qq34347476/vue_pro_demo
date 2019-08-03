import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/user/Users.vue'
// import Roles from './components/authority/Roles.vue'
import Rights from './components/authority/Rights.vue'
import Goods from './components/goods/Goods.vue'
import Params from './components/goods/Params.vue'
import Categories from './components/goods/Categories.vue'
import Orders from './components/orders/Orders.vue'
const Reports = () =>
  import(/* webpackChunkName: "group-foo" */ './components/reports/Reports.vue')
// import Reports from './components/reports/Reports.vue'
const Add = () =>
  import(/* webpackChunkName: "group-foo" */ './components/goods/add.vue')
// import Add from './components/goods/add.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/login',
      component: resolve => require(['./components/Login.vue'], resolve)
    },
    {
      path: '/home',
      redirect: '/welcome',
      component: resolve => require(['./components/Home.vue'], resolve),
      children: [
        {
          path: '/welcome',
          component: resolve => require(['./components/Welcome.vue'], resolve)
        },
        {
          path: '/users',
          component: resolve =>
            require(['./components/user/Users.vue'], resolve)
        },
        {
          path: '/roles',
          component: resolve =>
            require(['./components/authority/Roles.vue'], resolve)
        },
        { path: '/rights', component: Rights },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/categories', component: Categories },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports },
        { path: '/goods/add', component: Add }
      ]
    }
  ]
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
