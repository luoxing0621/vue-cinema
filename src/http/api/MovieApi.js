import myAxios from '../MyAxios'
import BASEURL from '../BaseUrl'
const MovieApi={
  // 添加电影接口
 add(params){
  return myAxios.post(BASEURL+'/movie-info/add',params)
 },
//  查询电影类别列表
 listAllMovieType(){
  return myAxios.get(BASEURL+'/movie-types')
 },
//  查询所有电影
 list(params){
  return myAxios.get(BASEURL+'/movie-infos',params)
 },
//  删除电影
delete(params){
  return myAxios.post(BASEURL+'/movie-info/del',params)
},
// 通过ID查询电影
queryById(params){
  return myAxios.get(BASEURL+'/movie-info/query',params)
},
update(params){
  return myAxios.post(BASEURL+'/movie-info/update',params)
},
// 为电影绑定演员列表
bindActors(params){
  return myAxios.post(BASEURL+'/movie-info/bind-actors',params)
},
// 通过movieId，查询演员列表
listByMovieId(params){
  return myAxios.get(BASEURL+'/movie-actors/movieid',params)
},
//  通过名字模糊查询所有电影
listByName(params){
  return myAxios.post(BASEURL+'/movie-infos/name',params)
 },

}
export default MovieApi;