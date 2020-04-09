import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import user from '../components/user/user.vue'
import rights from '../components/rights/rights.vue'
import roles from '../components/roles/roles.vue'
import cate from '../components/categories/categories.vue'
import params from '../components/params/params.vue'
import goodsList from '../components/goods/goods.vue'
import add from '../components/goods/add.vue'
import order from '../components/orders/orders.vue'
import report from '../components/reports/reports.vue'
import welcome from '../components/welcome.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: user
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/categories',
        component: cate
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/goods',
        component: goodsList
      },
      {
        path: '/goods/add',
        component: add
      },
      {
        path: '/orders',
        component: order
      },
      {
        path: '/reports',
        component: report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router