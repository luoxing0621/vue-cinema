import myAxios from '../MyAxios'
import BASEURL from '../BaseUrl'
const CinemaApi={
  // 添加电影院接口
 add(params){
  return myAxios.post(BASEURL+'/cinema/add',params)
 },
// 查询电影院标签
queryAllTags(){
  return myAxios.get(BASEURL+'/cinema/tags')
},
// 查询所有电影院
list(){
  return myAxios.get(BASEURL+'/cinemas')
},
delete(params){
  return myAxios.post(BASEURL+'/cinema/del',params)
},
// 通过id查询电影院
queryById(params){
  return myAxios.get(BASEURL+'/cinema/query',params)
},
// 通过id修改电影院
update(params){
  return myAxios.post(BASEURL+'/cinema/update',params)
}
}
export default CinemaApi;