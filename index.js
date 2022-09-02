import Vue from 'vue'
import VueRouter from 'vue-router'
 
Vue.use(VueRouter)
Vue.use(require('vue-cookies'))
 
  const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/home.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../components/chat.vue')
  }
]
 
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = document.cookie;


  if (authRequired && !loggedIn) {
     next('/login');
  }
  else next()
  

 
})
 
export default router