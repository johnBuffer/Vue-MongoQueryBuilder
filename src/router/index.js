import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/main-area'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-area',
      component: HelloWorld
    }
  ]
})
