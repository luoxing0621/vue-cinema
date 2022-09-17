/****定义剧照模块相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');


// http://localhost:3000/movie-thumb/add
router.post('/movie-thumb/add',(req,res)=>{
  let {url,movie_id}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    url:Joi.string().required(), //name 必填项
    movie_id:Joi.string().required() //name 必填项
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='insert into movie_thumb (url,movie_id) values (?,?)'
  pool.query(sql,[url,movie_id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 删除剧照接口
//http://localhost:3000/movie-thumb/del
router.post('/movie-thumb/del',(req,res)=>{
  let {id}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    id: Joi.string().required(),
  })
  let {error,value}=schema.validate(req.body)
  if(error){   
     res.send(Response.error(400,error))
    //  return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='delete from movie_thumb where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 通过movieId查询所有剧照接口
router.get('/movie-thumbs/movieid',(req,res)=>{
  let {movie_id}=req.query
  let schema=Joi.object({
    movie_id: Joi.string().required(),
  })
  let {error,value}=schema.validate(req.query)
  if(error){   
     res.send(Response.error(400,error))
     return;  //结束
  }
  // 执行sql
  let sql=`select * from movie_thumb where movie_id=?`
  pool.query(sql,[movie_id],(error,result)=>{
    if(error){
      res.send(Response.error(500,error))
      throw error
    }
      res.send(Response.ok(result))
  })
})



// 将router对象暴露出去
module.exports=router;