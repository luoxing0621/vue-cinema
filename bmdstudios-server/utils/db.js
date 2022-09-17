// 加载mysql模块
const mysql=require('mysql')
const pool=mysql.createPool({
  connectionLimit:20,  //最大连接数
  host:'127.0.0.1',   //主机地址
  user:'root',    //用户名
  password:'',
  database:'bmdstudios'
})
// 为pool新增一个方法，同步执行sql方法
pool.querySync=(sql,params)=>{
  return new Promise((resolve,reject)=>{
    pool.query(sql,params,(error,result)=>{
      if(error){
        reject(error)
      }else{
        resolve(result)
      }
    })
  })
}

module.exports = pool;