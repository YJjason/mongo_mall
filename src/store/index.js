/**
 * +----------------------------------------------------------------------
 * | index
 * +----------------------------------------------------------------------
 * | Author: 1009239228@qq.com
 * +----------------------------------------------------------------------
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: '',
  },
  mutations: {
    updateUserInfo(state, nickName) {
      state.nickName = nickName
    },
    updateCartCount(state, cartCount) {
      state.cartCount += parseInt(cartCount)
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount
    }
  }
})
export default store
