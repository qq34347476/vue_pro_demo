import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/user/Users.vue'
import Roles from './components/authority/Roles.vue'
import Rights from './components/authority/Rights.vue'
import Goods from './components/goods/Goods.vue'
import Params from './components/goods/Params.vue'
import Categories from './components/goods/Categories.vue'
import Orders from './components/orders/Orders.vue'
import Reports from './components/reports/Reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/goods', component: Goods },
        { path: '/params', component: Params },
        { path: '/categories', component: Categories },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports }
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
