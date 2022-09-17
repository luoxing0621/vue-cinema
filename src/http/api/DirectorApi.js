import myAxios from '../MyAxios'
import BASEURL from '../BaseUrl'
const directorApi={
  // 添加导演接口
 add(params){
  return myAxios.post(BASEURL+'/movie-director/add',params)
 },
//  查询导演
 list(params){
   return myAxios.get(BASEURL+'/movie-directors',params
   )
 },
 // 删除导演接口  
 delete(params){
  return myAxios.post(BASEURL+'/movie-director/del',params)
 }, 
//  模糊查询，通过姓名name
listByName(params){
  return myAxios.post(BASEURL+'/movie-directors/name',params)
}
}
export default directorApi;