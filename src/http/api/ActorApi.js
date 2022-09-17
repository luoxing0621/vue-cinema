import myAxios from '../MyAxios'
import BASEURL from '../BaseUrl'
const actorApi={
  // 添加演员接口
 add(params){
  return myAxios.post(BASEURL+'/movie-actor/add',params)
 },
//  查询演员
 list(params){
   return myAxios.get(BASEURL+'/movie-actors',params
   )
 },
 // 删除演员接口  
 delete(params){
  return myAxios.post(BASEURL+'/movie-actor/del',params)
 }, 
//  模糊查询，通过姓名name
listByName(params){
  return myAxios.post(BASEURL+'/movie-actors/name',params)
}
}
export default actorApi;