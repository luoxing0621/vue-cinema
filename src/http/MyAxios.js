import axios from 'axios'

let instance=axios.create()
import qs from 'qs'
import store from '../store'
// 添加请求拦截器
instance.interceptors.request.use(config=>{
  let token=store.state.token
  if(token){
    config.headers.authorization=token
  }
  return config
})
// 添加响应拦截器
instance.interceptors.response.use(response=>{
  if(response.data.code==401){
    // 用户token失效
    window.location='/user/login'
  }else{
    return response
  }
 
})


const myAxios={
  get(url,params){
    return instance({
      method:'get',
      url:url,
      params:params  
     })
  },
  post(url,params){
    return instance({
      method:'post',
      url:url,
      // 将params对象转换为查询字符串 key=value&key2=value2
      data:qs.stringify(params) 
     })    
  }
}
export default myAxios