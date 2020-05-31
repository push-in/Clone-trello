import Vue from 'vue'
import VueRouter from 'vue-router'

import Board from './../pages/Board'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { 
      path: '/', 
      name: 'board', 
      component: Board
    }
  ]
})