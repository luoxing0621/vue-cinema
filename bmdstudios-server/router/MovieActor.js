/****定义电影演员相关的接口 */
const express=require('express')
const router=express.Router()
// 引入响应信息
const Response=require('../utils/Response.js')
// 引入mysql连接池
const pool=require('../utils/db.js')
// 通过router对象定义接口来实现业务
const Joi = require('joi');

// 通过姓名关键字查询演员
// http://localhost:3000/movie-actors/name
router.post('/movie-actors/name',(req,res)=>{
  let {name}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    name:Joi.string().required() //name 必填项
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='select * from movie_actor where actor_name like ?'
  pool.query(sql,[`%${name}%`],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok(result))
  })
})

// 添加演员接口
 // http://localhost:3000/movie-actor/add
router.post('/movie-actor/add',(req,res)=>{
  let {actorName,actorAvatar}=req.body
  // 服务器表单验证
  let schema=Joi.object({
    actorName:Joi.required(),  //page必须是数组 必填项
    actorAvatar:Joi.required()  
  })
  let {error,value}=schema.validate(req.body)
  if(error){    res.send(Response.error(400,error))
    // return;  //结束
  }
  // 如果表单验证成功，执行添加操作
  let sql='insert into movie_actor (actor_name,actor_avatar) values (?,?)'
  pool.query(sql,[actorName,actorAvatar],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 删除演员接口
//http://localhost:3000/movie-actor/del
router.post('/movie-actor/del',(req,res)=>{
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
  let sql='delete from movie_actor where id= ?'
  pool.query(sql,[id],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err
    }
    res.send(Response.ok())
  })
})
// 查询所有演员接口
// http://localhost:3000/movie-actors?page=1&pagesize=10
const jwt=require('jsonwebtoken')
router.get('/movie-actors',(req,res)=>{
  // 获取请求参数，get请求的参数封装在req.query中
  let {page,pagesize}=req.query
  // 服务器端的表单验证
  let schema=Joi.object({
    page:Joi.number().required(),  //page必须是数组 必填项
    pagesize:Joi.number().integer().required()  
  })
 let {error,value} =schema.validate(req.query)  //验证的是对象--- let {page,pagesize}=req.query
 if(error){
  res.send(Response.error(400,error))
  // return  //结束
 }
  // 查询数据库  movie-actor
  let startIndex=(page-1)*10
  let size=parseInt(pagesize)
  let sql='select * from movie_actor limit ?,?'
  pool.query(sql,[startIndex,size],(err,result)=>{
    if(err){
      res.send(Response.error(500,err))
      throw err;    ///如果有错误，服务器会崩
    }
    // 将结果封装，返回客户端
    res.send(Response.ok(result))
  })
})

// 通过movieid查询演员列表
router.get('/movie-actors/movieid',(req,res)=>{
  // 获取请求参数，get请求的参数封装在req.query中
  let {movie_id}=req.query
  let schema=Joi.object({
    movie_id:Joi.string().required()  
  })
 let {error,value} =schema.validate(req.query)  
 if(error){
  res.send(Response.error(400,error))
   return  //结束
 }
//  sql语句
let sql=`select ma.id actor_id,mima.movie_id movie_id,ma.actor_name actor_name,ma.actor_avatar actor_avatar from movie_actor ma join movie_info_map_actor mima on ma.id=mima.actor_id where mima.movie_id=?`
pool.query(sql,[movie_id],(error,result)=>{
  if(error){
    res.send(Response.error(500,error))
    throw error
  }
  // 将结果封装，返回客户端
  res.send(Response.ok(result))
})

})


// 将router对象暴露出去
module.exports=router;