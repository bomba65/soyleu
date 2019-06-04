import Vue from 'vue'
import Router from 'vue-router'

import store from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Discussion from './views/Discussion.vue'
import NewDiscussion from './views/NewDiscussion.vue'
import EditDiscussion from './views/EditDiscussion.vue'
import MyDiscussions from './views/MyDiscussions.vue'

Vue.use(Router)

export const unrequireAuth = (to, from, next)  => {
  const isLogged = store.getters['isLogged']
  if (isLogged) {
    next(from.fullPath)
  } else {
    next()
  }
}
export const requireAuth = (to, from, next)  => {
  const isLogged = store.getters['isLogged']
  console.log(isLogged)
  if (isLogged) {
    next()
  } else {
    next(from.fullPath)
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/discussion/:id',
      name: 'Discussion',
      component: Discussion
    },
    {
      path: '/new/discussion/',
      name: 'NewDiscussion',
      component: NewDiscussion,
      beforeEnter: requireAuth
    },
    {
      path: '/edit/discussion/:id',
      name: 'EditDiscussion',
      component: EditDiscussion,
      beforeEnter: requireAuth
    },
    {
      path: '/my/discussions/',
      name: 'MyDiscussions',
      component: MyDiscussions,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: unrequireAuth
    },
  ]
})
