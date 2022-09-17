import myAxios from '../MyAxios'
import BASEURL from '../BaseUrl'
const movieThumbApi={
  // 添加剧照接口
 add(params){
  return myAxios.post(BASEURL+'/movie-thumb/add',params)
 },

//  查询响应id下所有剧照
 listByMovieId(params){
  return myAxios.get(BASEURL+'/movie-thumbs/movieid',params)
 },
//  删除剧照
delete(params){
  return myAxios.post(BASEURL+'/movie-thumb/del',params)
},

}
export default movieThumbApi;