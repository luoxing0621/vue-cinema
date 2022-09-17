import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:JSON.parse(localStorage.getItem("user")),  //存储当前用户信息 
    token:localStorage.getItem("token"), 
  },
  getters: {
  },
  mutations: {
    // 清空用户状态
    clearUserState(state){
      state.user=undefined
      state.token=undefined
      localStorage.clear()
    },
    // 登录成功后将会得到用户信息与token字符串
    saveUserState(state,payload){
      state.user=payload.user
      state.token=payload.token
      // 存入localstorage
      localStorage.setItem("token",payload.token)
      localStorage.setItem('user',JSON.stringify(payload.user))
      localStorage.setItem('token',payload.token)


    }
  },
  actions: {
  },
  modules: {
  }
})
